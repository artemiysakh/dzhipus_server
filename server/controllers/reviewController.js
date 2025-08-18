const sanitizeHtml = require('sanitize-html');
const ApiError = require('../error/ApiError')
const {Review} = require('../models/models')

class reviewController{
    async create(req, res){
        try{
            let {userName, rating, comment} = req.body
            if(!userName || !rating || !comment){
                return res.status(400).json({error: 'Не заполнены обязательные поля'});
            }
            if(comment.length > 5000){
                return res.status(400).json({error: 'Слишком длинный отзыв'});
            }
            const cleanData = {
                userName: sanitizeHtml(userName.trim()),
                rating: rating,          
                comment: sanitizeHtml(comment.trim(), {allowedTags: []})
            };
            const data = await Review.create(cleanData)
            return res.json(data)
        }catch(e){
            next(ApiError.BadRequest(e.message))
        }
    }
    async get(req, res){
         try{
            const reviews = await Review.find().sort({createdAt: -1}).limit(5)
            return res.json(reviews)
        }catch(err){
            console.error(err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
    async getAll(req, res){
         try{
            const reviews = await Review.find().sort({createdAt: -1});
            return res.json(reviews)
        }catch(err){
            console.error(err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
     async deleteReview(req, res){
       try {
        const id = req.params.id;             
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        return res.json(deletedReview);
        }catch (error){
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}
module.exports = new reviewController()