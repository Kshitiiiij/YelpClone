const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelper')
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));


db.once('open', ()=> {
    console.log("database connected");
})

const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random = Math.floor(Math.random()*1000);
        const rand = Math.floor(Math.random()*30);
        const camp = new Campground({
            author: "623a5c6aaad889a9fcf2a659",
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor',
            price: rand,
            images: [
                {
                    url: 'https://res.cloudinary.com/dlku3szhd/image/upload/v1648845896/YelpCamp/g3r87hlejhkxhu6gxdnr.jpg',
                    filename: 'YelpCamp/g3r87hlejhkxhu6gxdnr',
                  },
                  {
                    url: 'https://res.cloudinary.com/dlku3szhd/image/upload/v1648845896/YelpCamp/qkco6hbbi9ufnnrvbedz.jpg',
                    filename: 'YelpCamp/qkco6hbbi9ufnnrvbedz',
                  },
                  {
                    url: 'https://res.cloudinary.com/dlku3szhd/image/upload/v1648845896/YelpCamp/eq1vuonxqtivwswqbw1s.jpg',
                    filename: 'YelpCamp/eq1vuonxqtivwswqbw1s',
                  }
                
            ]
        })
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})