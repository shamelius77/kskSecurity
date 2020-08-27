
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const  generarJwt = (uid:string) =>{

    return new Promise( (resolve, reject)=> {

        const paylaod:Object = { uid, };
           
            jwt.sign(paylaod , <string>process.env.JWT_SECRET, {
                expiresIn: '12h'
            }, (err, token)=>{
    
                if (err){
                    console.log(err);
                    reject('No se pudo generar el JWT')
                }else{
                    resolve(token)
                }
            });


    })

}

export default  generarJwt ;