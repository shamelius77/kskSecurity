import  { Router } from 'express' ; 
import { check } from 'express-validator'

import loginController from '../controller/login.controller';
import  validarCampos    from '../middlewares/validar-campos';


class LoginClass{

    public router:Router;

    constructor(){
        this.router =  Router();
        this.routes();
    }
    
    routes(){
         
        this.router.post('/', 
        [
            check('email','el email es obligatorio').isEmail(),
            check('password','el password es obligatorio').not().isEmpty(),
            validarCampos,
        ],
         loginController.login) ;
        
    }

};


const loginClass =  new LoginClass();

export default loginClass;


