module.exports = {
	name: 'rpg-help',
	description: 'List all of Gimbot\'s GimmeRPG commands and what they are for.',
	aliases: ['rpgcommands'],
	cooldown: 5,
	execute(message, args) {
		const { rpgcommands } = message.client;
		const data = [];

		if (!args.length) {
			message.channel.send('Here\'s a list of all my GimmeRPG commands:' + '\n\n' + rpgcommands.map(rpgcommand => '**' + rpgcommand.name + '**' + '  ' + '*' + rpgcommand.description + '*').join('\n'));

		}
		else {
			if (!rpgcommands.has(args[0])) {
				return message.reply('that\'s not a valid command!');
			}

			const rpgcommand = rpgcommands.get(args[0]);

			message.channel.send(`**Name:** ${rpgcommand.name}`);

			if (rpgcommand.description) message.channel.send(`**Description:** ${rpgcommand.description}`);
			if (rpgcommand.aliases) message.channel.send(`**Aliases:** ${rpgcommand.aliases.join(', ')}`);
			if (rpgcommand.cooldown) message.channel.send(`**Cooldown:** ${rpgcommand.cooldown}`);
			if (rpgcommand.guildOnly) message.channel.send(`**Server only:** ${rpgcommand.guildOnly}`);

			data.push(`**Cooldown:** ${rpgcommand.cooldown || 3} second(s)`);
		}
	},
};
