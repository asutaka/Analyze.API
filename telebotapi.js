const Telegraf = require('telegraf');

const bot = new Telegraf('5944056940:AAHTZcGNojAcFqI4LVC1y4CRNvP0NjBkVaU');
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
    })
})