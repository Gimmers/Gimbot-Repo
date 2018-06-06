module.exports = {
	name: 'frogs',
	description: 'Yay for frogs!',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Yay for frogs!');
	},
};
