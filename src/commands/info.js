const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Finds information about the currently playing song."),
    execute: async ({client, interaction}) => {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply("You must be in a voice channel to use this command.");
        }
        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.reply("Nothing is playing, man.");
        }
        const song = `${queue.currentTrack.title} by ${queue.currentTrack.author}`;
        const messages = [
            {
                role: "user",
                content: `Please provide an objective description of the song, "${song}".`
            }
        ];
        const response = await client.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
        });
        const information = response.data.choices[0].message.content.trim();
        return interaction.followUp(information);
    }
}