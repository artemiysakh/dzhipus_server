const nodemailer = require('nodemailer')
class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, 
            secure: false,
             auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to, link){
        try {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта",
            text: "",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Добро пожаловать на сайт СТО "Джипус"!</h1>
                <p>Для завершения регистрации и активации вашего аккаунта, пожалуйста, перейдите по ссылке ниже:</p>
                  <a href="${link}" tyle="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">${link}</a>
                    <p>Если вы не регистрировались на нашем сервисе, просто проигнорируйте это письмо.</p>
                     <p>С уважением,<br>Команда СТО "Джипус"</p>
            </div>
            `
        })
        console.log('Email sent');
    }catch(e){
         console.error('Email sending error:', error);
    }
    }
    async sendPasswordResetMail(to, link){
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Восстановление пароля",
        text: "",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Восстановление пароля</h1>
            <p>Мы получили запрос на восстановление пароля для вашего аккаунта на сайте СТО "Джипус".</p>
            <p>Для установки нового пароля перейдите по ссылке ниже:</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
                ${link}</a>
            <p>Ссылка будет действительна в течение 1 часа.</p>
           <p>Если вы не запрашивали восстановление пароля, пожалуйста, проигнорируйте это письмо или свяжитесь с нашей поддержкой: <a href="mailto:4242750419@mail.ru">4242750419@mail.ru</a></p>
        <p>С уважением,<br>Команда СТО "Джипус"</p>
        </div>
        `
      });
  }
}
module.exports = new MailService()