const mongoose = require('mongoose');
const Review = require('./review');

const campgroundSchema = new mongoose.Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
    location: String,
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