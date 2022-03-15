const nodemailer = require("nodemailer");

class Email {
  async sendEmail() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      auth: testAccount,
    });

    const info = await transport.sendMail(this);

    console.log("URL: ", nodemailer.getTestMessageUrl(info));
  }
}

class EmailCheck extends Email {
  constructor(user, address) {
    super();
    this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>';
    this.to = user.email;
    this.subject = "E-mail check";
    this.text = `Hello! check your email here: ${address}`;
    this.html = `<h1>Hello</h1> check your email here: <a href="${address}">${address}</a>`;
  }
}

module.exports = { EmailCheck };
