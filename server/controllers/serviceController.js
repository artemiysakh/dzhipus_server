const {Service} = require('../models/models')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')
const xlsx = require('xlsx')
const uuid = require('uuid')
const path = require('path')

class serviceController{
    
    async getAll(req,res){
        let {typeName} = req.params
        let {page, limit} = req.query
        page = page 
        limit = limit 
        let offset = page*limit - limit
    
        let services = await Service.find({typeName:typeName}).skip(offset).limit(limit)
        let count = await Service.countDocuments({typeName:typeName})

        return res.json( {services, count} )
    }   
    
    async create(req, res, next){
        try{
            let {name, price, typeName} = req.body
            const service = await Service.create({name, price, typeName})

            return res.json(service)
        }catch(e){
            next(ApiError.BadRequest(e.message))
        }
    }
    async loadExcelData(req, res, next){
        try{
            if (!req.files || !req.files.table) {
                return res.status(400).json({ message: 'Файл не был загружен.' });
            }
            const {table} = req.files
            const allowedExtensions = ['.xlsx', '.xls'];
            const fileExtension = path.extname(table.name).toLowerCase();
        
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: 'Загруженный файл не является Excel-файлом (.xlsx или .xls).' });
            }

            await Service.deleteMany({})

            let fileName = uuid.v4() + ".xlsx"
            const filePath = path.resolve(__dirname, '..', 'static', fileName);
            await table.mv(filePath);
            // Чтение файла Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Берем первый лист
            const worksheet = workbook.Sheets[sheetName];
        
            // Преобразование данных в JSON
            const data = xlsx.utils.sheet_to_json(worksheet);
            const inserted = await Service.insertMany(data)
            return res.json({
                success: true,
                services: inserted,
                count: inserted.length
            });
            }catch(e){
              return res.status(400).json({
                success: false,
                message: e.message,
                details: e.stack 
             });
         }
    } 
}
module.exports = new serviceController()