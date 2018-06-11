const sqlite3 = require('sqlite3').verbose();
const max_level = 35;

module.exports = {
	name: 'rpg-dungeon-level',
	description: 'Venture into a dungeon for loot and exp',
	cooldown: 5,
	execute(message, args) {
    const level_call = message.content;
    const level_check = level_call.slice(18);

    console.log(level_check);

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
   });

   function DungeonScenario(level) {
     for (level = 1; level <= max_level; level++) {

     }
   }
 },
};
