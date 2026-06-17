const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const token = process.env.DISCORD_TOKEN;
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});
const foldersPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');
const commandFolders = fs.readdirSync(foldersPath);
const eventFiles = fs.readdirSync(eventsPath)

client.commands = new Collection();
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

const updatePresence = (client) => {
	const serverCount = client.guilds.cache.size;
	client.user.setPresence({
		activities: [{
			name: `${serverCount} server${serverCount === 1 ? '' : 's'}`,
			type: ActivityType.Watching,
		}],
		status: 'online'
	});
};

client.once(Events.ClientReady, readyClient => {
	console.log(`[Priv] Logged in as ${readyClient.user.tag}`);
	updatePresence(readyClient);
});

client.on(Events.GuildCreate, guild => {
	updatePresence(guild.client);
});

client.on(Events.GuildDelete, guild => {
	updatePresence(guild.client);
});

client.login(token);


