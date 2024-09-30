const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlockdown')
		.setDescription('Removes a lockdown from the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),

	async execute(interaction) {
        try {
            interaction.channel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: true }).then(interacton.reply(":hammer: Successfully unlocked the channel!"));
        }
        catch {
            await interaction.reply('There was an error unlocking the channel. Did you give the bot enough permisions?');
        }
       
	},

    
};
