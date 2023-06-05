const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const mailsender = require('./config/email-config')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    try {
        const res = await mailsender.sendMail({
            from: ServerConfig.GMAIL_EMAIL,
            to: 'ashismunmun11@gmail.com',
            subject: 'Is this service working',
            text: 'Yes its working'
        });
        console.log(res);
    } catch (error) {
        console.log(error);
    }


});
