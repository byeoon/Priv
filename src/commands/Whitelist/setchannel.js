const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whitelist setchannel')
		.setDescription('Set the channel to output whitelist logs to.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to set as the default whitelist channel.')
            .setRequired(true)),
	async execute(interaction) {
       try {
        const selectedchannel = interaction.options.getChannel("channel");
        console.log("[Protector] Will now send whitelist logs to " + selectedchannel.id);
            selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: false }).then(interaction.reply(":hammer: Successfully locked down the channel!"));
        }
        catch {
            await interaction.reply(':x: There was an error setting the default chanel.');
        } 
	},  
};
