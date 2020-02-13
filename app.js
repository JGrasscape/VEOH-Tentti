const express = require('express');
const body_parser = require('body-parser');
const fs = require('fs');

let app = express();
let matkat = [];
let id = 0;

app.use(body_parser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    console.log('PATH: ' + req.path + " " + req.method);
    next();
});

app.get('/', (req, res, next) => {
    let kokonaiskorvaus = 0;
    let korvaus = 0;

    res.write(`
        <html>
        <head>
            <title>Ajopäiväkirja</title>
            <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
            <link rel="stylesheet" type="text/css" href="style.css">
        </head>
        <body>
            <h1>Matkalasku ja ajopäiväkirja</h1>

            <h3>Matkat</h3>
            <table>
                <tr>
                    <th>Päivämäärä</th>
                    <th>Reitti ja selite</th>
                    <th>Kilometrit</th>
                    <th>Päivärahat (kpl)</th>
                    <th>Osapäivärahat (kpl)</th>
                    <th>Ateriakorvaus (kpl)</th>
                    <th>Korvaus</th>
                    <th></th>
                </tr>
    `);

    matkat.forEach((matka) => {
        korvaus = matka.km * 0.43 + matka.pr * 43 + matka.opr * 20 + matka.ak * 10.5;
        kokonaiskorvaus += korvaus;
        res.write(`
                <tr>
                    <td>${matka.date}</td>
                    <td>${matka.reitti}</td>
                    <td>${matka.km}</td>
                    <td>${matka.pr}</td>
                    <td>${matka.opr}</td>
                    <td>${matka.ak}</td>
                    <td>${korvaus}€</td>
                    <td>
                        <form action="delete_trip" method="POST">
                            <input type="hidden" name="trip_id" value="${matka.id}">
                            <button type="submit">Poista matka</button>
                        </form>
                    </td>
                </tr>
        `);
    });

    res.write(`
            </table>

            <h4>Kokonaiskorvaus ${kokonaiskorvaus}€</h4>

            <form action="delete_all" method="POST">
                <button type="submit">Poista kaikki</button>
            </form>

            <form id="new" action="add_trip" method="POST">
                <h3>Syötä uusi matka</h3>
                <label for="date">Päivämäärä:</label><br>
                <input type="date" name="date"><br>
                <label for="reitti">Reitti ja selite:</label><br>
                <input type="text" name="reitti"><br>
                <label for="km">Kilometrit:</label><br>
                <input type="number" name="km"><br>
                <label for="pr">Päivärahat (kpl):</label><br>
                <input type="number" name="pr"><br>
                <label for="opr">Osapäivärahat (kpl):</label><br>
                <input type="number" name="opr"><br>
                <label for="ak">Ateriakorvaus (kpl):</label><br>
                <input type="number" name="ak"><br>
                <button type="submit">Lisää</button>
            </form>
        </body>
        </html>
    `);
    res.end();
});

app.post('/add_trip', (req, res, next) => {
    console.log('add trip');
    let matka = {
        id: id,
        date: req.body.date,
        reitti: req.body.reitti,
        km: req.body.km,
        pr: req.body.pr,
        opr: req.body.opr,
        ak: req.body.ak
    };
    id++;

    console.log(matka);
    matkat.push(matka);

    return res.redirect('/');
});

app.post('/delete_all', (req, res, next) => {
    console.log('delete all');

    matkat = [];

    return res.redirect('/');
});

app.post('/delete_trip', (req, res, next) => {
    const trip_id = req.body.trip_id;
    console.log('delete trip ' + trip_id);
    
    // Käydään matkat-taulukko läpi ja poistetaan haluttu objekti
    for (var i = 0; i < matkat.length; i++) {
        if (matkat[i].id == trip_id) {
            console.log('löytyi kohdasta ' + i);
            matkat.splice(i, 1);
            break;
        }
    }

    return res.redirect('/');
});

app.get('/style.css', (req, res, next) => {
    fs.readFile('./style.css', (err, data) => {
        res.write(data);
        res.end();
    });
});

app.use((req, res, next) => {
    console.log('404');
    res.status(404);
    res.send('404');
    res.end();
});

app.listen(8080);
