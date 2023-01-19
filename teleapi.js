const { Api, TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')

const apiId = 5128731
const apiHash = 'a894a079cfeadf0bd0646f53bf2587c6'
const stringSession = new StringSession('1BQANOTEuMTA4LjU2LjE1NAG7bR02Q/sxF2vFjd+p3lc78mlYedXpZhXilnKkZW6Wc/fl5QtPL4LYRResy5rdPixE497sy5qkhhC0wCqtg4HzLqRPx3iCFsKc+DiFJ3fA+/pJMrdH4LetBZqkCymEFOlkMp6Qbu1Pz/z4zMVw/IHt2oZkezEEcbKCuvpEP5ZB99G+Z8HwnLZ4fLbh+He+Z1t7L/Gag+wYppwcRjQDlonBCdxWRVkyoe8EjnVo1o0sgsz6ai4EQ8UeH5Kq/2IPkRzdqO1qpI9yRBEMpWV8D1kH+F9vXDpdehArh8eIGRlvOCZY1OwXFnrmROxIc30c9GwAX/yiuFUeQJAau/4hICFZzQ=='); // fill this later with the value from session.save()
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

let arrUser = [];

module.exports = {
	connect: async () => {
		await client.connect(); // This assumes you have already authenticated with .start()
	},
	sendMessage: async (_phone, _message) => {
		var lEntity = arrUser.filter(x => x.phone == _phone);
		var telId = 0;
		if(lEntity.length > 0)
		{
			telId = lEntity[0].telId;
		}
		else
		{
			const result = await client.invoke(
				new Api.contacts.ImportContacts({
				  contacts: [
					new Api.InputPhoneContact({
					  clientId: 12345678,
					  phone: _phone,
					  firstName: "",
					  lastName: "",
					}),
				  ],
				})
			);
			
			if(result.users.length > 0){
				telId = result.users[0].id.value;
				arrUser.push({ phone: _phone, telId: telId });
			}
		}

		if(telId > 0){
			await client.sendMessage(telId, { message: _message });
		}
	}
}