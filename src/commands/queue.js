const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({client, interaction}) => {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply("There are no songs in the queue.");
            return;
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i + 1}) [${song.duration}] ${song.title}`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing:**\n${currentSong.title}\n\n**Queue:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
