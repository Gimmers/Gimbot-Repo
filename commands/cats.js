module.exports = {
	name: 'cats',
	description: 'Yay for frogs!',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Why !cats, when you can !frogs?');
	},
};
