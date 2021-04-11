const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    location: String,
    description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;