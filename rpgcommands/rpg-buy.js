/*
The purpose of this command is to allow a player to buy an item from the shop.

This is only possible if the user has the gold required to buy the item.

If they purchase the item, it will be added to their field in the players table.

It will overwrite the item that was previously held in that players equivalent slot.

Eg. If a player buys a new sword, it will overwrite their previous weapon regardless
of whether it is better or worse stats-wise.
*/

const sqlite3 = require('sqlite3').verbose();
let item_id, item_type, item_name, item_description, item_cost, item_attbonus, item_defbonus, item_droprate;
let player_id, player_gold, player_armour, player_weapon, player_shield;

module.exports = {
	name: 'rpg-buy',
	description: 'Buy an item from the shop',
	cooldown: 5,
	execute(message, args) {
    const item_call = message.content;
    const item_check = item_call.slice(9);
    player_id = message.author.id;

    console.log(item_check);

    const db = new sqlite3.Database('./db/gimmerpg.db', (err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Connected to the gimmerpg database.');
    });

    setTimeout(function() {
      GetAndBuyItem();
    }, 20);

    function GetAndBuyItem() {
      item_id = 0;
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
            item_id = rows.ITEM_ID;
            item_type = rows.TYPE;
            item_name = rows.NAME;
            item_description = rows.DESCRIPTION;
            item_cost = rows.COST;
            item_attbonus = rows.ATTBONUS;
            item_defbonus = rows.DEFBONUS;
            item_droprate = rows.DROPRATE;

            CheckPlayerGold(player_id, item_cost);
          }
          else{
            message.channel.send('That is not a valid item! For a list of purchasable items, type **rpg-shop**!');
          }
        });
      }
    }

    function SendBuyComplete() {
      message.channel.send(`You have purchased ${item_name}. Check your stats with **rpg-stats**!`);
    }

    function PutItemInPlayerTable(name, type, player) {
      if (type == 'ARMOUR') {
        db.run('UPDATE players SET ARMOUR = ? WHERE ID = ?', [name, player], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      }
      else if (type == 'WEAPON') {
        db.run('UPDATE players SET WEAPON = ? WHERE ID = ?', [name, player], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      }
      else if (type == 'SHIELD') {
        db.run('UPDATE players SET SHIELD = ? WHERE ID = ?', [name, player], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      }
    }

    function CheckPlayerGold(player, cost) {
      db.get('SELECT GOLD FROM players WHERE ID = ?', [player], function(err, rows) {
        if (err) {
          return console.log(err.message);
        }
        else if (rows) {
          player_gold = rows.GOLD;

          if (player_gold < cost) {
            message.channel.send('You can\'t afford that. Please consider making some more money, or purchase something cheaper.');
          }
          else{
            player_gold -= cost;
            PutItemInPlayerTable(item_name, item_type, player_id);
            SendBuyComplete();
            setTimeout(function() {
              RemoveGoldFromPurchase(player_id, player_gold);
            }, 20);
          }
        }
      });
    }

    function RemoveGoldFromPurchase(player, gold) {
      db.run('UPDATE players SET GOLD = ? WHERE ID = ?', [gold, player], function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    }
	},
};
