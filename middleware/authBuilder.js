const jwt = require('jsonwebtoken')
const builderSchema = require('../models/builderModels')
const authBuilder = async(req, res, next) => {
    try {
        const token = req.header("Authorization")
        console.log('auth', token);
        console.log('auth', req.header("Authorization"));
        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        const {id}=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(id){
            const checkBuilder=await builderSchema.findById({_id:id})
            if(checkBuilder.adminCheck){
                req.builder=id
                next()
            }else{
                return res.status(401).json({msg:"builder not approved"})
            }
        }
      
          
       
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}  

module.exports = authBuilder