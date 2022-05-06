const express = require('express');
const router = express.Router({mergeParams: true})
const {validateReview, isLoggedIn} = require('../middlewear')
const ExpreessError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');
const { postReview, deleteReview } = require('../controller/review');


router.post('/', isLoggedIn, validateReview, catchAsync(postReview))

router.delete('/:reviewId', catchAsync(deleteReview))

module.exports = router;