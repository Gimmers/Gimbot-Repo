/*
The purpose of this command is to initialise the monsters table for the GimmeRPG database.
*/

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'gm-monsters-init',
	description: 'Creates and populates the monsters table',
  guildOnly: true,
  cooldown: 5,

	execute(message, args) {
     const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the gimmerpg database.');
    });

		db.run('CREATE TABLE monsters(MONSTER_ID int, NAME varchar(255), DESCRIPTION varchar(255), ATTBONUS int, DEFBONUS int, GOLD int, EXP int, MINLVL int, MAXLVL int)', function(err) {
			if (err) {
        return console.log(err.message);
      }
			console.log('Created the monsters table.');
		});


		db.run('INSERT INTO monsters(MONSTER_ID, NAME, DESCRIPTION, ATTBONUS, DEFBONUS, GOLD, EXP, MINLVL, MAXLVL) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[0, 'Slime', 'A gooey, green, gelatinous globule that gawkishly governs the gateway to the grotto (dungeon)', -10, -10, 1, 5, 1, 10],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert monster into the monsters table.');
		});

    db.run('INSERT INTO monsters(MONSTER_ID, NAME, DESCRIPTION, ATTBONUS, DEFBONUS, GOLD, EXP, MINLVL, MAXLVL) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[1, 'Molerat', 'It\'s got big teeth, and it\'s aggressive, but its eyes are small and useless', -3, -5, 1, 8, 1, 10],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert monster into the monsters table.');
		});

    db.run('INSERT INTO monsters(MONSTER_ID, NAME, DESCRIPTION, ATTBONUS, DEFBONUS, GOLD, EXP, MINLVL, MAXLVL) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[2, 'Goblin', 'A short, bluish skinned creature with a hooked nose and an obscene attitude. It reminds you of the local youth', 2, -2, 3, 18, 3, 15],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert monster into the monsters table.');
		});

    db.run('INSERT INTO monsters(MONSTER_ID, NAME, DESCRIPTION, ATTBONUS, DEFBONUS, GOLD, EXP, MINLVL, MAXLVL) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[3, 'Skeleton', 'Animated bones armed with a slightly curved sword and a buckler which clearly didn\'t do the job last time', 7, 5, 9, 32, 10, 30],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert monster into the monsters table.');
		});

    db.run('INSERT INTO monsters(MONSTER_ID, NAME, DESCRIPTION, ATTBONUS, DEFBONUS, GOLD, EXP, MINLVL, MAXLVL) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[4, 'Screecher', 'A bat that when upright can reach up to 3 feet tall. Named after the noise it makes when attacking its prey, you don\'t want anything to do with those teeth, or talons', 14, 3, 11, 48, 13, 35],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert monster into the monsters table.');
		});

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
	},
};
