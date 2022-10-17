const mongoose = require("mongoose")
const Hairsalon = require("../models/hairsalon")
const { places, descriptors } = require("./seedHelpers")
const cities = require("./cities")

mongoose.connect("mongodb://localhost:27017/yelp-hair-salon", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Hairsalon.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const hairsalon = new Hairsalon({
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`, 
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await hairsalon.save()

    }
  
}

seedDB().then(() => {
    mongoose.connection.close()
})