/*
	The purpose of this command is to give the player all of the available
	information about a specific item in the items table.
*/

const sqlite3 = require('sqlite3').verbose();
let item_type, item_name, item_description, item_cost, item_attbonus, item_defbonus, item_droprate;

module.exports = {
	name: 'rpg-item',
	description: 'Info about a specific item',
	cooldown: 5,
	execute(message) {
    const item_call = message.content;
    const item_check = item_call.slice(10);

    console.log(item_check);

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
    });

    setTimeout(function() {
      GetAndDisplayItem();
    }, 20);

    setTimeout(function() {
      SendItemInfo();
    }, 40);

    function GetAndDisplayItem() {
			item_type = ' ';
			item_name = ' ';
			item_description = ' ';
			item_cost = 0;
			item_attbonus = 0;
			item_defbonus = 0;
			item_droprate = 0;

      if (!item_check) {
        message.channel.send('Please follow the command with an item name. Eg: **rpg-item Basic Sword**');

      }
      else {
        db.get('SELECT * FROM items WHERE NAME = ?', [item_check], function(err, rows) {
          if (err) {
            return console.log(err.message);
          }
          else if (rows) {
            console.log(rows);
            item_type = rows.TYPE;
            item_name = rows.NAME;
            item_description = rows.DESCRIPTION;
            item_cost = rows.COST;
            item_attbonus = rows.ATTBONUS;
            item_defbonus = rows.DEFBONUS;
            item_droprate = rows.DROPRATE;
          }
          else{
            message.channel.send('That is not a valid item! For a list of purchasable items, type **rpg-shop**!');
          }
        });
      }
    }

    function SendItemInfo() {

      message.channel.send({
        'embed': {
        'title': `${item_name}`,
        'description': `Information about the ${item_name} in the GimmeRPG. If you would like to join, type **rpg-join**!`,
        'color': 25087,
        'thumbnail': {
          'url': 'https://image.freepik.com/free-icon/menu-items-rounded-square-button_318-30265.jpg',
        },
        'fields': [
          {
            'name': 'Name',
            'value': `${item_name}`,
            'inline': true,
          },
          {
            'name': 'Type',
            'value': `${item_type}`,
            'inline': true,
          },
          {
            'name': 'Description',
            'value': `${item_description}`,
            'inline': true,
          },
          {
            'name': 'Cost',
            'value': `${item_cost}`,
            'inline': true,
          },
          {
            'name': 'Attack bonus',
            'value': `${item_attbonus}`,
            'inline': true,
          },
          {
            'name': 'Defence bonus',
            'value': `${item_defbonus}`,
            'inline': true,
          },
          {
            'name': 'Droprate',
            'value': `${item_droprate}%`,
            'inline': true,
          },
        ],
      },
    });
  }
	},
};
