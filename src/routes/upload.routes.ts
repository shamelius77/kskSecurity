import  { Router } from 'express' ; 
import uploadController from '../controller/upload.controller';
import validarJwt from '../middlewares/validar-jwt';


class UploadClass{

    public router:Router;

    constructor(){
        this.router =  Router();
        this.routes();
    }
    
    routes(){
         
        this.router.put('/:tipo/:id', validarJwt, uploadController.upload) ;
        this.router.get('/:tipo/:foto', validarJwt, uploadController.retornaImagen) ;
        
    }

};


const uploadClass =  new UploadClass();

export default uploadClass;


