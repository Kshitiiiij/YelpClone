const {
    campgroundSchema,
    reviewSchema
} = require('./schemas');
const expressError = require('./utils/expressError')
const Campground = require('./models/campground');

const { builtinModules } = require("module");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author[0].equals(req.user.id)){
        req.flash('error', 'You do not have permission to do this')
        return res.redirect(`/campground/${id}`)
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next();
    }

}

