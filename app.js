const express = require('express');
const body_parser = require('body-parser');

let app = express();
let matkat = [];

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
                </tr>
        `);
    });

    res.write(`
            </table>

            <h4>Kokonaiskorvaus ${kokonaiskorvaus}€</h4>

            <form action="delete_all" method="POST">
                <button type="submit">Poista kaikki</button>
            </form>

            <form action="add_trip" method="POST">
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
        date: req.body.date,
        reitti: req.body.reitti,
        km: req.body.km,
        pr: req.body.pr,
        opr: req.body.opr,
        ak: req.body.ak
    };

    console.log(matka);
    matkat.push(matka);

    return res.redirect('/');
});

app.post('/delete_all', (req, res, next) => {
    console.log('delete all');

    matkat = [];

    return res.redirect('/');
});

app.use((req, res, next) => {
    console.log('404');
    res.status(404);
    res.send('404');
    res.end();
});

app.listen(8080);
