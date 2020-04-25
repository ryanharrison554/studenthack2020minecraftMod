import dotenv from 'dotenv';
dotenv.config();

// Create discord bot and login
import discord from 'discord.js';
const discordClient = new discord.Client();

discordClient.once('ready', () => {
    // tslint:disable-next-line:no-console
    console.log('Bot Ready!');
});

export default discordClient;