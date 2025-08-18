module.exports = class UserDto{
    id;
    email;
    role;
    userName;
    isActivated;

    constructor(model){
        this.id = model._id;
        this.email = model.email;
        this.role = model.role;
        this.userName = model.userName;
        this.isActivated = model.isActivated;
    }
}