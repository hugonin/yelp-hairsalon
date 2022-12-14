const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const Hairsalon = require("./models/hairsalon")

const port = 3000

mongoose.connect("mongodb://localhost:27017/yelp-hair-salon", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))

app.get("/", (req,res) => {
    res.render("home")
})

app.get("/salons", async (req,res) => {
    const salons = await Hairsalon.find({})
    res.render("salons/index", { salons })
})


app.get("/salons/new", (req,res) => {
    res.render("salons/new")
})

app.post("/salons", async(req, res) => {
    const salon = new Hairsalon(req.body.salon)
    await salon.save()
    res.redirect(`/salons/${salon._id}`)

})

app.get("/salons/:id", async (req,res) => {
    const salon = await Hairsalon.findById(req.params.id)
    res.render("salons/show", { salon })
})

app.get("/salons/:id/edit", async (req,res) => {
    const salon = await Hairsalon.findById(req.params.id)
    res.render("salons/edit", { salon })
})

app.put("/salons/:id", async (req, res) => {
    const { id } = req.params
    const salon =  await Hairsalon.findByIdAndUpdate(id, {...req.body.salon})
    res.redirect(`/salons/${salon._id}`)
})

app.delete("/salons/:id", async (req, res) => {
    const { id } = req.params
    const salon =  await Hairsalon.findByIdAndDelete(id)
    res.redirect("/salons")
})


app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})