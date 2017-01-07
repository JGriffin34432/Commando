const { Command } = require('discord.js-commando');

const UserProfile = require('../../postgreSQL/models/UserProfile');

module.exports = class PersonalMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'personal-message',
			aliases: ['set-personal-message', 'set-biography', 'biography', 'set-bio', 'bio'],
			group: 'social',
			memberName: 'personal-message',
			description: 'Set your personal message for your profile.',
			details: 'Set your personal message for your profile.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},

			args: [
				{
					key: 'message',
					prompt: 'What message would you like to set as your person message?',
					type: 'string',
					validate: value => {
						if (value.length > 130) return `your message was ${value.length} characters long. Please limit your personal message to 130 characters.`;
						return true;
					}
				}
			]
		});
	}

	async run(msg, args) {
		const personalMessage = args.message;

		const profile = await UserProfile.findOne({ where: { userID: msg.author.id } });

		if (!profile) {
			return UserProfile.create({
				userID: msg.author.id,
				personalMessage
			}).then(() => {
				return msg.reply('your message has been updated!');
			});
		}

		profile.personalMessage = personalMessage;
		return profile.save().then(() => {
			msg.reply('your message has been updated!');
		});
	}
};
