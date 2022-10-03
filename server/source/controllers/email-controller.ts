import logging from '../config/logging';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
const NAMESPACE = 'Email Controller';
const workerPath = join(__dirname, '../worker/worker.js');
import { Worker } from 'worker_threads';
import soc from '../socket/handle-socket';
const emailFunction = async (req: any, res: Response, next: NextFunction) => {
  try {
    soc.sendMessage(req.user.username, {
      progress: 0,
      requestId: req.body.requestId
    })
    const worker = new Worker(workerPath, {
      workerData: {
        path: './email-worker.ts',
        data: { obj: req.body, socketId: req.session.socketId, username: req.session.passport.user.username }
      }
    });
    worker.on('message', (result) => {
      console.log('on message result  :: ', result);
      soc.sendMessage(req.user.username, result)

    });
    worker.on('error', (error) => {
      console.log('on error :: ', error);
    });
    worker.on('exit', (exit) => {
      console.log('on exit :: ', exit);
    });
    return res.status(200).send({ msg: 'Email Processing' })
  } catch (error) {
    logging.error(NAMESPACE, `error emailFunction ::`);
    console.log('error :: ', error)
    return res.status(error && getErrorStatus(error) ? getErrorStatus(error) : 500).send(error);
  }
};
const sendEmails = async (opts: any, transporter: any) => {
  return Promise.all(opts.map((r: any) => transporter.sendMail(r)))
}
const getErrorStatus = (error: any) => {
  try {
    return JSON.parse(JSON.stringify(error)).status;
  } catch (exp) {
    return null;
  }
};
const emailcontroller = {
  emailFunction: emailFunction
};

export = emailcontroller;
