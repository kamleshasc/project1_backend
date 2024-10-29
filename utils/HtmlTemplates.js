const welcomeTemplate = (userName) => {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      max-width: 600px;
      margin: 0 auto;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #C41D6F;
    }
    p {
      color: #333;
      line-height: 1.6;
    }
    a {
      color: #FF6347;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, ${userName}!</h1>
    <p>Thank you for joining Spa application! We are dedicated to offering you the best in wellness and relaxation services. Take a break from your busy life and let us help you find balance and tranquility.</p>
    <p>Best regards,</p>
    <p>The Spa Team</p>
  </div>
</body>
</html>`;
};

const forgotOTPTemplate = (otpValue) => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            color: #C41D6F;
          }
          .otp-code {
            color: #C41D6F;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="header">Forgot Password OTP</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the following OTP to complete the process:</p>
          <p class="otp-code">${otpValue}</p>
          <p>This OTP is valid for 2 minutes. If you didn't request this, please ignore this email.</p>
          <p>Thank you!</p>
          <div class="footer">
            <p>Best regards,<br>The Spa Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

const signUpOTPTemplate = (otpValue) => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            color: #C41D6F;
          }
          .otp-code {
            color: #C41D6F;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .content {
            color: #333;
            font-size: 16px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="header">Welcome to Spa App</h2>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up with Spa App! To complete your registration, please use the following One-Time Password (OTP):</p>
            <p class="otp-code">${otpValue}</p>
            <p>This OTP is valid for 2 minutes. If you didn’t sign up for this account, you can safely ignore this email.</p>
            <p>We look forward to having you with us.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Spa Team</p>
          </div>
        </div>
      </body>
      </html>`;
};

module.exports = {
  welcomeTemplate,
  forgotOTPTemplate,
  signUpOTPTemplate,
};
