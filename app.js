const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 2311;

const PollClient = require('./PollClient');
const poll_client = new PollClient(`http://localhost:${port}/long-poll`);

let resp_ms = 15000;
let count = 0;

app.use(express.json());
app.get('/long-poll', (req, res) => {
    req.setTimeout(5000); // Setting the server timeout
    if (count < 3) count += 1;
    if (count === 3) resp_ms = 2000;
    console.log(`Response will come after ${resp_ms / 1000} seconds`);
    setTimeout(() => {
        res.send({ data: `Hello: ${count}` }).status(200);
    }, resp_ms);
});

app.listen(port, 'localhost', () => {
    console.log(`Server running at port: ${port}`);
    // startlongPoll();
    poll_client.start();
    setTimeout(() => {
        poll_client.pause();
    }, 30000);
    setTimeout(() => {
        poll_client.resume();
    }, 60000);
    setTimeout(() => {
        poll_client.stop();
    }, 80000);
});

async function makeRequest() {
    try {
        const res = await fetch('http://localhost:2311/long-poll');
        console.log(`Status : ${res.status}`);
    } catch (err) {
        console.log('Error occured: ', err);
    } finally {
        makeRequest();
    }
}

function startlongPoll() {
    console.log(`Starting the long poll...`);
    makeRequest();
}
