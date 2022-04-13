'use strict';

const express = require('express');

// Constants
const PORT = 80;

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

        let result = Math.round(timeConvert(convertFrom, convertTo, amount));

        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        });

        res.end('<result>'+result+'</result>');

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

app.get('/time-convert-json', (req, res) => {
    try {
        // Get query params
        // Convert from
        let convertFrom = req.query.from;
        // Convert to
        let convertTo = req.query.to;
        // Amount
        let amount = req.query.amount;

        let result = Math.round(timeConvert(convertFrom, convertTo, amount));

        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        });

        res.end(JSON.stringify({
            "result": result
        }));

    } catch (e) {
        res.writeHead(500, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        });

        console.error(e);

        res.end(JSON.stringify({
            "error": e
        }));
    }
});

function timeConvert(convertFrom, convertTo, amount) {
    if (convertFrom == null || convertTo == null || amount == null
        || convertFrom == "" || convertTo == "" || amount == "") {

         throw "Error converting: from="+convertFrom+"; to="+convertTo+"; amount="+amount;
    }

    convertFrom = convertFrom.toLowerCase().trim();
    convertTo = convertTo.toLowerCase().trim();
    amount = Number(amount.toLowerCase().trim());

    let yearKeys = ["year", "years", "yr", "yrs", "y", "ys"];
    let monthKeys = ["month", "months", "mo", "mos"];
    let weekKeys = ["week", "weeks", "wk", "wks"];
    let dayKeys = ["day", "days", "d", "ds"];

    let result = amount;

    if (yearKeys.includes(convertFrom)) {
        result *= daysInYear;
    } else if (monthKeys.includes(convertFrom)) {
        result *= daysInMonth;
    } else if (weekKeys.includes(convertFrom)) {
        result *= 7;
    } else if (dayKeys.includes(convertFrom)) {
        throw "Must convert from years, months, weeks, or days.";
    }

    if (yearKeys.includes(convertTo)) {
        result /= daysInYear;
    } else if (monthKeys.includes(convertTo)) {
        result /= daysInMonth;
    } else if (weekKeys.includes(convertTo)) {
        result /= 7;
    } else if (dayKeys.includes(convertTo)) {
        throw "Must convert to years, months, weeks, or days.";
    }

    return result;
}

app.listen(PORT);
console.log(`Running on port ${PORT}`);
