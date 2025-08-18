const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
const ApiError = require('../error/ApiError')
const {Feedback} = require('../models/models')

class feedbackController{
    async create(req, res){
        try{
            let {name, phone, email, comment} = req.body
            if(!name || !phone || !email || !comment){
                return res.status(400).json({error: 'Не заполнены обязательные поля'});
            }
            if(!validator.isEmail(email)){
                return res.status(400).json({error: 'Некорректный email'});
            }
            email = await validator.normalizeEmail(email);
            if(comment.length > 5000){
             return res.status(400).json({error: 'Слишком длинное описание'});
            }
            const cleanData = {
                name: sanitizeHtml(name.trim()),
                phone: phone.trim(),
                email: email,
                comment: sanitizeHtml(comment.trim(), {allowedTags: []})
            };
            const data = await Feedback.create({name, phone, email, comment})
            return res.json(data)
        }catch(e){
            next(ApiError.BadRequest(e.message))
        }
    }
    async getFeedbacks(req, res){
        const feedbacks = await Feedback.find()
        return res.json(feedbacks)
    }
    async deleteFeedback(req, res){
        try {
            const id = req.params.id;
            const deletedFeedback = await Feedback.findByIdAndDelete(id);
   
           if (!deletedFeedback) {
               return res.status(404).json({ message: 'Feedback not found' });
           }
           return res.json(deletedFeedback);
           }catch (error){
               return res.status(500).json({ message: 'Server error', error: error.message });
           }
       }
}
module.exports = new feedbackController()