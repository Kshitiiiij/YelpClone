const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync= require('../utils/catchAsync')
const User = require('../models/user');
const campground = require('../controller/users');

router.route('/register')
    .get(campground.formNewUser)
    .post(catchAsync(campground.postNewUser))
    
router.route('/login')
    .get(campground.loginUser)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), campground.postLoginuser)

router.get('/logout', campground.logotUser)

module.exports = router;