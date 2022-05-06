const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpreessError = require('../utils/expressError');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middlewear');
const campground = require('../controller/campground')
const multer  = require('multer');
const res = require('express/lib/response');
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })




router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground,catchAsync(campground.creatNewCampground))
  

router.get('/new', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.edit))
    .delete(isAuthor, catchAsync(campground.deleteCampground))


router.get('/:id/edit',isLoggedIn, catchAsync(campground.editForm))

module.exports = router;