import  { Router } from 'express' ; 
import {check} from 'express-validator';

import usuarioController from '../controller/usuario.controller';
import  validarCampos    from '../middlewares/validar-campos';
import validarJwt from '../middlewares/validar-jwt';


class UsuariosClass{

    public router:Router;

    constructor(){
        this.router =  Router();
        this.routes();
    }
    
    routes(){
        
        this.router.get('/', validarJwt,     usuarioController.getUsuarios) ;

        this.router.get('/:id',    usuarioController.getUsuarioById) ;

        this.router.post('/', 
            [
                check('nombre','el nombre es obligatorio').not().isEmpty(),
                check('password','el password es obligatorio').not().isEmpty(),
                check('email','el email es obligatorio').isEmail(),
                validarCampos,
            ],
             
             usuarioController.grabaUsuario ) ;

        this.router.put('/:id',   
        [
            validarJwt,
            check('nombre','el nombre es obligatorio').not().isEmpty(),
            check('email','el email es obligatorio').isEmail(),
            check('password','el password es obligatorio').not().isEmpty(),
            check('roleId','el role es obligatorio').not().isEmpty(),
            validarCampos,
        ], 
        
        usuarioController.actualizaUsuario) ;


        this.router.delete('/:id', validarJwt, usuarioController.eliminaUsuario) ;
    }

};


const usuarioClass =  new UsuariosClass();

export default usuarioClass;


