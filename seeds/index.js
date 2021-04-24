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


const seedDB = async() => {
    await Campground.deleteMany();

    // sample func give random value from given array
    const sample = array => array[Math.floor(Math.random() * array.length)];

    // seed DB with random values from cities and seedHelpers modules
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(places)} ${sample(descriptors)}`,
            author: '607c1a31b4f2211f282eccc3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image: 'https://source.unsplash.com/random/800x600',
            price: random1000,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia obcaecati odit sapiente optio, iure excepturi! Nihil quisquam fuga rerum placeat eveniet quis, minus suscipit soluta sint corporis accusamus. Culpa, minus!'
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