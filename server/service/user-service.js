const {User} = require('../models/models')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('./mail-service')
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../error/ApiError');
const Token = require('../models/token')

class UserService{
    async registration(email, password, role){
        const candidate = await User.findOne({email})
        if(candidate){
            throw ApiError.BadRequest("Пользователь с указанным email уже существует") 
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        
        const user = await User.create({email, password: hashPassword, role, activationLink})
        await mailService.sendActivationMail(email,`${process.env.API_URL}/api/user/activate/${activationLink}`)
        
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return{
            ...tokens,
            user: userDto
        }
    }
    async activate(activationLink){
        const user = await User.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        user.isActivated= true;
        await user.save()
    }
    async login(email,password){
        const user = await User.findOne({email})
        if(!user){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
       
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return{...tokens, user: userDto}
    }
    async logout(refreshToken){
        const token = await TokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return{...tokens,user: userDto}
    }
    
    async getAllUsers(){
        const users = await User.find()
        return users
    }
    async makeAdmin(userId){
        const user = await User.findById(userId);
        if (!user){
            throw new Error('User not found');
        }
        user.role = 'ADMIN';
        await user.save();
        return user;
    }

    async forgotPassword(email) {
    const user = await User.findOne({email});
    if (!user) {
        return {message: 'Если пользователь с таким email существует, письмо с инструкциями будет отправлено'};
    }
    const resetToken = uuid.v4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 час
    
    await user.save();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await mailService.sendPasswordResetMail(email, resetUrl);

    return {message: 'Письмо с инструкциями отправлено на ваш email'};
}

async resetPassword(resetToken, newPassword) {
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if (!user) {
        throw ApiError.BadRequest('Неверный или просроченный токен сброса пароля');
    }

    const hashPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    // Инвалидируем все refresh токены пользователя
    await Token.deleteMany({user: user.id});

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
        ...tokens,
        user: userDto,
        message: 'Пароль успешно изменен'
    };
}
async resendActivationEmail(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        
        if (user.isActivated) {
            throw ApiError.BadRequest('Аккаунт уже активирован');
        }

        if (!user.activationLink) {
            user.activationLink = uuid.v4();
            await user.save();
        }

        const activationLink = `${process.env.API_URL}/api/user/activate/${user.activationLink}`;
        await mailService.sendActivationMail(user.email, activationLink);
        
        return { 
            success: true,
            email: user.email // Добавляем email в ответ
        };
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        throw error;
    }
}
}
module.exports = new UserService()