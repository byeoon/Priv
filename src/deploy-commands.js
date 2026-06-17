require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

let guildId;
try {
	const config = require('./config.json');
	guildId = config.guildId;
} catch (err) {
	// Ignore if config.json does not exist or has no guildId
}

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`[Priv] > Started reloading ${commands.length} application commands.`);
		
		let data;
		if (guildId) {
			console.log(`[Priv] > Registering commands to guild: ${guildId}`);
			data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
		} else {
			console.log(`[Priv] > Registering commands globally.`);
			data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
		}

		console.log(`[Priv] > Reloaded ${data.length} application commands.`);
	} catch (error) {
		console.error(error);
	}
})();
