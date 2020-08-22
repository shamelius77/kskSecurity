
import Server  from './server/server';
import dotenv  from 'dotenv';

dotenv.config();

const puerto:number  = Number(process.env.PORT) ;
const server = new Server(puerto);
server.start();
