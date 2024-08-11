const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purges an amount of messages in a channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of messages to purge (Must be below 100 for it to work!)')),

	async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount).then(interaction.reply(`:hammer: Successfully purged ${amount} messages!`));
	},    
};
