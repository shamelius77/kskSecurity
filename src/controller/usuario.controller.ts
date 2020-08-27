import {Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

import MsSql from '../sql/mssql';
import generarJwt from '../helpers/jwt';


 const getUsuarios = async (req:Request, res:Response, )=>{
       
        const desde = Number(req.query.desde) || 0;

        try {

            let pool = await MsSql.instance.cnn.connect();
            let result = await pool.request()
                            .execute("spUsuarios_Sel");
            

            if(result.recordset.length <= 0){
                res.status(400).json({
                    ok:     false,
                    msg:    'No existe data',
           })
           }else{   
               res.status(200).json({
                    ok:     true,
                    msg:    'get Usuarios',
                    usuarios:  result.recordset
               })
           }
       
        } catch (error) {

            res.status(500).json({
                ok: false,
                msg: 'Hubo error en getusuarios... revisar el log'
            }) ;    
            
        }
        finally{
            
            MsSql.instance.cnn.close(); 
            console.log('cerrando conexion de Database');

        }
};

const getUsuarioById = async (req:Request, res:Response, )=>{

    const idUser = req.params.id

    try {

        let pool = await MsSql.instance.cnn.connect();
        let result = await pool.request()
                        .input("usrId",     sql.Int,   idUser)
                        .execute('spUsuarios_ById')


        if(result.recordset.length <= 0 ){
            res.status(400).json({
                ok:     false,
                msg:    'No existe usuario',   
       })
       }else{   
           res.status(200).json({
                ok:     true,
                msg:    'get Usuario',
                usuarios:  result.recordset
           })
       }
   
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo error en acceso a usuario... revisar log'
        }) ;    
        
    }
    finally{
        
        MsSql.instance.cnn.close(); 
        console.log('cerrando conexion de Database');

    }
};

const grabaUsuario = async (req:Request, res:Response)=>{

    const {nombre, email, password, avatar, roleId, InActived} = req.body;

   
    try {
        let pool = await MsSql.instance.cnn.connect();
        
        // valida que el email no exista
        let result = await pool.request()
                        .input("usrEmail",  sql.VarChar,    email)
                        .execute('spUsuarios_byEmail')


        if(result.recordset.length > 0 ){
            return res.status(400).json({
                ok:     false,
                msg:    'El email ya esta registrado',   
                })
            }

        // encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        let passEncriptado:string ;
        passEncriptado = bcrypt.hashSync(password, salt);

         result = await pool.request()
            .input("usrNombre",     sql.VarChar,    nombre)
            .input("usrEmail",      sql.VarChar,    email)
            .input("usrPassword",   sql.VarChar,    passEncriptado)
            // .input("usrAvatar",     sql.VarChar,    avatar)
            // .input("roleId",        sql.SmallInt,   roleId)
            // .input("usrInActived",  sql.Bit,        InActived)
            .execute('spUsuarios_Ins')

        // para Generar JWT hay que buscar el ID del usuario nuevo
         result = await pool.request()
                    .input("usrEmail",  sql.VarChar,    email)
                    .execute('spUsuarios_byEmail');

        const token = await generarJwt(result.recordset[0].usrId)


        res.status(200).json({
            ok: true,
            msg: 'Usaurio dado de alta....',
            token
            // usaurio: result2
            
        })     
        
    } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hubo error en grabaUsuario... revisar el log'
            }) ;    
        
    }finally{   
        MsSql.instance.cnn.close(); 
        console.log('cerrando conexion de Database');

    }
    

}

const actualizaUsuario = async (req:Request, res:Response)=>{

    const {nombre, email, password, avatar, roleId, InActived} = req.body;
    const idUser = req.params.id;
    
    try {
        
        let pool = await MsSql.instance.cnn.connect();
    
        // valida que el usuario ID exista
        let result = await pool.request()
                        .input("usrId",     sql.Int,    idUser)
                        .execute('spUsuarios_ById')

        if(result.recordset.length <= 0){
            return res.status(400).json({
                ok: false,
                msg: 'el ID del usuario no existe'           
            })     
          }
          
        // valida que el email no exista
         result = await pool.request()
                .input("usrEmail",  sql.VarChar,    req.body.email)
                .input("usrId",     sql.Int,        idUser)
                .execute('spUsuarios_byEmail')

        if(result.recordset.length > 0 ){
            return res.status(400).json({
                    ok:     false,
                    msg:    'El email ya esta registrado',   
                })
            
        }

         // encriptar contraseña 
         const salt = bcrypt.genSaltSync();
         let passEncriptado:string ;
         passEncriptado = bcrypt.hashSync(password, salt);

        result = await pool.request()
                .input("usrId",         sql.Int,        idUser)
                .input("usrNombre",     sql.VarChar,    nombre)
                .input("usrEmail",      sql.VarChar,    email)
                .input("usrPassword",   sql.VarChar,    passEncriptado)
                .input("usrAvatar",     sql.VarChar,    avatar)
                .input("roleId",        sql.SmallInt,   roleId)
                .input("usrInActived",  sql.Bit,        InActived)
                .execute('spUsuarios_Upd')

        res.status(200).json({
            ok: true,
            msg: 'Actualizacion realizada...'               
        })     
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo error en actualizaUsuario... revisar el log'
        }) ;    
        
    } finally{   
        MsSql.instance.cnn.close(); 
        console.log('cerrando conexion de Database');

    }
}

const eliminaUsuario = async (req:Request, res:Response)=>{

    const idUser = req.params.id;

    try {

        let pool = await MsSql.instance.cnn.connect();

        // valida que exista el usuario
        let result = await pool.request()
                .input("usrId",     sql.Int,    idUser)
                .execute('spUsuarios_ById')

        if(result.recordset.length <= 0){
            return res.status(400).json({
                ok: false,
                msg: 'el ID del usuario no existe'           
                })     
        }

         result = await pool.request()
                        .input("usrId", sql.Int, idUser)
                        .execute("spUsuarios_Del");

        res.status(200).json({
            ok: true,
            msg: 'Usaurio eliminado !!',
            Usaurio: idUser  
        })     
        
    } catch (error) {
  
      res.status(500).json({
          ok: false,
          msg: 'Hubo error en eliminaUsuario... revisar el log'
      }) ;    
        
    }
    finally{  
        MsSql.instance.cnn.close(); 
        console.log('cerrando conexion de Database');
    }

}

export default { 
        getUsuarios, 
        grabaUsuario,
        actualizaUsuario,
        eliminaUsuario,
        getUsuarioById
    };