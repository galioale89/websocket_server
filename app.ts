import express, { application } from 'express';
import { createServer, Server } from 'http';
import socketIO, { Socket } from 'socket.io';
import cors from 'cors';


type User = {
    userName: string;
    socketID: string;
};

type Message = {
    text: string;
    id: string;
    socketID: string;
};
class App {
    public app: application;
    public server: Server;
    private io: socketIO.Server;
    public PORT: number = 3200;

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
    }

    routes() {
        this.app = express();
        this.app.route('/').get((req, res) => {
            res.status(200).send("Websocket is running!");
        });
    }

    private sockets(): void {
        this.server = createServer(this.app);
        this.io = new socketIO.Server(this.server, {
            cors: {
                origin: "http://localhost:3001"
            }
        });
        this.app.use(cors());
    }


    private listen(): void {
        let users: User[] = [];

        this.io.on("connection", (socket: Socket) => {
            console.log(`⚡:${socket.id} A user connected!`);
            socket.on("message", (msg: Message) => {
                this.io.emit("responseMessage", msg)
            });

            // socket.on("typing", msg => {
            //     socket.broadcast.emit("typingResponse", msg);
            // });

            socket.on("newUser", (data: User) => {
                console.log("New user connected!")
                console.log( data.userName.toString());
                const exists:User[] = users.filter(e => e.userName.toString() != data.userName.toString());
                console.log(`Exists: ${exists.length}`);
                if (exists.length === 0) users.push(data);
                this.io.emit("newUser", users);
            });

            socket.on("disconnect", () => {
                console.log("🔥: A user disconnected");
                users = users.filter((user: any) => user.socketID != socket.id);
                this.io.emit("newUserResponse", users)
                socket.disconnect();
            });
        });
    }
}

export default new App();