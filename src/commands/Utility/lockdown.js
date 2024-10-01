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
        // todo add mute only mode that actually works, 
        // TODO: add channel selection.
	async execute(interaction) {
      //  const mutemode = interaction.options.getBoolean('mutemode');
       try {
        const selectedchannel = interaction.options.getChannel("channel");
        console.log("[Purger] Locking down " + selectedchannel.id);
        //    if(mutemode) {
            //    interaction.channel.permissionOverwrites.edit(interaction.guildId, { SendMessages : false }).then(interaction.reply(":hammer: Successfully locked down the channel! (Mute Mode)"));
          //  }
            selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: false }).then(interaction.reply(":hammer: Successfully locked down the channel!"));
        }
        catch {
            await interaction.reply(':x: There was an error locking down the channel. Did you give the bot enough permisions? Is the channel an onboarding channel?');
        }
       
	},

    
};
