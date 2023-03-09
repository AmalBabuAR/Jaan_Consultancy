const Builder = require("../models/builderModels");
const Project = require('../models/projectModels')
const Services = require('../models/serviceModels')
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const builderCtrl = {
  phoneVer: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      console.log(phoneNumber);
      if (!phoneNumber)
        return res.status(400).json({ msg: "Please fill Phone Number field" });

      const phone = await Builder.findOne({ phoneNumber });
      if (phone)
        return res
          .status(400)
          .json({ msg: "This Phone Number already exists" });
      // console.log(phone)
      // const payload = {
      //     phone
      // }
      // const activation_token = createActivationToken(payload)
      // console.log(activation_token);

      res.json();
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  verEmailAndPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const passwordHash = await bycrypt.hash(password, 12);
      const emailExists = await Builder.findOne({ email });
      if (emailExists) return res.status(400).json({ msg: "Email exists" });

      res.status(201).json({ email, password: passwordHash });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
  },
  getServiceCategory: async (req, res) => {
    try {
      const category = await Services.find()
      
        res.json(category)
        
        
        // res.json(
        //   {
        //     value: opt.categoryName.toLocaleLowerCase(),
        //     label: opt.categoryName 
        //  })
        
   
    } catch (error) {
      console.log(error);
    }
  },
  register: async (req, res) => {
    try {
      console.log(req.body);
      const {
        phoneNumber,
        email,
        password,
        category,
        GST,
        builderName,
        companyName,
        address,
        experience,
        image
      } = req.body;
      

      const newBuilder = new Builder({
        phoneNumber,
        email,
        password,
        category,
        GST,
        builderName,
        companyName,
        address,
        experience,
        image
      });
     const saveBuilder = await newBuilder.save();
     console.log(saveBuilder._id,'sss');
     res.status(201).json({id: saveBuilder._id})
    } catch (err) {
      console.log('$$$$$',err);
    }
  },
  login : async (req, res) => {
    try {
      const {email, password} = req.body
      const builder = await Builder.findOne({email})
      if(!builder) return res.status(400).json({msg:"This email dosen't exists."})
      console.log("builder response",builder);
      const isMatch = await bycrypt.compare(password, builder.password)
      if(!isMatch) return res.status(400).json({msg: "Password is incorrect!"})
      console.log(builder, 'login builder data');

      const accessToken = createAccessToken({ id: builder._id });
      
      res.json({ accessToken ,loginBuilderId:builder._id ,check: builder.adminCheck ,msg: "Login Success!"})
  } catch (err) {
      console.log(err.message);
      return res.status(500).json({msg: err.message})
  }
  },
  registerInfo: async (req, res) => {
    const id = req.params.id
    console.log(id, 'coming id');
    try {
      const builder = await Builder.findById(id)
      console.log('res from reg info');
      console.log(builder,'#######');

      if(!builder){
        return res.status(400).json({ msg:'Builder not found'});
      } else {
        res.json(builder)
      }

    } catch (error) {
      console.log(error);

    }
  },
  getProjectImage: async (req, res) => {
    try {
      console.log('req');
      const id = req.builder
      const img = await Project.find({builderId:id})
      res.json(img[0].image)
      console.log(img[0].image,'image');
      
      
    } catch (error) {
      console.log(error);
    }
  }
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });  
};

const createAccessToken = (payload) => {
  console.log(payload);
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  console.log(payload,'creatwe token');
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });   
};

module.exports = builderCtrl;
