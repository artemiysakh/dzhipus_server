const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
const {Order} = require("../models/models")

class orderController{
    async create(req,res){
      try {
        let {name, phone, email, type, description} = req.body
        if (!name || !phone || !email || !description) {
            return res.status(400).json({error: 'Не заполнены обязательные поля'});
        }
        if (!validator.isEmail(email)){
            return res.status(400).json({error: 'Некорректный email'});
        }
        email = await validator.normalizeEmail(email);

        if (description.length > 5000) {
             return res.status(400).json({error: 'Слишком длинное описание'});
        }
         const cleanData = {
            name: sanitizeHtml(name.trim()),
            phone: phone.trim(),
            email: email,
            type: type,
            description: sanitizeHtml(description.trim(), {allowedTags: []})
        };
        const order = await Order.create(cleanData)
        return res.json(order)
    }catch(e){
        return res.status(500).json({error: 'Ошибка при создании заказа'});
    }
    }
    async getOrders(req, res){
        const orders = await Order.find()
        if(!orders.length){
            return res.status(200).json({
                success: true,
                message: 'Нет заказов...',
                data: [],
                count: 0
        });}
        return res.json(orders)
    }
    async getUserOrders(req, res, next){
        try{
          const userEmail = req.user.email
          const orders = await Order.find({email: userEmail}).sort({ createdAt: -1 }).exec();
          if(!orders.length){
            return res.status(200).json({
                success: true,
                message: 'Вы пока не оформляли заказов',
                data: [],
                count: 0
            });
        }
          res.json(orders);
        }catch(e){
            next(ApiError.internal('Ошибка при получении заказов'));
        }
    }
    async updateOrder(req, res){
       try {
        const id = req.params.id;                   
        const updateData = req.body;                
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.json(updatedOrder);
        }catch (error){
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
     async deleteOrder(req, res){
       try {
        const id = req.params.id;             
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.json(deletedOrder);
        }catch (error){
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}
module.exports = new orderController()