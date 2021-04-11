const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// database connected now


const seedDB = async () => {
    await Campground.deleteMany();

    // sample func give random value from given array
    const sample = array => array[Math.floor(Math.random() * array.length)];

    // seed DB with random values from cities and seedHelpers modules
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });

        await camp.save();
    }
}

seedDB()
    .then(() => {
        db.close();
    })

// title : (city+state)
// location : (places+descriptors)