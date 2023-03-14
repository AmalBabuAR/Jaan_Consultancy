const Users = require('../models/userModels')
const Services = require('../models/serviceModels')
const Builder = require('../models/builderModels')
const Project = require('../models/projectModels')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendEmail')



const {CLIENT_URL} = process.env

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body
            
            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields"})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid Email"})
                
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists"})
            
            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters"})

            const passwordHash = await bycrypt.hash(password, 12) 
            
            const newUser = {
                name, email, password: passwordHash
            }

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            
            sendMail(email, url, "Verify your email address")
            console.log(activation_token, 'activation token');

            res.json({msg: 'Verification Link has send to your email'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name, email, password} = user

            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name, email, password
            })

            await newUser.save()

            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bycrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect!"})
            console.log(user ,'details');
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login Success!", user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            console.log('getAccessToken', rf_token);
            if(!rf_token) return res.status(400).json({msg: "Please Login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
              if(err) return res.status(400).json({msg: "Please Login now"})
               
              const access_token = createAccessToken({id: user.id})
              console.log('getAccessToken', access_token);
              res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body 
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exists."})

            const access_token = createAccessToken({id: user._id})
            console.log(access_token,'token email');
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({msg: "Password Reset Link has been send to your email.",token:access_token})
        } catch (err) {
            console.log(err);
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            console.log(password); 
            const passwordHash = await bycrypt.hash(password, 12)
            
            console.log(req.user);
            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            res.json({msg: "Password successfully changed!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})            
        }
    },
    getServices: async (req, res) => {
        try {
            const details = await Services.find()
            res.json(details)
        } catch (error) {
            console.log(error);
        }

    },
    getBuilderDetails: async (req, res) => {
        try {
            const categorys = req.params.category
            const data = await Builder.find({category:categorys,adminCheck:true})
            res.json(data)
            console.log(data, 'response of data');
        } catch (error) {
            console.log(error);
        }
    },
    getProjectImage: async (req, res) => {
        try {
          const id = req.params.id
          const img = await Project.find({builderId:id})
          res.json(img[0].image)
        } catch (error) {
          console.log(error);
        }
      },
    logout: async (req, res) => {
        try {
            console.log('res');
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message}) 
        }
    }, 





    // getUserInfor: async (req, res) => {
    //     try {
    //         const user = await Users.findById(req.user.id).select('-password')

    //         res.json(user)
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message}) 
    //     }
    // },
    // getUsersAllInfor: async (req, res) => {
    //     try {
    //         const users = await Users.find().select('-password')

    //         res.json(users)
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message}) 
    //     }
    // },
    
    // //USE PROMISE
    // updateUser: async (req, res) => {
    //     try {
    //         const {name, avatar} = req.body
    //         await Users.findOneAndUpdate({_id: req.user.id}, {
    //             name, avatar
    //         })

    //         res.json({msg: "Update Success!"})
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message}) 
    //     }
    // },
    // updateUsersRole: async (req, res) => {
    //     try {
    //         const {role} = req.body
    //         await Users.findOneAndUpdate({_id: req.params.id}, {
    //             role
    //         })

    //         res.json({msg: "Update Success!"})
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message}) 
    //     }
    // },
    // deleteUser: async (req, res) => {
    //     try {
    //         await Users.findByIdAndDelete(req.params.id)

    //         res.json({msg: "Deleted Success!"})
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message}) 
    //     }
    // }
 
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


   

module.exports = userCtrl

 