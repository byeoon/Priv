const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Logs a note about a user to a specific channel.")
    .addStringOption((option) =>
      option
        .setName("note")
        .setDescription("The note you want to give.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to note.")
        .setRequired(true)
    )
	.addChannelOption((option) =>
	option
	  .setName("channel")
	  .setDescription("The channel you want to put the note in.")
	  .setRequired(false)
  ),

  async execute(interaction) {
	let notes = 0;
    const note = interaction.options.getString("note");
    const user = interaction.options.getUser("target");
	notes++;
	console.log("[Purger] An anonymous user noted someone for " + note);

    const noteEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Note on ${user} (${user.id})`)
      .setDescription(`${note}`)
	  .setFooter({ text: `There have been ${notes} notes in total.`})
	  .setTimestamp();
    await interaction.reply({ embeds: [noteEmbed] });
  },
};
