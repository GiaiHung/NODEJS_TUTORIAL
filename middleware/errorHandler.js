const {logEvents} = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.message}: ${err.message}`, 'errLog.txt')
    console.error(err.stack)
    res.status(500).send(err.message)
    next()
}

module.exports = {errorHandler}