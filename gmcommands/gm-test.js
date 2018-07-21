/*
	The purpose of this command is to test that gmcommands are working.
*/

module.exports = {
	name: 'gm-test',
	description: 'gm-test',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Test successful');
	},
};
