const listingController = require("../models/wonderLust");

module.exports.index = async(req,res)=>{
    let allListing = await listingController.find({});
    console.log("allListing");
    res.render("listings/index.ejs",{allListing});
}
module.exports.renderFrom = (req,res)=>{
    console.log(req.locals);
    res.render("listings/newForm.ejs");
}
module.exports.getShow = async(req,res,next)=>{
    let {id} = req.params;
    console.log(id,"this is id");
    let content = await listingController.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log("Your searching for this content is not found")
    if(!content){
        req.flash("error","Your searching for this content is not found");
        res.redirect("/listings");
    }
    console.log(content);
    res.render("listings/show.ejs",{content});
}
module.exports.createList = async(req,res)=>{
    // if(!req.body.Listing){
    //     next( new ExpressErr(402,"INTERNAL SERVER ERROR"));
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    console.log("hello");
    let placeLists = req.body.Listing;
    placeLists.owner = req.user._id;
    placeLists.image = {url,filename}
    console.log(placeLists);
    let placeAdd = await listingController.insertMany(placeLists);
    console.log(placeAdd);
    req.flash("success","New Listing is Created!!!");
    res.redirect("/listings");
}
module.exports.editList = async(req,res)=>{
    let {id} = req.params;
    console.log("Listing id :--",id);
    console.log("Listing id :--",id);
    console.log("Authenticated user : ",res.locals.nowUser._id);
    let content = await listingController.findById(id);
    console.log("owner id : -- :  ",content.owner._id);
    //console.log(content);
    if(!content){
        req.flash("error","This list is not exist!!");
        res.redirect("/listings");
    }else{
        let urlPhoto = req.file.path;
        urlPhoto = urlPhoto.replace("/uploads","/uploads/w_500");
        res.render("listings/edit.ejs",{content,urlPhoto});
    }
}
module.exports.updateList = async(req,res)=>{
    let {id} = req.params;
    let placeAdd = await listingController.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    placeAdd.image = {url,filename};
    await placeAdd.save();
    }
    req.flash("success","Edited Successfully");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteList = async(req,res)=>{
    let {id} = req.params;
    let deleteEle = await listingController.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully");
    res.redirect("/listings");
}