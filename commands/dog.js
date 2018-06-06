const snekfetch = require('snekfetch');

module.exports = {
	name: 'dog',
	description: 'What kind of dog should you get?',
	cooldown: 5,
	async execute(message, args) {
    const { body } = await snekfetch.get('https://dog.ceo/api/breeds/image/random');
    const dog = body.message;

    let getSegment = function (url, index) {
      return url.replace(/^https?:\/\//, '').split('/')[index];
    };
    const breed = getSegment(dog, 2);
		message.channel.send(`You should get a ${breed}!`, { files: [dog] });
	},
};
