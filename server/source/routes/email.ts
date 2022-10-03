import express from 'express';
import emailcontroller from '../controllers/email-controller';

const router = express.Router();

router.post('/sendEmail', emailcontroller.emailFunction);

export = router;
