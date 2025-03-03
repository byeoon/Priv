const { SlashCommandBuilder, PermissionFlagsBits, Invite  } = require('discord.js');
const { ChannelType, Client, Events, Formatters, GatewayIntentBits, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgeinvites')
		.setDescription('Deletes every single invite to the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite, PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addUserOption((option) =>
        option
            .setName("target")
            .setDescription("Select user to purge invites of")
            .setRequired(false)
    ),

    // todo: purge invites made by speicifc people aka target (we <3 damage control totally not projecting)
	async execute(interaction) {
        let count = 0;
        const user = interaction.options.getUser("target");
        try {
            if(!user) {
            interaction.guild.invites.fetch().then(invites => {
                invites.each(i => {
                    count++; // fucking thing is not counting even though its before the delete statement!
                    i.delete();
                }
                );
                interaction.reply(":hammer: Deleted " + count + " invites!");
                console.log("[Purger] Someone deleted " + count + " invites.");
              })
            }
            else 
            {
                // now there IS a user!

            }
        }
        catch {
            await interaction.reply(':x: There was an issue deleting invites.');
        }
       
	},

    
};
