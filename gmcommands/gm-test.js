module.exports = {
	name: 'gm-test',
	description: 'gm-test',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Test successful');
	},
};
