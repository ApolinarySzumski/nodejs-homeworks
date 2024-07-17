// npm modules
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// SendGrid config
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendEmail = async (
  emailTo,
  emailFrom,
  emailSubject,
  emailText,
  emailHtml,
) => {
  const emailMessage = {
    to: emailTo,
    from: emailFrom,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  };
  try {
    await sgMail
      .send(emailMessage)
      .then((res) => {
        console.log(res[0].statusCode);
        // console.log(res[0].headers);
      })
      .catch((e) => console.log(e));
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
