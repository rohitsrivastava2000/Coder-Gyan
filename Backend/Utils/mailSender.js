// const nodemailer=require('nodemailer')
import nodemailer from 'nodemailer'
import 'dotenv/config';

const mailSender=async ({email,title,body})=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port: 587, // Use 587 for TLS
            secure: false,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
       
      //  console.log("part1")
        let info =await transporter.sendMail({
            from:'Email Send By Coder-s Gyan',
            to:`${email}`,
            subject:`${title}`,
            html:` Your OTP ${body} `,
        });
       // console.log("part2");
        return info;
    } catch (error) {
        console.log("Can't send mail, error occured in mailsender",error);
    }
}

export default mailSender;