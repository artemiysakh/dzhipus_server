const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')
const {Type} = require('../models/models')

class typeController{
    async getAll(req, res){
        const data = await Type.find()
        return res.json(data)
    }
    async create(req, res, next){
        try{
            let {name} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const type = await Type.create({name, img:fileName})
        
            return res.json(type)
        }catch(e){
            next(ApiError.BadRequest(e.message))
        }
    }
}
module.exports = new typeController()