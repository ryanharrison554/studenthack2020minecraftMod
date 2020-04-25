import dotenv from 'dotenv';
dotenv.config();

// Create discord bot and login
import discord from 'discord.js';
const discordClient = new discord.Client();

// Import types
import Message from './types/message';

// Import models
import User from './models/User';

discordClient.once('ready', () => {
    // tslint:disable-next-line:no-console
    console.log('Bot Ready!');
});

discordClient.on('message', (message: discord.Message) => {
    if (!message.author.bot) {
        const data: Message = JSON.parse(message.content);
        // Send the message to the given user
        message.client.users.fetch(data.to)
            .then(recipient => {
                recipient.send(JSON.stringify({
                    content: data.content,
                    from: message.author.id
                }));
            })
            .catch(reason => {
                message.channel.send(reason);
            });
    }
});

export default discordClient;