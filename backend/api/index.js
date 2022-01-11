const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'jimhalpert',
    database: 'languages'
})

db.connect((err) => {
    if (err) throw err
    console.log('connected to languages')
})


app.get('/:language', (req, res) => {
    let sql = `SELECT * FROM ${req.params.language}`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).send(`${req.params.language} table not found`)
        }
        else {
            res.send(result)
        }
    })
})

app.get('/:language/:category/:id', (req, res) => {
    let sql = `SELECT body FROM ${req.params.language} WHERE category = '${req.params.category}' AND id = ${req.params.id}`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).send(`${req.params.language} table or element with category ${req.params.category} and id ${req.params.id} not found`)
        }
        else {
            res.send(result)
        }
    })
})

app.get('/:language/:category', (req, res) => {
    let sql = `SELECT COUNT(id) AS count FROM ${req.params.language} WHERE category = '${req.params.category}'`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err) 
            res.status(400).send(`${req.params.name} table or category ${req.params.category} not found`)
        }
        else {
            res.send(result)
        }
    })
})

app.listen(3001, () => {
    console.log('server running on port 3001')
})