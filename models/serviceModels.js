const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    categoryName : {
        type: String,
        require: true
    },
    image: {
        public_id :{
            type: String,
        },
        url: {
            type: String
        }, 
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ServiceCategory', serviceSchema )