const nodemailer = require("nodemailer");

const emailConfigurationTest = (testAccount) => ({
  host: "smtp.ethereal.email",
  auth: testAccount,
});

const configurationProdEmail = {
  host: process.env.HOST_EMAIL,
  auth: {
    user: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  },
  secure: true,
};

async function createEmailConfig() {
  if (process.env.NODE_ENV === "production") {
    return configurationProdEmail;
  } else {
    const testAccount = await nodemailer.createTestAccount();
    return emailConfigurationTest(testAccount);
  }
}

class Email {
  async sendEmail() {
    const configEmail = await createEmailConfig();
    const transport = nodemailer.createTransport(configEmail);

    const info = await transport.sendMail(this);
    if (process.env.NODE_ENV !== "production")
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
