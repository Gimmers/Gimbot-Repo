module.exports = {
	name: 'serverinfo',
	description: 'Information about the server',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};
