/*
	The purpose of this command is to allow the discord user to join the GimmeRPG.
	This command adds them to the players table and populates it with the default stats
	and items.
*/

const sqlite3 = require('sqlite3').verbose();

let name, gold, exp, level, armour, weapon, shield;
let player_exists = false;

module.exports = {
	name: 'rpg-join',
	description: 'Join the GimmeRPG on this server',
	aliases: ['rpgjoin'],
  guildOnly: true,
  cooldown: 5,

	execute(message, args) {
		let ID = message.author.id;
		let NAME = message.author.username;
		let GOLD = 0;
		let EXP = 0;
		let LEVEL = 1;
		let ARMOUR = 'Loincloth';
		let WEAPON = 'Bare hands';
		let SHIELD = 'None';


     const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the gimmerpg database.');
    });

		db.run('CREATE TABLE players(ID int, NAME varchar(255), GOLD int, EXP int, LEVEL int, ARMOUR varchar(255), WEAPON varchar(255), SHIELD varchar(255))', function(err) {
			if (err) {
        return console.log(err.message);
      }
			console.log('Created the players table.');
		});

		db.get('SELECT ID FROM players WHERE ID = ?', [ID], function(err, rows) {
			if (err) {
				return console.log(err.message);
			}
			console.log(rows);
			if (rows == null) {
				console.log('No players in the database to check against.');
				player_exists = false;
			}
			else if (rows.ID != null) {
				console.log('Player exists.');
				player_exists = true;
			}

			if (player_exists == false) {
				db.run('INSERT INTO players(ID, NAME, GOLD, EXP, LEVEL, ARMOUR, WEAPON, SHIELD) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [ID, NAME, GOLD, EXP, LEVEL, ARMOUR, WEAPON, SHIELD], function(err) {
					if (err) {
						return console.log(err.message);
					}
					console.log('Insert stats into the database.');
					console.log(`A row has been inserted with rowid ${this.lastID}`);
				});
				message.channel.send('You have joined the rpg! Type **?rpg-stats** to see your stats.');
			}
			else {
				message.channel.send('You are already in the RPG!');
				return;
			}
		});

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
	},
};
