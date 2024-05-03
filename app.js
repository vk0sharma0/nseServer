
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

let time = 0;
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
let call_tem = 0;
let put_tem = 0;
let history_call_vol_rate = [];
let history_put_vol_rate = [];
let a = 0;
let b = 0;
let c = 0;
let d = 0;
let x = 0;
let interval_time = 20000;
let symbol = " NIFTY";
let jsonData;
let finaldata;
let z = true;
let abc = 0;
let vk = 0;
setInterval(() => {
    if (vk > (interval_time / 1000)) {
        vk = 0;
    }
    console.log(vk);
    vk++;
}, 1000);

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

        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log('File read successfully');
            res.send(data);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
async function myfun() {
    try {

      /*  const response = await axios.get("https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY", {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json ,text/plain' ,
                 'Accept-Encoding' : 'gzip, compress, deflate' 
                
                
            }
        });*/
        
         const response = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",{headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json ,text/plain' ,
             'Accept-Encoding' : 'gzip, compress, deflate' 
            
    }
        });
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
            abc++;
            if (x != time) {
                abc++;
                console.log(abc);
                timestamps.push(jsonData.records.timestamp.split(' ')[1].toString());
                if (timestamps.length >= 20) {
                    timestamps.shift();
                }
                if (z) {
                    timestamps.shift();

                }
                //..........................................................
                if ((tot_call_volume - a) == 0) {
                    history_tot_call_volume_diff.push(0);

                } else if ((tot_call_volume - a) != 0) {
                    tot_call_volume_diff = tot_call_volume - a;
                    history_tot_call_volume_diff.push(tot_call_volume_diff);
                    a = tot_call_volume;
                    if (z) {

                        history_tot_call_volume_diff.shift();


                    }

                };

                if ((tot_put_volume - b) == 0) {
                    history_tot_put_volume_diff.push(0);

                } else if ((tot_put_volume - b) != 0) {
                    tot_put_volume_diff = tot_put_volume - b;
                    history_tot_put_volume_diff.push(tot_put_volume_diff);
                    b = tot_put_volume;
                    if (z) {

                        history_tot_put_volume_diff.shift();


                    }

                };

                if (history_tot_call_volume_diff.length > 20) {
                    history_tot_call_volume_diff.shift();
                }
                if (history_tot_put_volume_diff.length > 20) {
                    history_tot_put_volume_diff.shift();
                }

                

                history_tot_call_volume_diff.forEach(element => {
                    call_tem = parseInt(call_tem) + parseInt(element);
                });
                history_call_vol_rate.push(call_tem);
                if (history_call_vol_rate.length > 20) {
                    history_call_rate.shift();
                }
                if (z) {

                    history_call_rate.shift();


                }
                history_tot_put_volume_diff.forEach(element => {
                    put_tem = parseInt(put_tem) + parseInt(element);
                });
                history_put_vol_rate.push(put_tem);
                if (history_put_vol_rate.length > 20) {
                    history_put_vol_rate.shift();
                }
                if (z) {

                    history_put_vol_rate.shift();


                }



                //.........................................................

                if ((tot_call_oi_change - c) == 0) {
                    history_call_oi_change_diff.push(0);
                } else if ((tot_call_oi_change - c) != 0) {
                    call_oi_change_diff = tot_call_oi_change - c;
                    history_call_oi_change_diff.push(call_oi_change_diff);
                    c = tot_call_oi_change;
                    if (z) {


                        history_call_oi_change_diff.shift();

                    }
                }
                if ((tot_put_oi_change - c) == 0) {
                    history_put_oi_change_diff.push(0);
                } else if ((tot_put_oi_change - c) != 0) {

                    put_oi_change_diff = tot_put_oi_change - d;
                    history_put_oi_change_diff.push(put_oi_change_diff);
                    d = tot_put_oi_change;
                    if (z) {


                        history_put_oi_change_diff.shift();

                    }
                }


                if (history_put_oi_change_diff.length > 20) {
                    history_put_oi_change_diff.shift();
                };
                if (history_call_oi_change_diff.length > 20) {
                    history_call_oi_change_diff.shift();
                };





                //.......................................................

                history_call_oi_change.push(tot_call_oi_change);
                if (history_call_oi_change.length > 20) {
                    history_call_oi_change.shift();
                };
                if (z) {

                    history_call_oi_change.shift();


                }
                history_put_oi_change.push(tot_put_oi_change);
                if (history_put_oi_change.length > 20) {
                    history_put_oi_change.shift();
                };
                if (z) {

                    history_put_oi_change.shift();


                }

                //..................................................

                history_tot_call_oi.push(tot_call_oi);
                if (history_tot_call_oi.length > 20) {
                    history_tot_call_oi.shift();
                };
                if (z) {

                    history_tot_call_oi.shift();


                }
                history_tot_put_oi.push(tot_put_oi);
                if (history_tot_put_oi.length > 20) {
                    history_tot_put_oi.shift();
                };
                if (z) {

                    history_tot_put_oi.shift();


                }
                //......................................................
                history_call_oi_change_diff.forEach(element => {
                    call_rate = parseInt(call_rate) + parseInt(element);
                });
                history_call_rate.push(call_rate);
                if (history_call_rate.length > 20) {
                    history_call_rate.shift();
                }
                if (z) {


                    history_call_rate.shift();

                }
                history_put_oi_change_diff.forEach(element => {
                    put_rate = put_rate + element;
                });
                history_put_rate.push(put_rate);
                if (history_put_rate.length > 20) {
                    history_put_rate.shift();
                }
                if (z) {


                    history_put_rate.shift();

                }
                //....................................................

                pcr = (tot_put_oi_change / tot_call_oi_change).toFixed(2);
                history_pcr.push(pcr);
                if (history_pcr.length > 20) {
                    history_pcr.shift();
                }
                if (z) {


                    history_pcr.shift();
                    z = false;

                }

                x = time;
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
                    "history_tot_call_volume_diff": history_call_vol_rate,
                    "history_tot_put_volume_diff": history_put_vol_rate,
                    "history_call_rate": history_call_rate,
                    "history_put_rate": history_put_rate,
                    "history_pcr": history_pcr,
                    "symbol": symbol,
                    "timestamps": timestamps
                }
            };



            finaldata = JSON.stringify(mapdata);
            console.log("here");
            fs.writeFile('data.json', finaldata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    return;
                }
                console.log('Data has been written to file.');
            });

            console.log("after");
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



        }, 1000);

    } catch (error) {
        console.error('Error fetching data:', error);
    };


};

myfun();

setInterval(() => {

    myfun();

}, interval_time);
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
