let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
let cors = require('cors');
const creds = require('./config');

let transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 465,
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
}
let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/send', (req, res, next) => {
    let name = req.body.name
    let email = req.body.email
    let message = req.body.message
    let content = `name: ${name} \n email: ${email} \n message: ${message} `

    let mail = {
        from: name,
        to: 'adler.vitalii@icloud.com',  // Change to email address that you want to receive messages on
        subject: 'New Message from Contact Form',
        text: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })

            transporter.sendMail({
                from: "adler.vitalii@icloud.com",
                to: email,
                subject: "Submission was successful",
                text: `Thank you for contacting me!\nI will back you soon!\nKind regards
Vitalii Adler\n\nForm details\nName: ${name}\n Email: ${email}\n Message: ${message}`
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3002)