const express = require('express');
const fs = require('fs');
const app = express();
let visitorLog = [];

// Create log file (log.csv)
fs.writeFile(__dirname + '/log.csv', 'Agent,Time,Method,Resource,Version,Status', (err) => {
    if (err) throw err;
});

app.use((req, res, next) => {

    // Logging visitor data into log.csv
    const stamp = new Date();
    const userLog = req.headers['user-agent'] + ',' + stamp.toISOString() + ',' + req.method + ',' +
        req.originalUrl + ',' + "HTTP/" + req.httpVersion + ',' + res.statusCode;
    console.log(userLog);
    fs.appendFile(__dirname + '/log.csv', '\n' + userLog, (err) => {
        if (err) throw err;
    });

    // Pushing visitor data into global object to send to public logs
    const visitor = {};
    visitor.Agent = req.headers['user-agent'];
    visitor.Time = stamp.toISOString();
    visitor.Method = req.method;
    visitor.Resource = req.originalUrl;
    visitor.Version = "HTTP/" + req.httpVersion;
    visitor.Status = res.statusCode;
    visitorLog.push(visitor);

    next();
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {

    //Send visitor data to public logs
    res.send(visitorLog);
});

module.exports = app;