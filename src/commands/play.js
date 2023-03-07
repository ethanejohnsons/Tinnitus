const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addStringOption(option => option
            .setName("song")
            .setDescription("Song name or URL")
            .setRequired(true)
        ),
    execute: async ({client, interaction}) => {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply("You must be in a voice channel to use this command.");
        }

        await interaction.deferReply();
        let song = interaction.options.getString("song");

        try {
            const { track } = await client.player.play(channel, song, {
                nodeOptions: {
                    metadata: interaction
                }
            });

            return interaction.followUp(`**${track.title}** enqueued.`)
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}