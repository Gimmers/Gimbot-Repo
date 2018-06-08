const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'gm-shop-init',
	description: 'Creates and populates the shop table',
  guildOnly: true,
  cooldown: 5,

	execute(message, args) {
     const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the gimmerpg database.');
    });

		db.run('CREATE TABLE shop(ITEM_ID int, TYPE varchar(255), NAME varchar(255), DESCRIPTION varchar(255), COST int)', function(err) {
			if (err) {
        return console.log(err.message);
      }
			console.log('Created the shop table.');
		});


		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[0, 'ARMOUR', 'Boiled Leather ', 'Leather that has been treated to become tough and rigid. Shaped into something that might protect you... Might.', 32],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[1, 'ARMOUR', 'Youthful Chainmail', 'Woven metal that is rumoured to remove wrinkles. It\'ll definitely deflect an arrow or two.', 83],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[2, 'ARMOUR', 'Reinforced Rockjaw Plate', 'From the hide of the hardy Rockjaw, reinforced with iron. This\'ll keep you safe.', 260],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[3, 'WEAPON', 'Basic Sword', 'A plain sword, for the average fellow who feels better having something pointy dangling from their hip.', 15],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[4, 'WEAPON', 'Cutlass', 'A pirate\'s life is a deadly one, and sometimes davy jones\' locker coughs up an unlucky soul\'s blade.', 78],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[5, 'WEAPON', 'Gorok Axe', 'A huge axe that would take two normal men to lift. Its crude grey metal has a rough, almost serated edge.', 220],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[6, 'SHIELD', 'Wooden Shield', 'A rough looking wooden shield. It\'s better than nothing.', 8],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[7, 'SHIELD', 'Steel Kiteshield', 'A shield carried by one the Fallen King\'s knights, from before he fell. It still has some dents, which are better than holes.', 108],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

		db.run('INSERT INTO shop(ITEM_ID, TYPE, NAME, DESCRIPTION, COST) VALUES(?, ?, ?, ?, ?)',
		[8, 'SHIELD', 'Stalwart Bulwark', 'Crafted by earthern spirits, deep in the Fuocon Mines, beneath the active Tontille Volcano. This would hold back a troll.', 365],
		function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('Insert item into the shop.');
		});

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
	},
};
