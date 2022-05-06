const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    res.locals.title = "Campground";
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {
        campgrounds
    })
}

module.exports.renderNewForm = (req, res) => {
    res.locals.title = "New";
    res.render('campgrounds/new')
}

module.exports.creatNewCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpreessError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f=>({url: f.path, filename: f.filename}))
    // console.log(campground)
    campground.author = req.user._id;
    await campground.save()
    req.flash('success', 'Sucessfully created a new campground')
    res.redirect(`campground/${campground.id}`)
}

module.exports.showCampground = async (req, res) => {
    res.locals.title = "Details";
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id).populate({
       path: 'reviews',
       populate: {
           path: 'author'
       }
        }).populate('author')
        // console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campground')
    }
    // console.log(campground.images)
    res.render('campgrounds/show', {
        campground
    })
}

module.exports.editForm = async (req, res) => {
    res.locals.title = "Edit";
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {
        campground
    })
}

module.exports.edit = async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id)
    const camp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    const imgs =  req.files.map(f=>({url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    req.flash('success', 'Sucessfully updated campground')
    res.redirect(`/campground/${campground.id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Sucessfully deleted campground')
    res.redirect('/campground')
}