import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import emailRoutes from './routes/email';
import responseTime from 'response-time';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import customstrategy from 'passport-local';
import soc from './socket/handle-socket'
import serverController from './controllers/server-controller';

const NAMESPACE = 'Server';
const router = express();

router.use(serverController.sessionMiddleware);
router.use(cookieParser('9ad4f7b1-d4bd-4f8c-8536-ec7b1b52b762'));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new customstrategy.Strategy((username: string, password: string, done) => {
    return done(null, { username: username, password: password });
}))

passport.serializeUser((user: Express.User, done) => done(null, user));

passport.deserializeUser((user: Express.User, done) => done(null, user));

router.use(responseTime());
/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const httpServer: http.Server = http.createServer(router);
soc.initSocket(httpServer);
const isAuthenticate = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
        console.log('not authenticated')
        return res.redirect('/login');
    } else {
        next();
    }
}

router.post('/api/login', passport.authenticate('local'), (req: any, res: any) => {
    res.status(200).json({
        username: req.user?.username
    })
})

router.get('/api/userInfo', isAuthenticate, (req: any, res: any) => {
    res.status(200).json({
        username: req.user?.username
    })
})
router.use('/', express.static('D://login angular node//eeeeee//client/dist'));
router.use('*', express.static('D://login angular node//eeeeee//client/dist'));


/** Routes go here */
router.use('/api', isAuthenticate, emailRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));

export = router;
