const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Forces the bot to say something")
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName("say").setDescription("What you want the bot to say")
	   .setRequired(true)
    ),
  		async execute(interaction) {
    		const say = interaction.options.getString("say");
    		console.log("[Purger] bot said: " + say);
    		await interaction.reply(say);
  		},
};
