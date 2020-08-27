
import { NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';


const validarJwt = (req:Request, res:Response, next:NextFunction)=>{

    // leer el token
    const token:any = req.header('x-token');

   if(!token){
      return res.status(401).json({
           ok: false,
           msg: 'No hay token en la peticion...'
       })
   }

   // validar si el token es el correcto
   try {
       
        const { uid }:any  = jwt.verify( token, <string>process.env.JWT_SECRET) ;
        req.body.uid = uid;

        next();


   } catch (error) {
       return res.status(401).json({
           ok: false,
           msg: 'Token no valido'
       })
       
   }

}

export default validarJwt;