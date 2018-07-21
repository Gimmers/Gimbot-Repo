/*
	The purpose of this command is to allow the player to see their stats, items and gold.
*/

const sqlite3 = require('sqlite3').verbose();

let name, gold, exp, level, armour, weapon, shield;

module.exports = {
	name: 'rpg-stats',
	description: 'Get your stats',
	aliases: ['rpgstats'],
	cooldown: 5,
	execute(message, args) {
    const ID = message.author.id;
    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
    });

		GetAndDisplayStats();

    function GetAndDisplayStats() {
      db.get('SELECT * FROM players WHERE ID = ?', [ID], function(err, rows) {
        if (err) {
          return console.log(err.message);
        }
        else if (rows) {
          console.log(rows);
          name = rows.NAME;
          gold = rows.GOLD;
          exp = rows.EXP;
          level = rows.LEVEL;
          armour = rows.ARMOUR;
          weapon = rows.WEAPON;
          shield = rows.SHIELD;

					message.channel.send({
						'embed': {
						'title': `${message.author.username}'s stats`,
						'description': `The stats of ${message.author.username} in the GimmeRPG. If you would like to join, type **rpg-join**!`,
						'color': 1168896,
						'thumbnail': {
							'url': 'https://image.freepik.com/free-icon/business-stats-bars-graphic_318-32837.jpg',
						},
						'fields': [
								{
									'name': 'Name',
									'value': `${name}`,
									'inline': true,
								},
								{
									'name': 'Gold',
									'value': `${gold}`,
									'inline': true,
								},
								{
									'name': 'Level',
									'value': `${level}`,
									'inline': true,
								},
								{
									'name': 'Experience',
									'value': `${exp}`,
									'inline': true,
								},
								{
									'name': 'Armour',
									'value': `${armour}`,
									'inline': true,
								},
								{
									'name': 'Weapon',
									'value': `${weapon}`,
									'inline': true,
								},
								{
									'name': 'Shield',
									'value': `${shield}`,
									'inline': true,
								},
							],
						},
					});
        }
        else {
          message.channel.send(`${message.author.username} has no stats! You can join the rpg by typing **rpg-join**.`);
        }
        console.log('Select all from the database.');
      });
    }
	},
};
