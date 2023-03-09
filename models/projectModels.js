const mongoose = require('mongoose')

const projectImgSchema = new mongoose.Schema({
    builderId : {
        type: String,
        require: true
    },
    image: [
        {
        public_id : String,
        url : String
    }]
},{
    timestamps: true
})

module.exports = mongoose.model('Project', projectImgSchema)