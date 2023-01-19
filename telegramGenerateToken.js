const { Api, TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const input = require('input') // npm i input

const apiId = 5128731
const apiHash = 'a894a079cfeadf0bd0646f53bf2587c6'
const stringSession = new StringSession(''); // fill this later with the value from session.save()
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

(async () => {
    console.log('Loading interactive example...')
    
    await client.start({
        phoneNumber: async () => '+84 582208920',
        password: async () => await input.text('password ?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.')
    console.log(client.session.save()) // Save this string to avoid logging in again
    await client.sendMessage('me', { message: 'Hello!' });
})();