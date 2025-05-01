import nodemailer from "nodemailer";
import { generateEmailContent } from "./partials";
import config from "constants/config";
import { EMAIL, PASSWORD } from "@constants/index";

// export const transporter = nodemailer.createTransport({
//   host: "skynett.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "info@skynett.com",
//     pass: "vM[aC0Js2nD@xs",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

export const sendEmail = async (to: any, subject: any, content: any) => {
  const mailOptions = {
    from: EMAIL,
    to,
    subject,
    html: content,
    headers: {
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
      Importance: "Normal",
    },
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.error(error);
    }
    console.log("Message sent: %s", info.response);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  });
};

export const sendOtpMail = async (props: any) => {
  const content = generateEmailContent(
    {
      title: "Your OTP",
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      otp: props.otp,
    },
    "welcome"
  );
  await sendEmail(props.email, "Otp", content);
};

export const sendResetPasswordEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetMail = async (props: any) => {
  const content = generateEmailContent(
    {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      resetLink: props.resetLink,
    },
    "reset-password"
  );
  await sendEmail(props.user.email, "Password Reset Request", content);
};

export const sendNotificationMail = async (props: any) => {
  try {
    const content = generateEmailContent(
      {
        title: props.title,
        header: props.header,
        name: props.name,
        message1: props.message1 || null,
        message2: props.message2 || null,
        message3: props.message2 || null,
      },
      "notification"
    );
    await sendEmail(props.email, props.subject, content);
  } catch (error) {
    console.log(error);
  }
};
