const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription(
      "Purges an entire channel by deleting it and re-creating it"
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageChannels
    )
    .setDMPermission(false),

  async execute(interaction) {
    let owner = await interaction.guild.fetchOwner();
    const newChannel = await interaction.channel.clone();
    if (interaction.user.id !== owner.id)
      return interaction.reply(
        ":x: Only the server owner can use this command!"
      ); // just because
      try {   
    console.log("[Purger] A channel was nuked. New channel ID: " + newChannel.id);
      interaction.channel
        .delete()
        .then(
          interaction.guild.channels.cache
            .get(newChannel.id)
            .send(`:hammer: Channel nuked. (Executed by ${interaction.user})`)
        );
      }
      catch {
        interaction.reply("An error occurred. Try again?");
      }
  },
};
