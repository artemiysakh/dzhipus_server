const {Schema, model} = require('mongoose');


const token = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    refreshToken: {
        type:String, 
        required: true
    }
})
const Token = model('Token', token);
module.exports = Token;

