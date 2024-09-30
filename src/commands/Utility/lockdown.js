const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lockdown')
		.setDescription('Locks down a channel to staff only.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),

        // todo add mute only mode
	async execute(interaction) {
        try {
            interaction.channel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: false }).then(interacton.reply(":hammer: Successfully locked down channel!"));
        }
        catch {
            await interaction.reply('There was an error locking down the channel. Did you give the bot enough permisions? Is the channel an onboarding channel?');
        }
       
	},

    
};
