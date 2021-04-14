const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const { campgroundSchema } = require('./schemas');


// for connecting mongoose to mongodb
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
// mongoose connection done

// for setting /views folder and setting ejs as templating engine.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// for parsing the req object in express
app.use(express.urlencoded({ extended: true }));
// for overriding method in HTML Forms
app.use(methodOverride('_method'));

const validateSchema = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

// campground CRUD routing start
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.put('/campgrounds/:id', validateSchema, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { useFindAndModify: false });
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds: campgrounds })
}))

app.post('/campgrounds', validateSchema, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const checkIt = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.get('/', (req, res) => {
    res.render('index')
})
// campground CRUD functionality ends here

app.all('*', (req, res, next) => {
    // console.lod('inside undefined path handler')
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    // console.log('inside custom error')
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No!, Something Went Wrong';
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})

