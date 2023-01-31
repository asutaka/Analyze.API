const cron = require("cron");
const axios = require("axios");

const DOMAIN_SUB1 = "https://asutaka-subcribe1.onrender.com/";
const DOMAIN_SUB2 = "https://asutaka-subcribe2.onrender.com/";
const DOMAIN_SUB3 = "https://asutakaoutlook-subcribe3.onrender.com/";
const DOMAIN_SUB4 = "https://asutakaoutlook-subcribe4.onrender.com/";
const DOMAIN_SUB5 = "https://nguyenphuict-subcribe5.onrender.com/";
const DOMAIN_SUB6 = "https://nguyenphuict-subcribe6.onrender.com/";
const DOMAIN_SUB7 = "https://asutakayahoo-subcribe7.onrender.com/";
const DOMAIN_SUB8 = "https://asutakayahoo-subcribe8.onrender.com/";
module.exports = {
    CheckDomain1: async () => {
        new cron.CronJob('30 0/2 * * * *', async () => {
            try{
                var date = (new Date()).getTime();
                var result1 = await axios.get(DOMAIN_SUB1);
                console.log(date + "|" + DOMAIN_SUB1 + "|", result1.data);
        
                var result2 = await axios.get(DOMAIN_SUB2);
                console.log(date + "|" + DOMAIN_SUB2 + "|", result2.data);
            }
            catch(error)
            {
                console.error("CheckDomain1", error.response.data);
            }
        }).start();
    },
    CheckDomain2: async () => {
        new cron.CronJob('30 1/2 * * * *', async () => {
            try{
                var date = (new Date()).getTime();
                var result1 = await axios.get(DOMAIN_SUB3);
                console.log(date + "|" + DOMAIN_SUB3 + "|", result1.data);
        
                var result2 = await axios.get(DOMAIN_SUB4);
                console.log(date + "|" + DOMAIN_SUB4 + "|", result2.data);
            }
            catch(error)
            {
                console.error("CheckDomain2", error.response.data);
            }
        }).start();
    },
    CheckDomain3: async () => {
        new cron.CronJob('30 2/2 * * * *', async () => {
            try{
                var date = (new Date()).getTime();
                var result1 = await axios.get(DOMAIN_SUB5);
                console.log(date + "|" + DOMAIN_SUB5 + "|", result1.data);
        
                var result2 = await axios.get(DOMAIN_SUB6);
                console.log(date + "|" + DOMAIN_SUB6 + "|", result2.data);
            }
            catch(error)
            {
                console.error("CheckDomain3", error.response.data);
            }
        }).start();
    },
    CheckDomain4: async () => {
        new cron.CronJob('30 3/2 * * * *', async () => {
            try{
                var date = (new Date()).getTime();
                var result1 = await axios.get(DOMAIN_SUB7);
                console.log(date + "|" + DOMAIN_SUB7 + "|", result1.data);
        
                var result2 = await axios.get(DOMAIN_SUB8);
                console.log(date + "|" + DOMAIN_SUB8 + "|", result2.data);
            }
            catch(error)
            {
                console.error("CheckDomain4", error.response.data);
            }
        }).start();
    },
}