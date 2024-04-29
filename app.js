
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

let time;
let exdate;
let currPrice;
let tot_call_oi = 0;
let tot_put_oi = 0;
let tot_call_oi_change = 0;
let tot_put_oi_change = 0;
let call_oi_change_diff = 0;
let put_oi_change_diff = 0;
let tot_call_volume = 0
let tot_put_volume = 0
let tot_call_volume_diff = 0
let tot_put_volume_diff = 0
let call_rate = 0;
let put_rate = 0;
let pcr;
let history_call_oi_change = [];
let history_put_oi_change = [];
let history_call_oi_change_diff = [];
let history_put_oi_change_diff = [];
let history_tot_call_volume_diff = [];
let history_tot_put_volume_diff = [];
let history_tot_call_oi = [];
let history_tot_put_oi = [];
let history_pcr = [];
let history_call_rate = [];
let history_put_rate = [];
let timestamps = [];
let a = 0;
let interval_time = 20000;
let symbol = " NIFTY";
let jsonData;
let finaldata;

// Set up CORS options
const corsOptions = {
    origin: '*',
    methods: 'GET',
    allowedHeaders: 'Content-Type',
    'Access-Control-Allow-Origin': '*'
};



// Set up route to proxy the NSE India API request
app.get('/', cors(corsOptions), async (req, res) => {
    try {
        res.send(finaldata);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
async function myfun() {
    try {
        const response = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY");
        const data = await response.text();
        jsonData = JSON.parse(data);

        console.log(jsonData.records.timestamp);

        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

        setTimeout(() => {


            symbol = jsonData.filtered.data[1].PE.underlying;
            time = jsonData.records.timestamp;
            exdate = jsonData.records.expiryDates[0];
            currPrice = jsonData.records.underlyingValue;
            tot_call_oi = 0;
            tot_put_oi = 0;
            tot_call_oi_change = 0;
            tot_put_oi_change = 0;
            for (let i = 0; i < jsonData.filtered.data.length; i++) {
                if (jsonData.filtered.data[i].expiryDate == exdate) {
                    tot_call_oi += jsonData.filtered.data[i].CE.openInterest;
                    tot_put_oi += jsonData.filtered.data[i].PE.openInterest;

                    tot_call_oi_change += jsonData.filtered.data[i].CE.changeinOpenInterest;
                    tot_put_oi_change += jsonData.filtered.data[i].PE.changeinOpenInterest;

                    tot_call_volume += jsonData.filtered.data[i].CE.totalTradedVolume;
                    tot_put_volume += jsonData.filtered.data[i].PE.totalTradedVolume;

                };

            };
            //..................................................
            if (a != tot_call_oi_change) {

                timestamps.push(jsonData.records.timestamp.split(' ')[1].toString());
                if (timestamps.length >= 20) {
                    timestamps.shift();
                }
                //..........................................................


                tot_call_volume_diff = tot_call_volume - tot_call_volume_diff;
                tot_put_volume_diff = tot_put_volume - tot_put_volume_diff;
                history_tot_call_volume_diff.push(tot_call_volume_diff);
                if (history_tot_call_volume_diff.length > 20) {
                    history_tot_call_volume_diff.shift();
                }
                history_tot_put_volume_diff.push(tot_put_volume_diff);
                if (history_tot_put_volume_diff.length > 20) {
                    history_tot_put_volume_diff.shift();
                }


                //.........................................................
                call_oi_change_diff = tot_call_oi_change - call_oi_change_diff;
                put_oi_change_diff = tot_put_oi_change - put_oi_change_diff;
                history_call_oi_change_diff.push(call_oi_change_diff);
                if (history_call_oi_change_diff.length > 20) {
                    history_call_oi_change_diff.shift();
                };
                history_put_oi_change_diff.push(put_oi_change_diff);
                if (history_put_oi_change_diff.length > 20) {
                    history_put_oi_change_diff.shift();
                };
                //.......................................................

                history_call_oi_change.push(tot_call_oi_change);
                if (history_call_oi_change.length > 20) {
                    history_call_oi_change.shift();
                };
                history_put_oi_change.push(tot_put_oi_change);
                if (history_put_oi_change.length > 20) {
                    history_put_oi_change.shift();
                };
                //..................................................

                history_tot_call_oi.push(tot_call_oi);
                if (history_tot_call_oi.length > 20) {
                    history_tot_call_oi.shift();
                };
                history_tot_put_oi.push(tot_put_oi);
                if (history_tot_put_oi.length > 20) {
                    history_tot_put_oi.shift();
                };
                //......................................................
                call_rate = (call_oi_change_diff / 90).toString().split(".")[0];
                history_call_rate.push(call_rate);
                if (history_call_rate.length > 20) {
                    history_call_rate.shift();
                }
                put_rate = (put_oi_change_diff / 90).toString().split(".")[0];
                history_put_rate.push(put_rate);
                if (history_put_rate.length > 20) {
                    history_put_rate.shift();
                }
                //....................................................

                pcr = (tot_put_oi_change / tot_call_oi_change).toFixed(2);
                history_pcr.push(pcr);
                if (history_pcr.length > 20) {
                    history_pcr.shift();
                }

                a = tot_call_oi_change;
            };

            let mapdata =
            {
                "data": {
                    "time": time,
                    "exdate": exdate,
                    "currprice": currPrice,
                    "tot_call_oi": tot_call_oi,
                    "tot_put_oi": tot_put_oi,
                    "tot_call_oi_change": tot_call_oi_change,
                    "tot_put_oi_change": tot_put_oi_change,
                    "call_oi_change_diff": call_oi_change_diff,
                    "put_oi_change_diff": put_oi_change_diff,
                    "tot_call_volume_diff": tot_call_volume_diff,
                    "tot_put_volume_diff": tot_put_volume_diff,
                    "call_rate": call_rate,
                    "put_rate": put_rate,
                    "pcr": pcr,
                    "history_tot_call_oi": history_tot_call_oi,
                    "history_tot_put_oi": history_tot_put_oi,
                    "history_call_oi_change": history_call_oi_change,
                    "history_put_oi_change": history_put_oi_change,
                    "history_call_oi_change_diff": history_call_oi_change_diff,
                    "history_put_oi_change_diff": history_put_oi_change_diff,
                    "history_tot_call_volume_diff": history_tot_call_volume_diff,
                    "history_tot_put_volume_diff": history_tot_put_volume_diff,
                    "history_call_rate": history_call_rate,
                    "history_put_rate": history_put_rate,
                    "history_pcr": history_pcr,
                    "symbol": symbol,
                    "timestamps": timestamps
                }
            };



            finaldata = JSON.stringify(mapdata);
            console.log("Data fetched successfully", mapdata);
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



        }, 1000);

    } catch (error) {
        console.error('Error fetching data:', error);
    };


}

setInterval(() => {

    myfun();

}, interval_time);
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
