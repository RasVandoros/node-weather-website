const path = require('path')
const express = require('express')
const hbs = require('hbs')

const weatherstack = require('./utils/weatherstack')
const geocode = require('./utils/geocode')

const app = express()

//define paths
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsDirectoryPath = path.join(__dirname, "../templates/views")
const partialsDirectoryPath = path.join(__dirname, "../templates/partials")

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDirectoryPath)
hbs.registerPartials(partialsDirectoryPath)

//setup static dirs to serve
app.use(express.static(publicDirectoryPath))
app.use(express.static(viewsDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'g-van can see the future(facts)',
        name: 'g-van'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'g-van',
        helpText: 'Get some help bro'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'g-van'
    })
})

app.get('/weather', (req, res) => {
    //http://localhost:3000/products?address=holargos
    if (!req.query.address) {
        return res.send({
            error: 'You must enter a search term'
        })
    }
    const address = req.query.address


    geocode(address, (error, { latitude, longtitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        weatherstack(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            //console.log(location)
            //console.log(forecastData)

            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })

})

app.get('/products', (req, res) => {
    //http://localhost:3000/products?search=games
    if (!req.query.search) {
        return res.send({
            error: 'You must enter a search term'
        })
    }
    console.log(req.query.search)

    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'g-van',
        errorMessage: 'Help not found!',
        url: '/help',
        redTo: 'Help'
    })
});

app.get('/about/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'g-van',
        errorMessage: 'About not found!',
        url: '/about',
        redTo: 'About'
    })
});

app.get('/weather/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'g-van',
        errorMessage: 'Weather not found!',
        url: '/weather',
        redTo: 'Weather'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'g-van',
        errorMessage: 'Page not found!',
        url: '/',
        redTo: 'Home'
    })
})


app.listen(3000, () => {
    console.log('server is up on port 3000')
})