const sqlite3 = require('sqlite3').verbose();

let type, name, description, cost;
let shop_string;

module.exports = {
	name: 'rpg-shop',
	description: 'See what\'s in the GimmeRPG shop',
	cooldown: 5,
	execute(message, args) {

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
    });

    message.channel.send('Please browse the shop\'s wares. You can buy an item with **?rpg-buy item**, replacing item with the name of the item you wish to purchase. \n *Please be patient as the shop takes time to load.*');

		GetAndDisplayShop();

    function GetAndDisplayShop() {
      let i;
      for (i = 0; i < 9; i++) {
        db.get('SELECT * FROM shop WHERE ID = ?', [i], function(err, rows) {
          if (err) {
            return console.log(err.message);
          }
          else if (rows) {
            console.log(rows);
            type = rows.TYPE;
            name = rows.NAME;
            description = rows.DESCRIPTION;
            cost = rows.COST;

            shop_string += `Type: ${type}   Name: **${name}**   Description: *${description}*   Cost: **${cost}** \n\n`;
          }
        });
      }
      console.log('Display the shop');
      setTimeout(function() {
        SendShopString();
      }, 20);
    }

    function SendShopString() {
      message.channel.send(shop_string);
    }
	},
};
