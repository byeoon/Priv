const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nuke')
		.setDescription('Purges an entire channel by deleting it and re-creating it')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),

	async execute(interaction) {
            const newChannel = await interaction.channel.clone();
            console.log(newChannel.id);
            interaction.channel.delete().then(interaction.guild.channels.cache.get(newChannel.id).send(`:hammer: Channel nuked. (Executed by ${interaction.user})`));
	},

    
};
