const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')
const app = express()
const Article = require('./db').Article

app.set('view engine','ejs')

// 支持编码为json的请求消息体
app.use(bodyParser.json())
// 支持编码为表单的请求消息体
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.port || 3000

app.get('/articles', (req,res,next) => {
    Article.all((err,articles) => {
        if(err) { throw err }
        res.render('articles', { articles })
    })
})

app.post('/articles', (req,res,next) => {
    const { url } = req.body
    read(url, (err, result) => {
        if(err || !result) {
            res.status(500).send('Error downloading article')
        }
        Article.create({title: result.title, content: result.content}, err => {
            if (err) { return next(error) }
            res.send({ message: 'created' })
        })
    })
})

app.get('/articles/:id', (req,res,next) => {
    const id = req.params.id
    Article.find(id,(err, article) => {
        if(err) { throw err }
        res.send(article)
    })
})

app.delete('/articles/:id', (req,res,next) => {
    const id = req.params.id
    Article.delete(id, err => {
        if(err) { throw err }
        res.send({ message: 'deleted'})
    })
})

app.get('/', (req,res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log('server is run')
})

module.exports = app