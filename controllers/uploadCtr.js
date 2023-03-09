const cloudinary = require('cloudinary')
const fs = require('fs')
const Project = require('../models/projectModels')
const Services = require('../models/serviceModels')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME ,
    api_key: process.env.CLOUD_API_KEY ,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadCtrl = {
    uploadAvatar: (req, res) => {
        try {
           const file = req.files.file;

           cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 150, height: 150, crop: "fill"
           }, async(err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath)

            res.json({url: result.secure_url})

           })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadProjectImage: async (req, res) => {
        try {
            const builderID = req.builder
            const file = req.files.file;
            console.log(file, '2 file');

            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'builderProject', width: 500, height: 500, crop: 'fill'
            }, async(err, result) => {
                if(err) throw err;
                removeTmp(file.tempFilePath)

                res.json({url: result.secure_url})
            })
            const id = { builderId: builderID}
            const data = {
                public_id: result.public_id,
                url: result.secure_url
            }
            const addData = {
                $push : {image: data}
            }
            const options = {
                upsert: true // Creates a new document if no document matches the query criteria
              };
            console.log(id, addData);
            const projectSave = await Project.updateOne(id, addData, options) 
            console.log(result);
            console.log(projectSave);
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadService : async (req, res) => {
        try {
            const serviceCategory = req.body.name
            const file = req.files.file
            console.log(file);

            const check = await Services.findOne({categoryName: serviceCategory})
            if(check) return res.status(400).json({msg:"This Service Category already exists"})
            console.log(check);
            
            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'serviceCategory', width: 500, height: 500,
                crop: 'fill'
            }, async(err,result) => {
                if(err) throw err;
                removeTmp(file.tempFilePath)
                res.json({url: result.secure_url})
            })
            console.log(result);
            
            const imageData = {
                public_id: result.public_id,
                url: result.secure_url
            }
            console.log(imageData);
            const newServices = new Services({
                categoryName: serviceCategory,
                image: imageData
            })
            console.log(newServices);
            const newRes = await newServices.save()
            console.log(newRes);

            
        } catch (error) {
            console.log(error);
        }
    },
    uploadBuilderLogo : async (req, res) => {
        try {
            const file = req.files.file
            console.log(file);

            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'BuildersLogo', width: 500, height: 500,
                crop: 'fit'
            }, async(err,result) => {
                if(err) throw err;
                removeTmp(file.tempFilePath)
                const imageData = {
                    public_id: result.public_id,
                    url: result.secure_url
                }
                res.json(imageData)
            })
            console.log(result);

        } catch (error) {
            console.log(error);
        }
    }

}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

module.exports = uploadCtrl