const cron = require("cron");
const axios = require("axios");
module.exports = {
    CheckDomain: async () => {
        new cron.CronJob('30 0/2 * * * *', async () => {
            try
            {
                var date = (new Date()).getTime();
                var result1 = await axios.get('https://asutaka-subcribe1.onrender.com/');
                console.log(date + "|subcribe1|", result1.data);

                var result2 = await axios.get('https://asutaka-subcribe2.onrender.com/');
                console.log(date + "|subcribe2|", result2.data);

                var result3 = await axios.get('https://asutakaoutlook-subcribe3.onrender.com/');
                console.log(date + "|subcribe3|", result3.data);

                var result4 = await axios.get('https://asutakaoutlook-subcribe4.onrender.com/');
                console.log(date + "|subcribe4|", result4.data);

                var result5 = await axios.get('https://nguyenphuict-subcribe5.onrender.com/');
                console.log(date + "|subcribe5|", result5.data);

                var result6 = await axios.get('https://nguyenphuict-subcribe6.onrender.com/');
                console.log(date + "|subcribe6|", result6.data);

                var result7 = await axios.get('https://asutakayahoo-subcribe7.onrender.com/');
                console.log(date + "|subcribe7|", result7.data);

                var result8 = await axios.get('https://asutakayahoo-subcribe8.onrender.com/');
                console.log(date + "|subcribe8|", result8.data);
            }
            catch(e)
            {
                console.log("[EXCEPTION]", e);
            }
        }).start();
    }
}