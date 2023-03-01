const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song.")
                .addStringOption(option => option
                    .setName("terms")
                    .setDescription("Search keywords.")
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("url")
                .setDescription("Plays the song at the given URL.")
                .addStringOption(option => option
                    .setName("url")
                    .setDescription("The URL to play.")
                    .setRequired(true)
                )
        ),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply("You must be in a voice channel to use this command.");
            return;
        }

        let queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === "url") {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            });

            if (result.tracks.length == 0) {
                await interaction.reply("No results found.");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        } else if (interaction.options.getSubcommand() === "search") {
            let terms = interaction.options.getString("terms");

            const result = await client.player.search(terms, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (result.tracks.length == 0) {
                await interaction.reply("No results found.");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        });
    }
}