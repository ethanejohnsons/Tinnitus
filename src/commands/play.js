const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addStringOption(option => option
            .setName("song")
            .setDescription("Song name, description, or URL")
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName("no_ai")
            .setDescription("Whether to use OpenAI with this command.")
            .setRequired(false)
        ),
    execute: async ({client, interaction}) => {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply("You must be in a voice channel to use this command.");
        }
        await interaction.deferReply();

        const noAi = interaction.options.getBoolean("no_ai");
        const descriptionOrUrl = interaction.options.getString("song");
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

        if (urlRegex.test(descriptionOrUrl)) {
            return await client.enqueueSong({interaction, channel, song: descriptionOrUrl});
        } else if (!noAi) {
            const messages = [
                {
                    role: "user",
                    content: `
                    Please create a list of 5 songs using the information given in the subsequent message. 
                    Make sure to number each song 1-5. 
                    Except if the message contains the name of a song, then just respond with the name of the song.
                    Always include the artist in the response.
                    Don't include anything else in the response.
                    If the input is not valid, simply state "-1" and then provide a reason on the following line (in simple text, no parenthesis' or colons).
                    `
                },
                {
                    role: "user",
                    content: `${descriptionOrUrl}`
                }
            ];

            const response = await client.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages
            });
            const songList = response.data.choices[0].message.content.trim();

            if (songList.slice(0, 2) === "-1") {
                return interaction.followUp(songList.slice(3));
            } else if (songList.split('\n').length === 1) {
                return client.enqueueSong({interaction, channel, song: songList});
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`play_${songList.split('\n')[0].slice(3)}`)
                        .setLabel('1')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`play_${songList.split('\n')[1].slice(3)}`)
                        .setLabel('2')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`play_${songList.split('\n')[2].slice(3)}`)
                        .setLabel('3')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`play_${songList.split('\n')[3].slice(3)}`)
                        .setLabel('4')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`play_${songList.split('\n')[4].slice(3)}`)
                        .setLabel('5')
                        .setStyle(ButtonStyle.Success)
                );
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`Songs matching: \`${descriptionOrUrl}\``)
                .setDescription(songList);
            return interaction.followUp({ embeds: [ embed ], components: [ row ] });
        } else {
            client.enqueueSong({interaction, channel, song: descriptionOrUrl});
        }
    },
    button: async ({client, interaction}) => {
        await interaction.deferReply();
        const channel = interaction.member.voice.channel;
        const song = interaction.customId.split('_')[1];
        return client.enqueueSong({interaction, channel, song});
    }
}