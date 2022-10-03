import socketIO from 'socket.io';
import serverControlller from '../controllers/server-controller';
import sharedsession from 'express-socket.io-session';

let io: any;
const initSocket = (httpServer: any) => {
    io = new socketIO.Server(httpServer);
    // io.use(serverControlller.wrap(serverControlller.sessionMiddleware));
    io.use(sharedsession(serverControlller.sessionMiddleware));
    // socket: socketIO.Socket
    io.on('connection', ((socket: any) => {
        socket.handshake.session.socketId = socket.id;
        socket.handshake.session.save();
        socket.on('disconnect', () => {
            console.log('socket disconnected : ' + socket.id)
        })
    }))
}
const sendMessage = (eventName: string, data: {}): void => {
    io.emit(eventName, data);

}
export = { initSocket: initSocket, sendMessage: sendMessage };