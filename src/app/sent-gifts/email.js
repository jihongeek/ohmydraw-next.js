import nodemailer from 'nodemailer'

// 매개변수에 대해 더 생각해봐야 할 듯
async function requestToSendEmail(senderData,message) {
    let transporter = nodemailer.createTransport(senderData);
    await transporter.verify();
    return transporter.sendMail(message);
}

export {requestToSendEmail};