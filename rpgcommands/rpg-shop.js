/*
	The purpose of this command is to allow the player to view the contents
	of the GimmeRPG shop.
*/

const sqlite3 = require('sqlite3').verbose();

let name, cost, type, shop_name_string, shop_cost_string/*, shop_type_string*/;

module.exports = {
	name: 'rpg-shop',
	description: 'See what\'s in the GimmeRPG shop',
	aliases: ['rpgshop'],
	cooldown: 5,
	execute(message, args) {

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
    });

    message.channel.send('Please browse the shop\'s wares. You can buy an item with **?rpg-buy item**, replacing item with the name of the item you wish to purchase.');

		GetAndDisplayShop();

    function GetAndDisplayShop() {
      shop_name_string = ' ';
      shop_cost_string = ' ';
      shop_type_string = ' ';
      let i;
      for (i = 0; i < 9; i++) {
        db.get('SELECT * FROM shop WHERE ITEM_ID = ?', [i], function(err, rows) {
          if (err) {
            return console.log(err.message);
          }
          else if (rows) {
            console.log(rows);
            name = rows.NAME;
            cost = rows.COST;
            type = rows.TYPE;

            shop_name_string += `${name}\n\n`;
            shop_cost_string += `${cost}\n\n`;
            shop_type_string += `${type}\n\n`;
          }
        });
      }
      console.log('Display the shop');
      setTimeout(function() {
        SendShopString();
      }, 30);
    }

    function SendShopString() {
        message.channel.send({
          'embed': {
          'title': 'GimmeRPG Shop',
          'description': 'The inventory available for purchase from the GimmeRPG shop. Part of the GimmeRPG, if you would like to join, type **rpg-join**!',
          'color': 16760576,
          'thumbnail': {
            'url': 'https://st.depositphotos.com/1732591/2676/v/950/depositphotos_26762727-stock-illustration-medieval-knight-helmet-shield-crossed.jpg',
          },
          'fields': [
              {
                'name': 'NAME',
                'value': shop_name_string,
                'inline': true,
              },
              /* {
                'name': 'TYPE',
                'value': shop_type_string,
                'inline': true,
              },*/
              {
                'name': 'COST',
                'value': shop_cost_string,
                'inline': true,
              },
            ],
          },
        });
    }
  },
};
