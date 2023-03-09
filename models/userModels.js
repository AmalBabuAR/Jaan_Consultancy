const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
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
        default: 0 // 0 = user, 1= admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dfv0eesne/image/upload/v1676007787/samples/people/businessman-character-avatar-isolated_24877-60111.jpg_puy36u.jpg"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)