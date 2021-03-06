
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import expressfileUpload  from 'express-fileupload';
import path from 'path';

import MsSql from '../sql/mssql'; 


// rutas --------------------------------------------------------------
import usuarioRouter    from '../routes/usuario.routes' ;
import loginRouter      from '../routes/login.routes' ;
import uploadRouter      from '../routes/upload.routes' ;


export default class Server{

    public app:express.Application;
    public port: number | string;

    constructor(puerto: number ){
        this.app = express();
        this.port = puerto;
        this.config();
        this.routes();
    }

   config(){

       const publicPath = path.resolve(__dirname, '../public');

        // inicializa Base de datos 
       
        // inicializa Base de datos SQL Server
        //const MiSql = new MsSql();   
        //MsSql.instance;
  
        // settings para identificar el puerto del Server
        this.app.set('port', process.env.PORT || this.port  );

        // Middlewares
        this.app.use(express.static(publicPath));

        this.app.use(morgan('dev'));
        this.app.use(cors( {origin:true, credentials:true}));

        this.app.use(expressfileUpload());

   }

   // metodo que invoca las rutas a utilizar
   routes(){

         // create application/x-www-form-urlencoded parser
         this.app.use(bodyParser.urlencoded({ extended: true }));
         // create application/json parser
         this.app.use(bodyParser.json());

         // rutas de usuarios y login
         this.app.use('/v1/usuarios', usuarioRouter.router);
         this.app.use('/v1/login', loginRouter.router);
         
         // ruta de files upload
         this.app.use('/v1/upload', uploadRouter.router);

         
    };

    // metodo que inicia el puerto 
    start(){

        this.app.listen( this.app.get('port'), ()=>{
            console.log('Server on port :', this.app.get('port'));    
            }) ;

    }

}

