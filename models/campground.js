const { number } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');

const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// mongoose middleware, only triggers when "findByIdAndDelete" method id using for deleting
campgroundSchema.post('findOneAndDelete', async function(camp) {
    // console.log(camp);
    if (camp) {
        await Review.deleteMany({
            _id: { $in: camp.reviews }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;