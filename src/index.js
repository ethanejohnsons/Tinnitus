const {REST} = require("@discordjs/rest");
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Routes } = require("discord-api-types/v9");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const { token, clientId } = require('../config.json');

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Set up commands
const commands = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Set up player
client.player = new Player(client);
client.player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

// Register commands
client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({version: "9"}).setToken(token);
    for(const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildId}`))
        .catch(console.error)
    }
});

// Handle command execution
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute({client, interaction});
    } catch (err) {
        console.error(err);
        await interaction.reply("An error occurred while executing that command.");
    }
});

client.login(token);