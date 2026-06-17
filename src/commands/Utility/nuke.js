const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription(
      "Nukes an entire channel by deleting it and re-creating it"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),

  async execute(interaction) {
    const owner = await interaction.guild.fetchOwner();
    if (interaction.user.id !== owner.id) {
      return interaction.reply({
        content: ":x: Only the server owner can use this command! This is to prevent abuse.",
        ephemeral: true
      });
    }

    try {
      const position = interaction.channel.position;
      const newChannel = await interaction.channel.clone();

      // Position the new channel in the exact same place
      await newChannel.setPosition(position);

      console.log(`[Priv] A channel was nuked. Old ID: ${interaction.channel.id}, New ID: ${newChannel.id}`);

      await interaction.channel.delete();
      await newChannel.send(`:hammer: Channel nuked. (Executed by ${interaction.user})`);
    } catch (error) {
      console.error(error);
      try {
        await interaction.reply({ content: ":x: An error occurred while nuking the channel.", ephemeral: true });
      } catch (err) {
        console.error("Could not reply to interaction after nuke error:", err);
      }
    }
  },
};
