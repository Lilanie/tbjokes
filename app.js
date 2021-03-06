// Hvis vi ikke er i produktionsmiljøet, skal der køres med lokale env-variable
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Joke = require('./models/Joke')

// Starter Mongoose database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Gør det muligt at læse kroppen fra HTML
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Sætter PUG som grafisk flade
app.set('view engine', 'pug')

// De forskellige routes
const rootRouter = require('./routes/tbjokes')
app.use('/', rootRouter)
const jokesRouter = require('./routes/jokes')
app.use('/jokes', jokesRouter)
const otherSitesRouter = require('./routes/othersites')
app.use('/othersites', otherSitesRouter)
const apiRouter = require('./routes/api')
app.use('/api', apiRouter)
// Fanger alle forkert stavede versioner af sidens extension
app.get('/:site', (request, response) => {
    response.redirect('/')
})

// Sætter server online
app.listen(process.env.PORT, console.log('Server running'))