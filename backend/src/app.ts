import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { router } from './routes/routes';

const app = express();

const serverHttp = http.createServer(app);
// iniciamos o socket e permitimos todas as origens de acesso
const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  }
});

// Observamos o evento de conexão do socket
io.on('connection', (socket) => {
  console.log(`👤 A user connected ${socket.id} `);
});


app.use(cors());
app.use(express.json());
app.use(router);


export { serverHttp, io };
