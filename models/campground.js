const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    location: String,
    description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;