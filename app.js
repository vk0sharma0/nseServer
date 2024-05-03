
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up CORS options
const corsOptions = {
    origin: '*',
    methods: 'GET',
    allowedHeaders: 'Content-Type',
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

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

async function fun() {
   await fetch('https://jsonplaceholder.typicode.com/todos/1', {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json ,text/plain',
            'Accept-Encoding': 'gzip, compress, deflate'


        }
    })
        .then((res) => {
            return res.json();
        })
        .then((response) => {
            const data = response;
            console.log("Data:", data);
            
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

fun();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
