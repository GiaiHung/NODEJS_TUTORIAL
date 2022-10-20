const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost/nodejs_tutorial');
    } catch (error) {
        console.error(error);
    }
}

module.exports = {connect}