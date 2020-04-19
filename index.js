const express = require('express');
const app = express();

const SERVER_PORT = 8000;

app.get('/', (req,res) => {
    res.send("Hello, World!");
});

app.listen(SERVER_PORT, () => {
    console.log("Kapde Wala Backend listening on port: "+SERVER_PORT);
});
