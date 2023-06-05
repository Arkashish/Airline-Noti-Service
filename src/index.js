const express = require('express');
const amqplib = require('amqplib');
const { EmailService } = require('./services')
async function connectQueue() {
    try {
        // const conn = await amqlib.connect("amqp://localhost");
        // const channel = await conn.createChannel();
        // await channel.assertQueue('noti-queue');
        // channel.consume('noti-queue', async (data) => {
        //     // console.log(`${Buffer.from(data.content)}`);
        //     const object = JSON.parse(Buffer.from(data).toString());
        //     await EmailService.sendEmail("arkashish.sutradhar.cse23@heritageit.edu.in", object.recepientEmail, object.subject, object.text);
        //     channel.ack(data);
        // })
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");
        channel.consume("noti-queue", async (data) => {
            console.log(`${Buffer.from(data.content)}`);
            const object = JSON.parse(`${Buffer.from(data.content)}`);
            // const object = JSON.parse(Buffer.from(data).toString());
            await EmailService.sendEmail("arkashish.sutradhar.cse23@heritageit.edu.in", object.recepientEmail, object.subject, object.text);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const mailsender = require('./config/email-config')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    await connectQueue();
    console.log('queue is up');
});
