const { CheckDomain } = require('./cronjob.js');
const express = require('express');
const crypto = require('crypto')

const app = express();
const PORT = process.env.PORT || 8999;
app.get('/', async (req, res)  => {
    res.status(200).json({msg: "hello world", responseCode: 1 });
})
app.listen(PORT, () => console.log('server running!'));

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
        var date = new Date();
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
//Delete User
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