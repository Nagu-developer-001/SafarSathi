const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;
const placeSchema =  new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image:{
        url:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

const placeList = new mongoose.model("placeList",placeSchema);

module.exports = placeList;