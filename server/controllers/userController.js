const UserService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')

class userController{
     async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password, role} = req.body;
            const userData = await UserService.registration(email, password, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error)
        }
    }
     async login(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }catch (error){
            next(error)
        }
    }
    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
         
            res.clearCookie('refreshToken')
            return res.json(token)
        }
        catch(e){
            next(e)
        }
    }
    async activate(req, res, next){
        try{
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        }catch(e){
            next(e)
        }
    }
     async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
            
        } catch (error) {
            next(error)
        }
    }
    async getUsers(req, res, next){
        try{
            const users = await UserService.getAllUsers()
            return res.json(users)
        }catch(e){
            next(e)
        }
    }
    async makeAdmin(req, res, next){
      try{
        const {userId} = req.body;
        const user = await UserService.makeAdmin(userId);
        res.json({ message: `User ${user.email} promoted to ADMIN`, user });
      }catch(error){
         next(error);
      }
    }
    async forgotPassword(req, res, next){
        try{
            const {email} = req.body;
            const result = await UserService.forgotPassword(email);
            return res.json(result);
        }catch(e){
            next(e);
        }
    }
    async resetPassword(req, res, next){
        try{
            const {resetToken, newPassword} = req.body;
            const result = await UserService.resetPassword(resetToken, newPassword);
            return res.json(result);
        }catch(e){
            next(e);
        }
    }
  async resendActivation(req, res, next) {
    try {
        const { userId } = req.body;
        const result = await UserService.resendActivationEmail(userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
}

module.exports = new userController()
