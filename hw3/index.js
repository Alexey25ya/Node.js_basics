const express = require("express");
const app = express();
const port = "3000";
const fs = require("fs");
const path = require("path");
const pathFile = path.join(__dirname, "count.json");

if (!fs.existsSync(pathFile)) {
    const count = {
        countMain: 0,
        countAbout: 0
    }
    fs.writeFile(pathFile, JSON.stringify(count, null, 2), (error) => {
        if (error)
            console.log(error);
    });
}


app.get("/", (req, res) => {
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        let dataCount = JSON.parse(data, "utf-8");
        dataCount.countMain++;
        fs.writeFile(pathFile, JSON.stringify(dataCount, null, 2), (error) => {
            if (error)
                console.log(error);
        });
        res.send(`<h1>Главная страница Main</h1><p>Просмотров: ${dataCount.countMain}</p><a href='/about'>Страница About</a>`)
    })
});

app.get("/about", (req, res) => {
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        let dataCount = JSON.parse(data, "utf-8");
        dataCount.countAbout++;
        fs.writeFile(pathFile, JSON.stringify(dataCount, null, 2), (error) => {
            if (error)
                console.log(error);
        });
        res.send(`<h1>Страница About</h1><p>Просмотров: ${dataCount.countAbout}</p><a href='/'>Главная страница Main</a>`)
    })
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Страница не найдена!!!</h1><style>*{color:red}</style>');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
})