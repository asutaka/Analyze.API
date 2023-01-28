const { CheckDomain } = require('./cronjob.js');
const express = require('express');
const crypto = require('crypto')
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const bot = new Telegraf('5944056940:AAHTZcGNojAcFqI4LVC1y4CRNvP0NjBkVaU');
// Require `PhoneNumberFormat`. 
const PNF = require('google-libphonenumber').PhoneNumberFormat;
// Get an instance of `PhoneNumberUtil`. 
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var jsonParser = bodyParser.json()

const app = express();
const PORT = process.env.PORT || 8999;
app.get('/', async (req, res)  => {
    res.status(200).json({msg: "hello world", responseCode: 1 });
})
app.listen(PORT, () => console.log('server running in port: ' + PORT));

CheckDomain();

let arrUser = [];
let arrMap = [];
//Get All User
app.get('/secrect/users/:signature', function(req, res) {
    var signature = req.params.signature;
    var text = "users";
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }
    res.status(200).json({data: arrUser });
});
//Delete User
app.post('/secrect/deleteUser', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        arrUser.slice(index, 1);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[error] User Not Found!", code: -99 }); 
    }
});
//Update Password
app.post('/updatePassword', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.password;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        var date = new Date();
        var entity = arrUser[index];
        if(entity.status <= 0)
        {
            return res.status(200).json({msg: "[error] Status is inactive!", code: -10 });
        }

        var model = { phone: data.phone, password: data.password, createdtime: entity.createdtime, updatedtime: date.getTime(), status: entity.status };
        arrUser.slice(index, 1);
        arrUser.push(model);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[error] User Not Found!", code: -99 });
    }
});

//Update Status
app.post('/secrect/updateStatus', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.status;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        var date = new Date();
        var entity = arrUser[index];
        var model = { phone: data.phone, password: entity.password, createdtime: entity.createdtime, updatedtime: date.getTime(), status: data.status };
        arrUser.slice(index, 1);
        arrUser.push(model);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[error] User Not Found!", code: -99 });
    }
});

//Check User
app.post('/checkUser', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.password;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        var entity = arrUser[index];
        if(entity.status <= 0)
        {
            return res.status(200).json({msg: "[error] Status is inactive!", code: -10 });
        }
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[error] User Not Found!", code: -99 });
    }
});

//Insert User
app.post('/secrect/insertUser', jsonParser,function (req, res) {
    var data = req.body;
    arrUser = [];
    if(data.lData != null)
    {
        arrUser.push(data.lData);
    }
    return res.status(200).json({msg: "success", code: 1 });
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//For TELEGRAM
bot.start((ctx) => ctx.reply("Hệ thống yêu cầu nhập SĐT nhận thông báo!"));
bot.help((ctx) => ctx.reply("Hệ thống yêu cầu nhập SĐT nhận thông báo!"));
bot.on("message", async (ctx) => {
    const message = ctx.update.message.text;
    const chatId = ctx.update.message.chat.id;
    if(message != "" && message != undefined){
        try{
                // Parse number with country code. 
                var phoneNumber = phoneUtil.parse(message, 'VN');
                // Print number in the international format. 
                var outputWSpace = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                if(outputWSpace != ""){
                    var phone = outputWSpace.replace(new RegExp(' ', 'g'), '');
                    var indexChatId = arrMap.findIndex(x => x.chatId == chatId);
                    if(indexChatId < 0)
                    {
                        var indexPhone = arrMap.findIndex(x => x.phone == phone);
                        if(indexPhone < 0)
                        {
                            arrMap.push({"phone": phone, "chatId": chatId});
                        }
                    }
                    console.log("arrMap", arrMap);
                }
        }
        catch
        {
                console.log("not convert message: " + message);
        }
    }
});
bot.launch();

//send notify
app.post('/sendNotify', jsonParser,function (req, res) {
    var data = req.body;
    var phone = data.phone;
    var message = data.message;
    if(message == ""){
        return res.status(200).json({msg: "[error] Content Is Null!", code: -98 }); 
    }

    var index = arrMap.findIndex(x => x.phone == phone);
    if(index > -1)
    {
        try{
            var entity = arrMap[index];
            bot.telegram.sendMessage(entity.chatId, message);
            return res.status(200).json({msg: "success", code: 1 });
        }catch(e){
            return res.status(200).json({msg: "[error] Exception when send Notify!", code: -96 }); 
        }
    }
    else
    {
        return res.status(200).json({msg: "[error] Map Not Found!", code: -99 }); 
    }
});

//Get All Map
app.get('/secrect/maps/:signature', function(req, res) {
    var signature = req.params.signature;
    var text = "maps";
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }
    res.status(200).json({data: arrMap });
});

//Delete Map
app.post('/secrect/deleteMap', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[error] Signature Incorrect!", code: -10 });
    }

    var index = arrMap.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        arrMap.slice(index, 1);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[error] User Not Found!", code: -99 }); 
    }
});

//Insert Map
app.post('/secrect/insertMap', jsonParser,function (req, res) {
    var data = req.body;
    arrMap = [];
    if(data.lData != null)
    {
        arrMap.push(data.lData);
    }
    return res.status(200).json({msg: "success", code: 1 });
});
/////////////////////////////////////////////////////////////////////////////////////////////////