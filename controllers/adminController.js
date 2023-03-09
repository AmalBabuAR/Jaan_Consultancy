const bycrypt = require('bcrypt')
const Admin = require('../models/adminModels')
const Builder = require('../models/builderModels')
const Services = require('../models/serviceModels')
const jwt = require('jsonwebtoken')
const { json } = require('express')


const adminCtrl = {
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const admin = await Admin.findOne({email})
            if(!admin) return res.status(400).json({msg:"This email dont exists."})

            const isMatch = await bycrypt.compare(password, admin.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect!"})
            console.log(admin, 'login admin data');
            const accessToken = createAccessToken({ id: admin._id });
            
            res.json({ accessToken ,msg: "Login Success!"})

        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
    register : async (req, res) => {
        try {
            console.log(req.body);
            const {name, email, password} = req.body

            const passwordHash = await bycrypt.hash(password, 12)

            const newAdmin = new Admin({
                name, email, password: passwordHash
            })

            await newAdmin.save()
            

        } catch (error) {
            console.log(error);
        }
    },
    approval : async (req, res) => {
        try {
            const approve = await Builder.find({adminCheck:false})
            console.log(approve);
            res.json(approve)
        } catch (error) {
            console.log(error);
        }
    },
    approvalAccept: async (req, res) => {
        try {
            const {id} = req.body
            const accept = await Builder.findByIdAndUpdate(id,{adminCheck: true},{new: true})
            console.log(accept,'approval data');
            res.json({msg:`${accept.companyName} Accept Successfully`})
        } catch (error) {
            
        }
    },
    getServiceDetails: async (req, res) => {
        try {
            const details = await Services.find()
            console.log(details);
            res.json(details)
        } catch (error) {
            console.log(error);
        }
    }

}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = adminCtrl