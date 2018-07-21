/*
	The purpose of this command is to allow the player to enter a dungeon.

	This code includes the ability to select a dungeon level, fight the monsters
	in that dungeon, receive the gold and exp from successful kills, and then check
	for a level up.

	All of these changes are tracked in the players database.

	To be added:
		- Balance
		- Item drops
*/

const sqlite3 = require('sqlite3').verbose();
const max_dungeon_level = 35;
const min_dungeon_level = 1;
const max_player_level = 35;
let player_stat_sum, monster_stat_sum, monster_minlvl, player_armour_stat_sum, player_weapon_stat_sum, player_shield_stat_sum;
let battle_over = false;
let level_change = false;

module.exports = {
	name: 'rpg-dungeon-level',
	description: 'Venture into a dungeon for loot and exp',
	cooldown: 60,

	execute(message) {
    const level_call = message.content;
    const level_check = level_call.slice(18);

		const dung_monsters = [];
		const dung_monsters_stats = [];
		const dung_monsters_minlvl = [];
		const dung_monsters_gold = [];
		const dung_monsters_exp = [];
		let player_level = 1;

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
   });

	 if (min_dungeon_level < level_check <= max_dungeon_level) {
		 DungeonScenario(level_check);
	 }
	 else{
		 message.channel.send('Please enter a dungeon between level\'s 1 and 5.');
	 }

   function DungeonScenario(level) {
		 parseInt(level);
		 db.each('SELECT * FROM monsters WHERE ? BETWEEN MINLVL AND MAXLVL', [level], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else{
				 const monster_name = rows.NAME;
				 monster_minlvl = rows.MINLVL;
				 monster_stat_sum = rows.ATTBONUS + rows.DEFBONUS;
				 const monster_gold = rows.GOLD;
				 const monster_exp = rows.EXP;
				 dung_monsters.push(monster_name);
				 dung_monsters_stats.push(monster_stat_sum);
				 dung_monsters_minlvl.push(monster_minlvl);
				 dung_monsters_gold.push(monster_gold);
				 dung_monsters_exp.push(monster_exp);
			 }
		 });

		 db.each('SELECT LEVEL FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else{
				 player_level = rows.LEVEL;
			 }
		 });

		 GetPlayerStatSum();

		 setTimeout(function() {
			 console.log('player level: ' + player_level);
			 DungeonCombat(level, dung_monsters, dung_monsters_minlvl, player_stat_sum, dung_monsters_stats, dung_monsters_gold, dung_monsters_exp, player_level);
		 }, 15);
   }

	 function GetPlayerStatSum() {
		 db.get('SELECT ARMOUR, SHIELD, WEAPON FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else{
				 const player_armour = rows.ARMOUR;
				 const player_weapon = rows.WEAPON;
				 const player_shield = rows.SHIELD;

				 db.get('SELECT ATTBONUS, DEFBONUS FROM items WHERE NAME = ?', [player_armour], function(err, row) {
					 if (err) {
						 return console.error(err.message);
					 }
					 else{
						 player_armour_stat_sum = row.ATTBONUS + row.DEFBONUS;
						 return player_armour_stat_sum;
					 }
				 });
				 db.get('SELECT ATTBONUS, DEFBONUS FROM items WHERE NAME = ?', [player_weapon], function(err, row) {
					 if (err) {
						 return console.error(err.message);
					 }
					 else{
						 player_weapon_stat_sum = row.ATTBONUS + row.DEFBONUS;
						 return player_weapon_stat_sum;
					 }
				 });
				 db.get('SELECT ATTBONUS, DEFBONUS FROM items WHERE NAME = ?', [player_shield], function(err, row) {
					 if (err) {
						 return console.error(err.message);
					 }
					 else{
						 player_shield_stat_sum = row.ATTBONUS + row.DEFBONUS;
						 return player_shield_stat_sum;
					 }
				 });

				 setTimeout(function() {
					 player_stat_sum = player_armour_stat_sum + player_weapon_stat_sum + player_shield_stat_sum;
					 console.log('player_stat_sum: ' + player_stat_sum);
				 }, 5);
			 }
		 });
	 }

	 function DungeonCombat(level, monsters, min_lvl, player_stats, monster_stats, monster_gold, monster_exp, player_level) {
		 if (!battle_over) {
			 let total_gold_earned = 0;
			 let total_exp_earned = 0;
			 let monster;
			 let log_chance_change = 0;
			 let win_chance = 0;

			 for (monster = 0; monster < monsters.length; monster++) {
				 const difficulty_increase = ((level + 1) - min_lvl[monster]);
				 console.log('level: ' + level);
				 console.log('min_lvl[monster]: ' + min_lvl[monster]);
				 console.log('difficulty_increase: ' + difficulty_increase);
				 const difficulty_multiplier = (1 + (difficulty_increase / 10));
				 console.log('difficulty_multiplier: ' + difficulty_multiplier);
				 const base_win_chance = 0.5;
				 const stat_difference = ((player_stats - monster_stats[monster]) + (player_level - level));
				 console.log('Player stats: ' + player_stats);
				 console.log('Monster stats: ' + monster_stats[monster]);
				 console.log('Stat difference: ' + stat_difference);
				 const chance_change = (stat_difference * difficulty_multiplier);
				 if (stat_difference < 0) {
					 log_chance_change = Math.log(Math.abs(chance_change));
					 win_chance = base_win_chance - (log_chance_change / 10);
					 console.log('Log chance change = ' + log_chance_change + '   Win chance = ' + win_chance);
				 }
				 else if (stat_difference == 0) {
					 log_chance_change = Math.log(Math.abs(chance_change + 1));
					 win_chance = base_win_chance + (log_chance_change / 10);
					 console.log('Log chance change = ' + log_chance_change + '   Win chance = ' + win_chance);
				 }
				 else if (stat_difference > 0) {
					 log_chance_change = Math.log(Math.abs(chance_change + 1));
					 win_chance = base_win_chance + (log_chance_change / 10);
					 console.log('Log chance change = ' + log_chance_change + '   Win chance = ' + win_chance);
				 }
				 console.log('win chance: ' + win_chance);
				 const fight_simulation_number = Math.random();
				 console.log('outcome: ' + fight_simulation_number);
				 if ((monster != (monsters.length - 1)) && fight_simulation_number <= win_chance) {
					 message.channel.send(`You killed the **${monsters[monster]}**, gaining **${Math.round(monster_gold[monster] * (1 + difficulty_multiplier / 10))} gold** and **${Math.round(monster_exp[monster] * (1 + difficulty_multiplier / 30))} exp**!`);
					 total_gold_earned += Math.round(monster_gold[monster] * (1 + difficulty_multiplier / 10));
					 total_exp_earned += Math.round(monster_exp[monster] * (1 + difficulty_multiplier / 30));
				 }
				 else if((monster == (monsters.length - 1)) && fight_simulation_number <= win_chance) {
					 message.channel.send(`You killed the **${monsters[monster]}**, gaining **${Math.round(monster_gold[monster] * (1 + difficulty_multiplier / 10))} gold** and **${Math.round(monster_exp[monster] * (1 + difficulty_multiplier / 30))} exp**!`);
					 total_gold_earned += Math.round(monster_gold[monster] * (1 + difficulty_multiplier / 10));
					 total_exp_earned += Math.round(monster_exp[monster] * (1 + difficulty_multiplier / 30));

					 UpdatePlayerGoldExp(total_gold_earned, total_exp_earned, difficulty_increase);
					 return battle_over = true;
				 }
				 else{
					 message.channel.send(`You were bested by the **${monsters[monster]}**!`);
					 UpdatePlayerGoldExp(total_gold_earned, total_exp_earned, difficulty_increase);
					 return battle_over = true;
				 }
			 }
		 }
	 }

	 function UpdatePlayerGoldExp(gold, exp) {
		 let old_gold = 0;
		 let old_exp = 0;
		 let new_gold = 0;
		 let new_exp = 0;

		 db.get('SELECT GOLD FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else{
				 old_gold = rows.GOLD;
				 new_gold = old_gold + gold;
				 console.log('NEW GOLD: ' + new_gold);
				 return new_gold;
			 }
		 });

		 db.get('SELECT EXP FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else{
				 old_exp = rows.EXP;
				 new_exp = old_exp + exp;
				 console.log('NEW EXP: ' + new_exp);
				 return new_exp;
			 }
		 });

		 setTimeout(function() {
			 db.run('UPDATE players SET GOLD = ?, EXP = ? WHERE ID = ?', [new_gold, new_exp, message.author.id], function(err) {
				 if (err) {
					 return console.error(err.message);
				 }
				 else{
					 message.channel.send(`You return home with **${gold} gold** and **${exp} exp**`);
					 PlayerLevelUpCheck();
				 }
			 });
		 }, 15);
	 }

	 function PlayerLevelUpCheck() {
		 let level;
		 let player_exp = 0;
		 let player_level = 1;
		 let level_achieved = 0;

		 db.get('SELECT EXP, LEVEL FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else {
				 player_exp = rows.EXP;
				 return player_exp;
			 }
		 });

		 db.get('SELECT LEVEL FROM players WHERE ID = ?', [message.author.id], function(err, rows) {
			 if (err) {
				 return console.error(err.message);
			 }
			 else {
				 player_level = rows.LEVEL;
				 return player_level;
			 }
		 });

		 const first_level_up_requirement = 15.0;
		 const level_multiplier = 1.5;
		 let level_up_requirement;
		 setTimeout(function() {
			 level_change = false;
			 for (level = 1; level <= max_player_level; level++) {
				 level_up_requirement = first_level_up_requirement * Math.pow(level_multiplier, (level - 1));

				 if (player_level != (level - 1) && player_exp < level_up_requirement) {
					 level_achieved = (level - 1);
					 if (level_achieved == 0) {
						 level_achieved = 1;
						 return level_change = false;
					 }

					 return level_change = true;
				 }
				 else if (player_level == (level - 1) && player_exp < level_up_requirement) {

					 return level_change = false;
				 }
				 else{
					 level_change = false;
				 }
			 }
		 }, 15);

		 setTimeout(function() {
			 UpdatePlayerLevel(level_achieved, level_change);
			 return battle_over = false;
		 }, 20);
	 }

	 function UpdatePlayerLevel(level, change) {
		 if (change == true) {
			 db.run('UPDATE players SET LEVEL = ? WHERE ID = ?', [level, message.author.id], function(err) {
				 if (err) {
					 return console.error(err.message);
				 }
				 else{
					 // console.log('Level achieved 2: ' + level);
					 return message.channel.send(`You have achieved **level ${level}**!`);
				 }
			 });
		 }
	 }
 },
};
