const { SlashCommandBuilder, PermissionFlagsBits, Invite  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgeinvites')
		.setDescription('Deletes EVERY SINGLE invite to the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite, PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),

	async execute(interaction) {
        let count;
        try {
            interaction.guild.invites.fetch().then(invites => {
                invites.each(i => i.delete())
              })
              interaction.reply(":hammer: Deleted " + count + " invites!")
        }
        catch {
            await interaction.reply(':x: There was an issue deleting all the invites.');
            
        }
       
	},

    
};
