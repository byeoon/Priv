const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('DO not use, it will not work right now because IDK how to make it work.'),
	async execute(interaction) {
     //   if (message.author.id !== "1167275288036655133")  return interaction.reply();
		await interaction.reply("idk how to make this lmao")
	},
};
