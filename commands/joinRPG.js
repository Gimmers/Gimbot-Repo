//const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'joinRPG',
	description: 'Join the GimmeRPG on this server',
  guildOnly: true,
  cooldown: 5,

	execute(message, args) {
    message.channel.send('test');
    /* const db = new sqlite3.Database('./db/players.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the players database.');
    });

    db.run('INSERT INTO langs(name) VALUES(?)', [message.author], function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
    console.log('A row has been inserted with rowid ${this.lastID}');

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });*/
	},
};
