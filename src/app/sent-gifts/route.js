import {requestToSendEmail} from './email.js'

export const POST = async (request)=>{
  const { EMAIL_PASSWORD, EMAIL_USERNAME,EMAIL_HOST } = process.env; 
  const senderData = {
    host : EMAIL_HOST,
    port : 465,
    secure : true,
    auth : {
      user : EMAIL_USERNAME,
      pass : EMAIL_PASSWORD 
    }
  }
  const req = await request.json();
  const message = {
    from: EMAIL_USERNAME,
    to: req['winnerEmail'],
    subject: `축하합니다! ${req['winnerName']}님 당첨되셨습니다!`,
    attachments : [{filename: req['giftName'], path : req['giftFile']}]
  }
  try {
    await requestToSendEmail(senderData,message);
    return new Response(req,{status:201}); 
  } catch (error) {
    console.log(error);
    return new Response(req,{status:400}); 
  }
}