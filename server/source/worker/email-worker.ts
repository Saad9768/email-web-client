import { parentPort, workerData } from 'worker_threads';
import nodemailer from "nodemailer";

const processBatchWise = async (obj: any, username: string, socketId: string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'skhatimiti@gmail.com',
            pass: 'dytumppzyzzzlkjs'
        }
    });
    let bulks = [];
    const bulkSize = 2;
    const finalLength = Math.ceil(obj.toEmail.length / bulkSize)
    for (let i = 0; i < finalLength; i++) {
        bulks.push(obj.toEmail.slice(i * bulkSize, (i + 1) * bulkSize));
    }
    for (let i = 0; i < bulks.length; i++) {
        try {
            // const results = await sendEmails(bulks[i].map((r: any) => {
            //     return {
            //         from: username,
            //         to: r,
            //         subject: obj.subject,
            //         text: obj.description,
            //         cc: obj.ccEmail,
            //         bcc: obj.bccEmail
            //     }
            // }), transporter);
            // console.log('results :: ', results)
            await delay(12000)
            parentPort?.postMessage({
                progress: (i + 1) / finalLength * 100,
                requestId: obj.requestId
            });
        } catch (exception) {
            console.log('exception :: ', exception);
        }
    }
}
const sendEmails = async (opts: any, transporter: any) => {
    return Promise.all(opts.map((r: any) => transporter.sendMail(r)))
}
const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))

processBatchWise(workerData.data.obj, workerData.data.username, workerData.data.socketId)
