const request = require('request')

const weatherstack = (latitude, longtitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=443049f7e2bab3839f2f6482c2e5f4ad&query=' + latitude + ',' + longtitude
    //console.log(url)

    request({ url: url, json: true }, function (error, { body }) {
        if (error) {
            callback('Unable to connect to weather service!')
            return
        } else if (body.error) {
            console.log(body.error.info)
            return
        }
        callback(undefined, body.current.weather_descriptions + '. Currently ' + body.current.temperature + '°C.\nFeels like: ' + body.current.feelslike + '°C.\nThere is a ' + body.current.precip + '% chance of rain.'
        )
    });
}

module.exports = weatherstack