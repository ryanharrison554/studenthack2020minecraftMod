import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import bot from './bot';

bot.login(process.env.CLIENT_TOKEN);

const app = express();

app.set('bot', bot);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'common')));

app.use('/', indexRouter);

module.exports = app;
