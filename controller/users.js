const User = require('../models/user');

module.exports.formNewUser = (req, res)=>{
    res.render('users/register')
}

module.exports.postNewUser = async(req, res, next) =>{
    try{
    const {email, username, password}= req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success', 'Welcome back');
        res.redirect('/campground')
    })
       
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
    req.flash('success','Welcome to yelpCamp');
    res.redirect('/campground')
}

module.exports.loginUser = (req, res) =>{
    res.render('users/login')
}

module.exports.postLoginuser = async(req, res) =>{
    req.flash('success', "Welcome back")
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logotUser = (req, res) =>{
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/campground')
}