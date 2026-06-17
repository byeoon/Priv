const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all available commands and their required permissions.'),

	async execute(interaction) {
		const foldersPath = path.join(__dirname, '..');
		const commandFolders = fs.readdirSync(foldersPath);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Available Commands')
			.setDescription('List of all commands grouped by category, along with the permissions required to run them.')
			.setTimestamp();

		for (const folder of commandFolders) {
			const folderPath = path.join(foldersPath, folder);
			if (!fs.statSync(folderPath).isDirectory()) continue;

			const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
			if (commandFiles.length === 0) continue;

			let categoryCommands = [];

			for (const file of commandFiles) {
				const filePath = path.join(folderPath, file);
				try {
					const command = require(filePath);
					if ('data' in command && 'execute' in command) {
						const dataJson = command.data.toJSON();
						const description = dataJson.description || 'No description provided.';
						const defaultPerms = dataJson.default_member_permissions;

						let permsStr = 'None';
						if (defaultPerms) {
							try {
								const bitfield = new PermissionsBitField(BigInt(defaultPerms));
								permsStr = bitfield.toArray().join(', ') || 'None';
							} catch (e) {
								permsStr = 'Restricted';
							}
						}

						categoryCommands.push(`**/${dataJson.name}**\n*Description:* ${description}\n*Permissions:* \`${permsStr}\``);
					}
				} catch (error) {
					console.error(`Error loading command for help menu at ${filePath}:`, error);
				}
			}

			if (categoryCommands.length > 0) {
				embed.addFields({
					name: `${folder} Commands`,
					value: categoryCommands.join('\n\n'),
					inline: false
				});
			}
		}

		await interaction.reply({ embeds: [embed] });
	}
};
