const sqlite3 = require('sqlite3').verbose();

let name, gold, exp, level, armour, weapon, shield;

module.exports = {
	name: 'rpg-stats',
	description: 'Get your stats from GimmeRPG',
	cooldown: 5,
	execute(message, args) {
    let ID = message.author.id;
    let NAME, GOLD, EXP, LEVEL, ARMOUR, WEAPON, SHIELD;
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

          message.channel.send(`Your stats are: \n\n NAME: ${name}\n GOLD: ${gold}\n EXP: ${exp}\n LEVEL: ${level}\n ARMOUR: ${armour}\n WEAPON: ${weapon}\n SHIELD: ${shield}\n`);
        }
        else {
          message.channel.send(`${message.author.username} has no stats! You can join the rpg by typing **rpg-join**.`);
        }
        console.log('Select all from the database.');
      });
    }
	},
};
