import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  // private clientSocket: SocketIOClient.Socket;
  private clientSocket;

  constructor() {
    this.clientSocket = socketIo.connect("http://localhost:1337");
  }

  listenToServer(connection: any): Observable<any> {
    return new Observable((subscribe) => {
      this.clientSocket.on(connection, (data: any) => {
        subscribe.next(data);
      })
    })
  }
  emitToserver(connection: any, data: any): void {
    this.clientSocket.emit(connection);
  }
}
