const mongoose = require('mongoose')

const builderSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, "Please enter your Phone Number!"],
        unique: true
    },
    email: {
        type: String,
        required: [true,"Please Enter uour email"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter your Password"],
        trim : true
    },
    category: {
        type: String,
        required: [true, "Please enter your GST"],
        trime: true,
    },
    GST : {
        type: String,
        required: [true,"Please Enter GST"],
        trim: true,
        unique: true
    },
    builderName: {
        type: String,
        required: [true,"Please Enter Builder Name"],
        trim: true,
    },
    companyName: {
        type: String,
        required: [true,"Please Enter Company Name"],
        trim: true,
    },
    address: {
        type:  {
            addressLine1 : {
                type: String,
                required:[true, "Please enter address"]
            },
            addressLine2 : {
                type: String,
            },
            addressLine3 : {
                type: String,
            },
            pincord : {
                type: Number,
                required:[true, 'Please enter pincord']
            }
        }
    },
    experience: {
        type: Number,
        required: [true, "Please enter your experience"],
    },
    image: {
        public_id :{
            type: String,
        },
        url: {
            type: String
        }, 
    },
    role: {
        type: Number,
        default: 1
    },
    adminCheck: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Builder", builderSchema)