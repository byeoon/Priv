const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lockdown')
		.setDescription('Locks down a channel to staff only.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to lockdown.')
            .setRequired(true)),
        //TODO: add mute only mode that actually works, 
        // yeah this breaks if the perms arent set properly..
	async execute(interaction) {
      //  const mutemode = interaction.options.getBoolean('mutemode');
       try {
        const selectedchannel = interaction.options.getChannel("channel");
        console.log("[Purger] Locking down " + selectedchannel.id);
            selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: false }).then(interaction.reply(":hammer: Successfully locked down the channel!"));
        }
        catch {
            await interaction.reply(':x: There was an error locking down the channel. Did you give the bot enough permisions? Is the channel an onboarding channel?');
        }
       
	},

    
};
