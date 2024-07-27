const Listing = require("../modals/listing.js");
const { listingSchema } = require("../Schema.js");

// Index
module.exports.index = async (req, res) => {
    res.cookie("name", "Mudasir");
    res.cookie("visitHere", "yes", { signed: true });
    // console.log(req.cookies); //prints unsigned cookie
    // console.log(req.signedCookies);//prints signed cookies
    const initData = await Listing.find({});
    res.render("wanderlust/index.ejs", { initData })
}

//Show
module.exports.show = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({
        path: "review", populate: {
            path: "auther"
        },
    }).populate("owner");
    res.render("wanderlust/show.ejs", { data });
}

//create
module.exports.create = async (req, res) => {
    const result = listingSchema.validate(req.body);
    let { title, description, price, location, country } = req.body;
    let newData = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    })
    newData.owner = req.user._id; // as owner should be into the listing
    // let newdata = new Listing(req.body.listings)
    await newData.save();
    if (!newData) {
        req.flash('error', 'Listing not found')
    }
    req.flash('success', "Listing Created Successfully");
    res.redirect("/listings");
}

//Edit 
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/edit.ejs", { data });
}

//update
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, { ...req.body })
    if (!updatedData) {
        req.flash('error', 'Listing not found')
    }
    req.flash('success', 'Listing Updated Successsfully')
    res.redirect(`/listings/${id}/show`);
}

//delete
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    if (!deletedData) {
        req.flash('error', 'Listing not found')
    }
    req.flash('success', 'Listing Deleted Successsfully')
    res.redirect("/listings");
}