if(process.env.NODE_ENV !== "production"){
    require('dotenv').config(); 
}

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const methodOverride = require('method-override')
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpreessError = require('./utils/expressError');
const joi = require('joi');
const ExpressError = require('./utils/expressError');
const Review = require('./models/review')
const {
    campgroundSchema,
    reviewSchema
} = require('./schemas');
const session = require('express-session')
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const flash = require('connect-flash')

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user')


const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("database connected");
})

app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next()
})

app.use('/campground', campgroundRoutes)
app.use('/campground/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    next(new ExpreessError())
})

app.all('*', (req, res, next) => {
    next(new ExpreessError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', {
        err
    })
})


app.listen(3000, () => {
    console.log('Listening at port 3000')
})