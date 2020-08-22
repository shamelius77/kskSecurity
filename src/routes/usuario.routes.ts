import  { Router } from 'express' ; 
import usuarioController from '../controller/usuario.controller';


class UsuariosClass{

    public router:Router;

    constructor(){
        this.router =  Router();
        this.routes();
    }
    
    routes(){
        
        this.router.get('/',  usuarioController.getUsuarios) ;
        this.router.post('/',  usuarioController.grabaUsuario) ;
        this.router.put('/:id',  usuarioController.actualizaUsuario) ;
        this.router.delete('/:id',  usuarioController.eliminaUsuario) ;

       
    }

};


const usuarioClass =  new UsuariosClass();

export default usuarioClass;


