const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter your Name !"],
        trim: true
    },
    email: {
        type: String,
        require: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: [true, "Please enter your Password!"],
        trim: true
    },
    role: {
        type: Number,
        default: 2 // 0 = user,1= builder, 2= admin 
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema)