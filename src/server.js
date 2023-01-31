const { CheckDomain } = require('./cronjob.js');
const express = require('express');
const crypto = require('crypto')
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const axios = require("axios");
const DOMAIN_SUB1 = "https://asutaka-subcribe1.onrender.com/";
const DOMAIN_SUB2 = "https://asutaka-subcribe2.onrender.com/";
const DOMAIN_SUB3 = "https://asutakaoutlook-subcribe3.onrender.com/";
const DOMAIN_SUB4 = "https://asutakaoutlook-subcribe4.onrender.com/";
const DOMAIN_SUB5 = "https://nguyenphuict-subcribe5.onrender.com/";
const DOMAIN_SUB6 = "https://nguyenphuict-subcribe6.onrender.com/";
const DOMAIN_SUB7 = "https://asutakayahoo-subcribe7.onrender.com/";
const DOMAIN_SUB8 = "https://asutakayahoo-subcribe8.onrender.com/";
const CHAT_ID = 1828525662;

// const bot = new Telegraf('5944056940:AAHTZcGNojAcFqI4LVC1y4CRNvP0NjBkVaU');
const bot = new Telegraf('5026250022:AAHr5fqu1P5C00f1O_m5SeC5qcrFbSFO7F0');
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
app.get('/secret/users/:signature', function(req, res) {
    var signature = req.params.signature;
    var text = "users";
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }
    res.status(200).json({data: arrUser });
});
//Delete User
app.post('/secret/deleteUser', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        arrUser.splice(index, 1);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] User Not Found!", code: -600 }); 
    }
});
//Update Password
app.post('/updatePassword', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.password;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        var entity = arrUser[index];
        if(entity.status <= 0)
        {
            return res.status(200).json({msg: "[API-ERROR] Status is inactive!", code: -300 });
        }
        arrUser[index].password = data.password;
        arrUser[index].updatedtime = (new Date()).getTime();
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] User Not Found!", code: -600 });
    }
});

//Update Status
app.post('/secret/updateStatus', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.status;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        arrUser[index].status = data.status;
        arrUser[index].updatedtime = (new Date()).getTime();
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] User Not Found!", code: -600 });
    }
});

//Check User
app.post('/checkUser', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone+data.password;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }

    var index = arrUser.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        var entity = arrUser[index];
        if(entity.status <= 0)
        {
            return res.status(200).json({msg: "[API-ERROR] Status is inactive!", code: -300 });
        }
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] User Not Found!", code: -600 });
    }
});

//Insert User
app.post('/secret/insertUser', jsonParser,function (req, res) {
    var data = req.body;
    if(data.lData != null && data.lData.length > 0)
    {
        arrUser = [];
        arrUser = data.lData;
    }
    if(data.data != null)
    {
        arrUser.push(data.data);
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
        return res.status(200).json({msg: "[API-ERROR] Content Is Null!", code: -400 }); 
    }

    var index = arrMap.findIndex(x => x.phone == phone);
    if(index > -1)
    {
        try{
            var entity = arrMap[index];
            bot.telegram.sendMessage(entity.chatId, message);
            return res.status(200).json({msg: "success", code: 1 });
        }catch(e){
            return res.status(200).json({msg: "[API-ERROR] Exception when send Notify!", code: -800 }); 
        }
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] Map Not Found!", code: -600 }); 
    }
});

//Get All Map
app.get('/secret/maps/:signature', function(req, res) {
    var signature = req.params.signature;
    var text = "maps";
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }
    res.status(200).json({data: arrMap });
});

//Delete Map
app.post('/secret/deleteMap', jsonParser,function (req, res) {
    var data = req.body;
    var text = data.phone;
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }

    var index = arrMap.findIndex(x => x.phone == data.phone);
    if(index > -1)
    {
        arrMap.splice(index, 1);
        return res.status(200).json({msg: "success", code: 1 });
    }
    else
    {
        return res.status(200).json({msg: "[API-ERROR] Map Not Found!", code: -600 }); 
    }
});

//Insert Map
app.post('/secret/insertMap', jsonParser,function (req, res) {
    var data = req.body;
    if(data.lData != null)
    {
        arrMap = [];
        arrMap = data.lData;
    }
    return res.status(200).json({msg: "success", code: 1 });
});
/////////////////////////////////////////////////////////////////////////////////////////////////
//fill Data
var arrSub1 = [
    '1inchusdt',
    'aaveusdt',
    'acausdt',
    'achusdt',
    'acmusdt',
    'adausdt',
    'adxusdt',
    'agldusdt',
    'aionusdt',
    'akrousdt',
    'alcxusdt',
    'algousdt',
    'aliceusdt',
    'alpacausdt',
    'alphausdt',
    'alpineusdt',
    'ampusdt',
    'ankrusdt',
    'antusdt',
    'apeusdt',
    'api3usdt',
    'aptusdt',
    'ardrusdt',
    'arpausdt',
    'arusdt',
    'asrusdt',
    'astrusdt',
    'atausdt',
    'atmusdt',
    'atomusdt',
    'auctionusdt',
    'audiousdt',
    'audusdt',
    'autousdt',
    'avausdt',
    'avaxusdt',
    'axsusdt',
    'badgerusdt',
    'bakeusdt',
];
var arrSub2 = [
    'balusdt',
    'bandusdt',
    'barusdt',
    'batusdt',
    'bchusdt',
    'beamusdt',
    'belusdt',
    'betausdt',
    'bicousdt',
    'bifiusdt',
    'blzusdt',
    'bnbusdt',
    'bntusdt',
    'bnxusdt',
    'bondusdt',
    'bswusdt',
    'btcusdt',
    'btsusdt',
    'bttcusdt',
    'burgerusdt',
    'busdusdt',
    'c98usdt',
    'cakeusdt',
    'celousdt',
    'celrusdt',
    'cfxusdt',
    'chessusdt',
    'chrusdt',
    'chzusdt',
    'cityusdt',
    'ckbusdt',
    'clvusdt',
    'cocosusdt',
    'cotiusdt',
    'crvusdt',
    'ctkusdt',
    'ctsiusdt',
    'ctxcusdt',
    'cvpusdt',
    'cvxusdt',
];
var arrSub3 = [
    'darusdt',
    'dashusdt',
    'datausdt',
    'dcrusdt',
    'degousdt',
    'dentusdt',
    'dexeusdt',
    'dfusdt',
    'dgbusdt',
    'diausdt',
    'dockusdt',
    'dodousdt',
    'dogeusdt',
    'dotusdt',
    'drepusdt',
    'duskusdt',
    'dydxusdt',
    'egldusdt',
    'elfusdt',
    'enjusdt',
    'ensusdt',
    'eosusdt',
    'epxusdt',
    'ernusdt',
    'etcusdt',
    'ethusdt',
    'eurusdt',
    'farmusdt',
    'fetusdt',
    'fidausdt',
    'filusdt',
    'fiousdt',
    'firousdt',
    'fisusdt',
    'flmusdt',
    'flowusdt',
    'fluxusdt',
    'forthusdt',
    'forusdt',
    'frontusdt',
];
var arrSub4 = [
    'ftmusdt',
    'funusdt',
    'fxsusdt',
    'galausdt',
    'galusdt',
    'gbpusdt',
    'ghstusdt',
    'glmrusdt',
    'gmtusdt',
    'gmxusdt',
    'gnousdt',
    'grtusdt',
    'gtcusdt',
    'hardusdt',
    'hbarusdt',
    'hftusdt',
    'highusdt',
    'hiveusdt',
    'hookusdt',
    'hotusdt',
    'icpusdt',
    'icxusdt',
    'idexusdt',
    'ilvusdt',
    'imxusdt',
    'injusdt',
    'iostusdt',
    'iotausdt',
    'iotxusdt',
    'irisusdt',
    'jasmyusdt',
    'joeusdt',
    'jstusdt',
    'juvusdt',
    'kavausdt',
    'kdausdt',
    'keyusdt',
    'klayusdt',
    'kmdusdt',
    'kncusdt',
];
var arrSub5 = [
    'kp3rusdt',
    'ksmusdt',
    'laziousdt',
    'ldousdt',
    'leverusdt',
    'linausdt',
    'linkusdt',
    'litusdt',
    'lokausdt',
    'lptusdt',
    'lrcusdt',
    'lskusdt',
    'ltcusdt',
    'ltousdt',
    'lunausdt',
    'luncusdt',
    'magicusdt',
    'manausdt',
    'maskusdt',
    'maticusdt',
    'mblusdt',
    'mboxusdt',
    'mcusdt',
    'mdtusdt',
    'mdxusdt',
    'minausdt',
    'mkrusdt',
    'mlnusdt',
    'mobusdt',
    'movrusdt',
    'mtlusdt',
    'multiusdt',
    'nbtusdt',
    'nearusdt',
    'neblusdt',
    'neousdt',
    'nexousdt',
];
var arrSub6 = [
    'nknusdt',
    'nmrusdt',
    'nulsusdt',
    'oceanusdt',
    'ognusdt',
    'ogusdt',
    'omgusdt',
    'omusdt',
    'oneusdt',
    'ongusdt',
    'ontusdt',
    'ookiusdt',
    'opusdt',
    'ornusdt',
    'osmousdt',
    'oxtusdt',
    'paxgusdt',
    'peopleusdt',
    'perlusdt',
    'perpusdt',
    'phausdt',
    'phbusdt',
    'plausdt',
    'pntusdt',
    'polsusdt',
    'polyxusdt',
    'pondusdt',
    'portousdt',
    'powrusdt',
    'psgusdt',
    'pundixusdt',
    'pyrusdt',
    'qiusdt',
    'qntusdt',
    'qtumusdt',
    'quickusdt',
    'radusdt',
    'rareusdt',
    'rayusdt',
    'reefusdt',
];
var arrSub7 = [
    'reiusdt',
    'renusdt',
    'requsdt',
    'rifusdt',
    'rlcusdt',
    'rndrusdt',
    'roseusdt',
    'rsrusdt',
    'runeusdt',
    'rvnusdt',
    'sandusdt',
    'santosusdt',
    'scrtusdt',
    'scusdt',
    'sfpusdt',
    'shibusdt',
    'sklusdt',
    'slpusdt',
    'snxusdt',
    'solusdt',
    'spellusdt',
    'steemusdt',
    'stgusdt',
    'stmxusdt',
    'storjusdt',
    'stptusdt',
    'straxusdt',
    'stxusdt',
    'sunusdt',
    'superusdt',
    'sushiusdt',
    'sxpusdt',
    'sysusdt',
    'tfuelusdt',
    'thetausdt',
    'tkousdt',
    'tlmusdt',
    'tomousdt',
];
var arrSub8 = [
    'trbusdt',
    'troyusdt',
    'truusdt',
    'trxusdt',
    'tusdt',
    'tvkusdt',
    'twtusdt',
    'umausdt',
    'unfiusdt',
    'uniusdt',
    'utkusdt',
    'vetusdt',
    'vgxusdt',
    'vidtusdt',
    'viteusdt',
    'voxelusdt',
    'vthousdt',
    'wanusdt',
    'wavesusdt',
    'waxpusdt',
    'wingusdt',
    'winusdt',
    'wnxmusdt',
    'woousdt',
    'wrxusdt',
    'wtcusdt',
    'xecusdt',
    'xemusdt',
    'xlmusdt',
    'xmrusdt',
    'xnousdt',
    'xrpusdt',
    'xtzusdt',
    'xvgusdt',
    'xvsusdt',
    'yfiiusdt',
    'yfiusdt',
    'yggusdt',
    'zecusdt',
    'zenusdt',
    'zilusdt',
    'zrxusdt',
];
var arrSub = [
    '1inchusdt',
    'aaveusdt',
    'acausdt',
    'achusdt',
    'acmusdt',
    'adausdt',
    'adxusdt',
    'agldusdt',
    'aionusdt',
    'akrousdt',
    'alcxusdt',
    'algousdt',
    'aliceusdt',
    'alpacausdt',
    'alphausdt',
    'alpineusdt',
    'ampusdt',
    'ankrusdt',
    'antusdt',
    'apeusdt',
    'api3usdt',
    'aptusdt',
    'ardrusdt',
    'arpausdt',
    'arusdt',
    'asrusdt',
    'astrusdt',
    'atausdt',
    'atmusdt',
    'atomusdt',
    'auctionusdt',
    'audiousdt',
    'audusdt',
    'autousdt',
    'avausdt',
    'avaxusdt',
    'axsusdt',
    'badgerusdt',
    'bakeusdt',
    'balusdt',
    'bandusdt',
    'barusdt',
    'batusdt',
    'bchusdt',
    'beamusdt',
    'belusdt',
    'betausdt',
    'bicousdt',
    'bifiusdt',
    'blzusdt',
    'bnbusdt',
    'bntusdt',
    'bnxusdt',
    'bondusdt',
    'bswusdt',
    'btcusdt',
    'btsusdt',
    'bttcusdt',
    'burgerusdt',
    'busdusdt',
    'c98usdt',
    'cakeusdt',
    'celousdt',
    'celrusdt',
    'cfxusdt',
    'chessusdt',
    'chrusdt',
    'chzusdt',
    'cityusdt',
    'ckbusdt',
    'clvusdt',
    'cocosusdt',
    'cotiusdt',
    'crvusdt',
    'ctkusdt',
    'ctsiusdt',
    'ctxcusdt',
    'cvpusdt',
    'cvxusdt',
    'darusdt',
    'dashusdt',
    'datausdt',
    'dcrusdt',
    'degousdt',
    'dentusdt',
    'dexeusdt',
    'dfusdt',
    'dgbusdt',
    'diausdt',
    'dockusdt',
    'dodousdt',
    'dogeusdt',
    'dotusdt',
    'drepusdt',
    'duskusdt',
    'dydxusdt',
    'egldusdt',
    'elfusdt',
    'enjusdt',
    'ensusdt',
    'eosusdt',
    'epxusdt',
    'ernusdt',
    'etcusdt',
    'ethusdt',
    'eurusdt',
    'farmusdt',
    'fetusdt',
    'fidausdt',
    'filusdt',
    'fiousdt',
    'firousdt',
    'fisusdt',
    'flmusdt',
    'flowusdt',
    'fluxusdt',
    'forthusdt',
    'forusdt',
    'frontusdt',
    'ftmusdt',
    'funusdt',
    'fxsusdt',
    'galausdt',
    'galusdt',
    'gbpusdt',
    'ghstusdt',
    'glmrusdt',
    'gmtusdt',
    'gmxusdt',
    'gnousdt',
    'grtusdt',
    'gtcusdt',
    'hardusdt',
    'hbarusdt',
    'hftusdt',
    'highusdt',
    'hiveusdt',
    'hookusdt',
    'hotusdt',
    'icpusdt',
    'icxusdt',
    'idexusdt',
    'ilvusdt',
    'imxusdt',
    'injusdt',
    'iostusdt',
    'iotausdt',
    'iotxusdt',
    'irisusdt',
    'jasmyusdt',
    'joeusdt',
    'jstusdt',
    'juvusdt',
    'kavausdt',
    'kdausdt',
    'keyusdt',
    'klayusdt',
    'kmdusdt',
    'kncusdt',
    'kp3rusdt',
    'ksmusdt',
    'laziousdt',
    'ldousdt',
    'leverusdt',
    'linausdt',
    'linkusdt',
    'litusdt',
    'lokausdt',
    'lptusdt',
    'lrcusdt',
    'lskusdt',
    'ltcusdt',
    'ltousdt',
    'lunausdt',
    'luncusdt',
    'magicusdt',
    'manausdt',
    'maskusdt',
    'maticusdt',
    'mblusdt',
    'mboxusdt',
    'mcusdt',
    'mdtusdt',
    'mdxusdt',
    'minausdt',
    'mkrusdt',
    'mlnusdt',
    'mobusdt',
    'movrusdt',
    'mtlusdt',
    'multiusdt',
    'nbtusdt',
    'nearusdt',
    'neblusdt',
    'neousdt',
    'nexousdt',
    'nknusdt',
    'nmrusdt',
    'nulsusdt',
    'oceanusdt',
    'ognusdt',
    'ogusdt',
    'omgusdt',
    'omusdt',
    'oneusdt',
    'ongusdt',
    'ontusdt',
    'ookiusdt',
    'opusdt',
    'ornusdt',
    'osmousdt',
    'oxtusdt',
    'paxgusdt',
    'peopleusdt',
    'perlusdt',
    'perpusdt',
    'phausdt',
    'phbusdt',
    'plausdt',
    'pntusdt',
    'polsusdt',
    'polyxusdt',
    'pondusdt',
    'portousdt',
    'powrusdt',
    'psgusdt',
    'pundixusdt',
    'pyrusdt',
    'qiusdt',
    'qntusdt',
    'qtumusdt',
    'quickusdt',
    'radusdt',
    'rareusdt',
    'rayusdt',
    'reefusdt',
    'reiusdt',
    'renusdt',
    'requsdt',
    'rifusdt',
    'rlcusdt',
    'rndrusdt',
    'roseusdt',
    'rsrusdt',
    'runeusdt',
    'rvnusdt',
    'sandusdt',
    'santosusdt',
    'scrtusdt',
    'scusdt',
    'sfpusdt',
    'shibusdt',
    'sklusdt',
    'slpusdt',
    'snxusdt',
    'solusdt',
    'spellusdt',
    'steemusdt',
    'stgusdt',
    'stmxusdt',
    'storjusdt',
    'stptusdt',
    'straxusdt',
    'stxusdt',
    'sunusdt',
    'superusdt',
    'sushiusdt',
    'sxpusdt',
    'sysusdt',
    'tfuelusdt',
    'thetausdt',
    'tkousdt',
    'tlmusdt',
    'tomousdt',
    'trbusdt',
    'troyusdt',
    'truusdt',
    'trxusdt',
    'tusdt',
    'tvkusdt',
    'twtusdt',
    'umausdt',
    'unfiusdt',
    'uniusdt',
    'utkusdt',
    'vetusdt',
    'vgxusdt',
    'vidtusdt',
    'viteusdt',
    'voxelusdt',
    'vthousdt',
    'wanusdt',
    'wavesusdt',
    'waxpusdt',
    'wingusdt',
    'winusdt',
    'wnxmusdt',
    'woousdt',
    'wrxusdt',
    'wtcusdt',
    'xecusdt',
    'xemusdt',
    'xlmusdt',
    'xmrusdt',
    'xnousdt',
    'xrpusdt',
    'xtzusdt',
    'xvgusdt',
    'xvsusdt',
    'yfiiusdt',
    'yfiusdt',
    'yggusdt',
    'zecusdt',
    'zenusdt',
    'zilusdt',
    'zrxusdt',
];

app.post('/secret/fillData', jsonParser,function (req, res) {
    var data = req.body;
    var text = "fillData";
    let hash = crypto.createHmac('sha256', "NY2023@").update(text).digest("base64");
    if(hash != data.signature)
    {
        return res.status(200).json({msg: "[API-ERROR] Signature Incorrect!", code: -700 });
    }
    FixData(data.mode);
    return res.status(200).json({msg: "success", code: 1 });
});

var index = 1;
async function FixData(mode) {
    try {
        var arr = [];
        if(mode == 0)
            arr = arrSub;
        else if(mode == 1)
            arr = arrSub1;
        else if(mode == 2)
            arr = arrSub2;
        else if(mode == 3)
            arr = arrSub3;
        else if(mode == 4)
            arr = arrSub4;
        else if(mode == 5)
            arr = arrSub5;
        else if(mode == 6)
            arr = arrSub6;
        else if(mode == 7)
            arr = arrSub7;
        else if(mode == 8)
            arr = arrSub8;

        index = 1; 
        if(mode == 0 || mode == 1)
        {
            var resSet1 = await axios.post(DOMAIN_SUB1 + "syncDataClient/true");
            if(resSet1.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB1 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 2)
        {
            var resSet2 = await axios.post(DOMAIN_SUB2 + "syncDataClient/true");
            if(resSet2.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB2 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 3)
        {
            var resSet3 = await axios.post(DOMAIN_SUB3 + "syncDataClient/true");
            if(resSet3.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB3 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 4)
        {
            var resSet4 = await axios.post(DOMAIN_SUB4 + "syncDataClient/true");
            if(resSet4.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB4 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 5)
        {
            var resSet5 = await axios.post(DOMAIN_SUB5 + "syncDataClient/true");
            if(resSet5.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB5 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 6)
        {
            var resSet6 = await axios.post(DOMAIN_SUB6 + "syncDataClient/true");
            if(resSet6.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB6 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 7)
        {
            var resSet7 = await axios.post(DOMAIN_SUB7 + "syncDataClient/true");
            if(resSet7.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB7 + ": Cannot set flag!");
                return;
            }
        }
        if(mode == 0 || mode == 8)
        {
            var resSet8 = await axios.post(DOMAIN_SUB8 + "syncDataClient/true");
            if(resSet8.data.code < 0){
                //send tele
                bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB8 + ": Cannot set flag!");
                return;
            }
        }
        var time = new Date();
        var updateTime = time.getTime();

        const sleep = ms =>
        new Promise(res => {
            setTimeout(res, ms)
        })

        const myPromise = num =>
        sleep(5000).then(async () => {
            //bổ sung bản ghi call từ Binance
            try{
                var index1 = arrSub1.findIndex(x => x == num);
                var index2 = arrSub2.findIndex(x => x == num);
                var index3 = arrSub3.findIndex(x => x == num);
                var index4 = arrSub4.findIndex(x => x == num);
                var index5 = arrSub5.findIndex(x => x == num);
                var index6 = arrSub6.findIndex(x => x == num);
                var index7 = arrSub7.findIndex(x => x == num);
                var index8 = arrSub8.findIndex(x => x == num);

                let arrInsert = [];
                var symbol = num.toUpperCase();
                axios.get("https://api3.binance.com/api/v3/klines?symbol=" + symbol + "&interval=1h&limit=500").then(async (response) => {
                    response.data.forEach((item) => {
                        arrInsert.push({name: symbol, e: item[0], c: item[4], o: item[1], h: item[2], l: item[3], v: item[5], q: item[7], ut: updateTime, state: true});
                    }); 
                    if(arrInsert.length > 0)
                    {
                        var num = 0;
                        var DM = "";
                        if(index1 >= 0)
                        {
                            num = index1 + 1;
                            DM = DOMAIN_SUB1;
                        }
                        else if(index2 >= 0)
                        {
                            num = index2 + 1;
                            DM = DOMAIN_SUB2;
                        }
                        else if(index3 >= 0)
                        {
                            num = index3 + 1;
                            DM = DOMAIN_SUB3;
                        }
                        else if(index4 >= 0)
                        {
                            num = index4 + 1;
                            DM = DOMAIN_SUB4;
                        }
                        else if(index5 >= 0)
                        {
                            num = index5 + 1;
                            DM = DOMAIN_SUB5;
                        }
                        else if(index6 >= 0)
                        {
                            num = index6 + 1;
                            DM = DOMAIN_SUB6;
                        }
                        else if(index7 >= 0)
                        {
                            num = index7 + 1;
                            DM = DOMAIN_SUB7;
                        }
                        else if(index8 >= 0)
                        {
                            num = index8 + 1;
                            DM = DOMAIN_SUB8;
                        }

                        var model = { num: num, data:  arrInsert}
                        var resInsert = await axios.post(DM + "syncDataClientVal", model);
                        console.log("resInsert:", num, resInsert.data);

                        if(index == 1 && index1 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB1 + ": SynData success!");
                            index = 2; 
                        }
                        else if(index == 2 && index2 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB2 + ": SynData success!");
                            index = 3; 
                        }
                        else if(index == 3 && index3 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB3 + ": SynData success!");
                            index = 4; 
                        }
                        else if(index == 4 && index4 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB4 + ": SynData success!");
                            index = 5; 
                        }
                        else if(index == 5 && index5 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB5 + ": SynData success!");
                            index = 6; 
                        }
                        else if(index == 6 && index6 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB6 + ": SynData success!");
                            index = 7; 
                        }
                        else if(index == 7 && index7 < 0)
                        {
                            //send tele
                            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB7 + ": SynData success!");
                            index = 8; 
                        }
                    }
                });
            }
            catch(ex)
            {
                console.log("[API-ERROR] NOT FIXDATA symbol " + num + " not working");
            }
        })

        const forEachSeries = async (iterable, action) => {
            for (const x of iterable) {
                await action(x)
            }
        }

        forEachSeries(arr, myPromise)
        .then(() => {
            bot.telegram.sendMessage(CHAT_ID, "SynData ALL Domain success!");
            console.log('all done!')
        })
        var resSets1 = await axios.post(DOMAIN_SUB1 + "syncDataClient/false");
        if(resSets1.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB1 + ": Cannot set flag!");
            return;
        }
        var resSets2 = await axios.post(DOMAIN_SUB2 + "syncDataClient/false");
        if(resSets2.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB2 + ": Cannot set flag!");
            return;
        }
        var resSets3 = await axios.post(DOMAIN_SUB3 + "syncDataClient/false");
        if(resSets3.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB3 + ": Cannot set flag!");
            return;
        }
        var resSets4 = await axios.post(DOMAIN_SUB4 + "syncDataClient/false");
        if(resSets4.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB4 + ": Cannot set flag!");
            return;
        }
        var resSets5 = await axios.post(DOMAIN_SUB5 + "syncDataClient/false");
        if(resSets5.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB5 + ": Cannot set flag!");
            return;
        }
        var resSets6 = await axios.post(DOMAIN_SUB6 + "syncDataClient/false");
        if(resSets6.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB6 + ": Cannot set flag!");
            return;
        }
        var resSets7 = await axios.post(DOMAIN_SUB7 + "syncDataClient/false");
        if(resSets7.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB7 + ": Cannot set flag!");
            return;
        }
        var resSets8 = await axios.post(DOMAIN_SUB8 + "syncDataClient/false");
        if(resSets8.data.code < 0){
            //send tele
            bot.telegram.sendMessage(CHAT_ID, DOMAIN_SUB8 + ": Cannot set flag!");
        }
    }
    catch(e)
    {
        console.log("[API-ERROR] NOT FIXDATA host /domain not working");
    }
    index = 1; 
}
