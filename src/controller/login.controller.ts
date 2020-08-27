import {Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

import MsSql from '../sql/mssql';
import generarJwt from '../helpers/jwt';


const login = async (req:Request, res:Response)=>{

    const {email, password} = req.body;
    let result:sql.IProcedureResult<any>;

    try {
        let pool = await MsSql.instance.cnn.connect();

        //validar que el email exista
         result = await pool.request()
                .input("usrEmail",  sql.VarChar,    req.body.email)
                .execute('spUsuarios_byEmail')

        if(result.recordset.length <= 0 ){
            return res.status(404).json({
                    ok:     false,
                    msg:    'El email no existe',   
                }) 
        }

        // validar password
        const validPassword = bcrypt.compareSync(password, result.recordset[0].usrPassword)

        if(!validPassword){
            return res.status(400).json({
                ok:     false,
                msg:    'El password es no valido',   
            }) 
        }

        // Generar JWT
        const token = await generarJwt(result.recordset[0].usrId)


        res.status(200).json({
            ok: true,
            token
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo error inesperado... revisar el log'
        }) ; 
        
    }
    
}

export default { 
        login
    };