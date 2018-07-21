//External requirements
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, botMakerID } = require('./config.json');

//Setup for command collections
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.gmcommands = new Discord.Collection();
client.rpgcommands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
	console.log('Ready!');
	client.user.setActivity('?help for commands');
});

// Standard commands----------------------------------------------------------------------------------------------------

client.on('message', message => {
	//Requirements to use a standard command. In this case, the command must begin with the prefix, and not be a bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		const guild = message.guild;
		const botMaker = guild.ownerID;

		console.error(error);
		message.reply(`There was an error trying to execute that command! <@${botMaker}> please fix.`);
	}
});

// Game Master commands----------------------------------------------------------------------------------------------------

const gmcommandFiles = fs.readdirSync('./gmcommands').filter(file => file.endsWith('.js'));

for (const file of gmcommandFiles) {
	const gmcommand = require(`./gmcommands/${file}`);
	client.gmcommands.set(gmcommand.name, gmcommand);
}

client.on('message', message => {
	//Requirements to use a GM command. In this case, the command must begin with the prefix, not be a bot, and be the GM.
	if (!message.content.startsWith(prefix) || message.author.bot || message.author.id != botMakerID) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const gmcommandName = args.shift().toLowerCase();

	const gmcommand = client.gmcommands.get(gmcommandName)
		|| client.gmcommands.find(cmd => cmd.aliases && cmd.aliases.includes(gmcommandName));

	if (!gmcommand) return;

	if (gmcommand.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (gmcommand.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (gmcommand.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${gmcommand.name} ${gmcommand.usage}\``;
		}

		return message.channel.send(reply);
	}


	try {
		gmcommand.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`There was an error trying to execute that gmcommand! <@${botMakerID}> please fix.`);
	}
});

// RPG commands----------------------------------------------------------------------------------------------------

const rpgcommandFiles = fs.readdirSync('./rpgcommands').filter(file => file.endsWith('.js'));

for (const file of rpgcommandFiles) {
	const rpgcommand = require(`./rpgcommands/${file}`);
	client.rpgcommands.set(rpgcommand.name, rpgcommand);
}

client.on('message', message => {
	//Requirements to use a standard command. In this case, the command must begin with the prefix, and not be a bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const rpgcommandName = args.shift().toLowerCase();

	const rpgcommand = client.rpgcommands.get(rpgcommandName)
		|| client.rpgcommands.find(cmd => cmd.aliases && cmd.aliases.includes(rpgcommandName));

	if (!rpgcommand) return;

	if (rpgcommand.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (rpgcommand.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (rpgcommand.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${rpgcommand.name} ${rpgcommand.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(rpgcommand.name)) {
		cooldowns.set(rpgcommand.name, new Discord.Collection());
	}

	const rpgnow = Date.now();
	const rpgtimestamps = cooldowns.get(rpgcommand.name);
	const rpgcooldownAmount = (rpgcommand.cooldown) * 1000;

	if (!rpgtimestamps.has(message.author.id)) {
		rpgtimestamps.set(message.author.id, rpgnow);
		setTimeout(() => rpgtimestamps.delete(message.author.id), rpgcooldownAmount);
	}
	else {
		const expirationTime = rpgtimestamps.get(message.author.id) + rpgcooldownAmount;

		if (rpgnow < expirationTime) {
			const timeLeft = (expirationTime - rpgnow) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${rpgcommand.name}\` command.`);
		}

		rpgtimestamps.set(message.author.id, rpgnow);
		setTimeout(() => rpgtimestamps.delete(message.author.id), rpgcooldownAmount);
	}


	try {
		rpgcommand.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`There was an error trying to execute that rpgcommand! <@${botMakerID}> please fix.`);
	}
});

client.login(token);
