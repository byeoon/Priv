const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlockdown')
		.setDescription('Removes a lockdown from the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addChannelOption(option =>
        option.setName('channel')
			.setDescription('The channel to unlock.')
            .setRequired(true)),

	async execute(interaction) {
        try {
            const selectedchannel = interaction.options.getChannel("channel");
            selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: true }).then(interaction.reply(":hammer: Successfully unlocked the channel!"));
        }
        catch {
            await interaction.reply('There was an error unlocking the channel. Did you give the bot enough permisions?');
        }
       
	},

    
};
