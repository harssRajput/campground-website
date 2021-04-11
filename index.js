const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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


// campground CRUD routing start
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { useFindAndModify: false });
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds: campgrounds })
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const checkIt = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.get('/', (req, res) => {
    res.render('index')
})
// campground CRUD functionality ends here

app.listen(3000, () => {
    console.log('serving on port 3000')
})


