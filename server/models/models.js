const {Schema, model, mongoose} = require('mongoose');

const user = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        enum: ['USER', 'ADMIN'], 
        default: "USER" 
    },
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

const type = new Schema({ //Типы услуг
    name:{
        type: String, 
        unique: true,
        null: false
    },
    img:{
        type:String,
        null:false
    }
})
const service = new Schema({  //Услуги
    name:{
        type: String,
        unique: true,
        null: false
    },
    price:{
        type: Number,
        null: false
    },
    typeName:{
        type:String,
        null:false
    }
})
const order = new Schema({ //Запись на ТО
    name:{
        type: String,
        null: false,
        required: true,
        trim: true,
    },
    phone:{
        type: String,
        null: false,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        null: false,
        trim: true,
    },
    type:{
        type:String,
    },
    description:{
        type: String,
        maxlength: 500,
        trim: true,
        required: true
    },
    time:{
        type: Date,
        default: Date.now
    },
    master:{
        type: String,
        maxlength: 50,
        trim: true,
        default: 'Выберите мастера'
    },
    price:{
        type: Number,
        default: 0,
        min: 0
    },
    status:{
        type: String,
        default: "Заявка создана"
    }
})
const review = new Schema({  //Отзывы
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const feedback = new Schema({  //Обратная связь
    name: {
        type: String,
        required: true,
    },
   phone:{
        type: String,
        null: false,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        null: false,
        trim: true,
    },
    comment: {
        type: String,
        required: false,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const User = model('User', user);
const Type = mongoose.model('Type', type)
const Service = mongoose.model('Service', service)
const Order = mongoose.model('Order', order)
const Review = mongoose.model('Review', review)
const Feedback = mongoose.model('Feedback', feedback)

module.exports = {
    User, Type, Service, Order, Review, Feedback
}