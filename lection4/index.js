const express = require('express');
const { checkBody, checkParams } = require('./validation/validator');
const { idScheme, articleScheme } = require('./validation/scheme');

const app = express();

let uniqueId = 0;
const articles = [];

app.use(express.json());

// Получить все статьи


app.get('/articles', (req, res) => {
    res.send({ articles });
});

// Получить конкретную статью


app.get('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        res.send({ article })
    } else {
        res.status(404);
        res.send({ article: nul });
    }
});

// Создание статьи

app.post('/articles', checkBody(articleScheme), (req, res) => {
    uniqueId += 1;

    articles.push({
        id: uniqueId,
        ...req.body
    })
    res.send({
        id: uniqueId
    })
})

// Обновление статьи

app.put('/articles/:id', checkParams(idScheme), checkBody(articleScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        article.title = req.body.title;
        article.content = req.body.content;
        res.send({ article });
    } else {
        res.status(404);
        res.send({ article: null });
    }
})

// Удаление статьи

app.delete('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        const articleIndex = articles.indexOf(article);
        articles.splice(articleIndex, 1);
        res.send({ article });
    } else {
        res.status(404);
        res.send({ article: null });
    }
})

// Обработка несуществующих роутов

app.use((req, res) => {
    res.status(404).send({
        message: 'URL not found'
    })
})

app.listen(3000, () => { console.log('Сервер запущен!') })