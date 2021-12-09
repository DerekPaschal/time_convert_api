'use strict';

const express = require('express');

// Constants
const PORT = 80;
console.log("PORT: "+PORT);
const HOST = '0.0.0.0';

const daysInMonth = 30.437;
const daysInYear = 365.24;

// App
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/time-convert-xml', (req, res) => {
    try {
        // Get query params
        // Convert from
        let convertFrom = req.query.from;
        // Convert to
        let convertTo = req.query.to;
        // Amount
        let amount = req.query.amount;

        if (convertFrom == null || convertTo == null || amount == null
            || convertFrom == "" || convertTo == "" || amount == "") {

             throw "Error converting: from="+convertFrom+"; to="+convertTo+"; amount="+amount;
        }

        convertFrom = convertFrom.toLowerCase().trim();
        convertTo = convertTo.toLowerCase().trim();
        amount = Number(amount.toLowerCase().trim());

        let result = amount;

        if (convertFrom == "year" || convertFrom == "years") {
            result *= daysInYear;
        } else if (convertFrom == "month" || convertFrom == "months") {
            result *= daysInMonth;
        } else if (convertFrom == "week" || convertFrom == "weeks") {
            result *= 7;
        } else if (convertFrom != "day" && convertFrom != "days") {
            throw "Must convert from years, months, weeks, or days.";
        }

        if (convertTo == "year" || convertTo == "years") {
            result /= daysInYear;
        } else if (convertTo == "month" || convertTo == "months") {
            result /= daysInMonth;
        } else if (convertFrom == "week" || convertFrom == "weeks") {
            result /= 7;
        } else if (convertTo != "day" && convertTo != "days") {
            throw "Must convert to years, months, weeks, or days.";
        }

        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        });

        res.end('<result>'+Math.round(result)+'</result>');

    } catch (e) {
        res.writeHead(500, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        });

        console.error(e);

        res.end('<error>'+e+'</error>');
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
