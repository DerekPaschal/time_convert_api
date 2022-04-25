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

app.get('/date-offset-xml', (req, res) => {
    try {
        let result = dateOffsetAPI(req);

        console.log(result);

        res.send('<result>'+result+'</result>');

    } catch (e) {
        console.error(e);

        try {
            res.status(500).send('<error>'+e+'</error>');
        } catch (e) {
            console.error(e);
        }
    }
});

app.get('/date-offset-json', (req, res) => {
    try {
        let result = dateOffsetAPI(req);

        console.log(result);

        res.send(JSON.stringify({
            "result": result
        }));

    } catch (e) {
        console.error(e);

        try {
            res.status(500).send(JSON.stringify({
                "error": e
            }));
        } catch (e) {
            console.error(e);
        }
    }
});

function dateOffsetAPI(req) {
    // Get query params
    // Get the amount of unitless offset
    let offsetAmount  = req.query.amount;
    // Get the unit of the offset (days, years, ect.)
    let offsetUnit  = req.query.unit;
    // Get the fallback date in case of error
    let fallback  = req.query.default;

    let result;

    try {
        if (offsetAmount==null || offsetUnit==null) {
            throw "Missing required parameters 'amount' or 'unit'"
        }

        let daysOffset = timeConvert(offsetUnit, 'day', offsetAmount);

        let resultDate = new Date();
        resultDate.setDate(resultDate.getDate() - daysOffset);

        let dd = String(resultDate.getDate()).padStart(2, '0');
        let mm = String(resultDate.getMonth()+1).padStart(2, '0');
        let yyyy = String(resultDate.getFullYear()).padStart(4, '0');

        result = yyyy + "-" + mm + "-" + dd;
    } catch (e) {
        // Check for fallback value
        if (fallback) {
            // Fallback exists, use that
            result = fallback;
        } else {
            // Fallback missing, throw error after all
            throw e;
        }
    }
    return result;
}

app.get('/time-convert-xml', (req, res) => {
    try {
        let result = timeConvertAPI(req);

        res.send('<result>'+result+'</result>');

    } catch (e) {
        console.error(e);

        try {
            res.status(500).send('<error>'+e+'</error>');
        } catch (e) {
            console.error(e);
        }
    }
});

app.get('/time-convert-json', (req, res) => {
    try {
        let result = timeConvertAPI(req);

        res.send(JSON.stringify({
            "result": result
        }));

    } catch (e) {
        console.error(e);
        try {           
            res.status(500).send(JSON.stringify({
                "error": e
            }));
        } catch (e) {
            console.error(e);
        }
    }
});

function timeConvertAPI(req) {
    // Get query params
    // Convert from
    let convertFrom = req.query.from;
    // Convert to
    let convertTo = req.query.to;
    // Amount
    let amount = req.query.amount;

    let result = Math.round(timeConvert(convertFrom, convertTo, amount));

    console.log("Converted: result="+result+"; from="+convertFrom+"; to="+convertTo+"; amount="+amount+"; default="+fallback);

    return result;
}

function timeConvert(convertFrom, convertTo, amount) {
    
    if (!convertFrom || !convertTo || !amount) {
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
        // Do nothing, result is already in days
    } else {
        throw "Must convert from years, months, weeks, or days. Input is: "+convertFrom;
    }

    if (yearKeys.includes(convertTo)) {
        result /= daysInYear;
    } else if (monthKeys.includes(convertTo)) {
        result /= daysInMonth;
    } else if (weekKeys.includes(convertTo)) {
        result /= 7;
    } else if (dayKeys.includes(convertTo)) {
        // Do nothing, result is already in days
    } else {
        throw "Must convert to years, months, weeks, or days. Input is: "+convertTo;
    }

    return result;
}

app.listen(PORT);
console.log(`Running on port ${PORT}`);
