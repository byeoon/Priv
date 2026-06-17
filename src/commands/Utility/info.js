const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Outputs information about the bot'),

	async execute(interaction) {
		const pingEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`Pong!`)
			.setDescription(`
		🏓 Bot Latency | **${Date.now() - interaction.createdTimestamp}ms**.
		🏓 API Latency | **${Math.round(interaction.client.ws.ping)}ms**.
		🟢 Uptime | **${Math.round(interaction.client.uptime / 60000)} mins**.`)
		await interaction.reply(({ embeds: [pingEmbed] }));
	},
};
