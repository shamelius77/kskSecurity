import {Response, Request } from 'express';

// importar el modelo de usuarios
// import Usuario from '../database/models/usuario.model'


 const getUsuarios = async (req:Request, res:Response, )=>{

  const desde = Number(req.query.desde) || 0;

  try {
      res.status(200).json({
          ok: true,
          msg: 'Enviando getUsuarios'
          
      })     
      
  } catch (error) {

    res.status(500).json({
        ok: false,
        msg: 'Hubo error en getusuarios... revisar el log'
    }) ;    
      
  }
  

};

const grabaUsuario = async (req:Request, res:Response)=>{

    const {nombre, email, password, avatar, role} = req.body;

    try {
        res.status(200).json({
            ok: true,
            msg: 'Post Listo.....',
            nombre,
            email,
            password,
            avatar,
            role
            
        })     
        
    } catch (error) {
  
      res.status(500).json({
          ok: false,
          msg: 'Hubo error en grabaUsuario... revisar el log'
      }) ;    
        
    }

}
const actualizaUsuario = async (req:Request, res:Response)=>{

    const {nombre, email, password, avatar, role} = req.body;
    const idUser = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                msg: 'Put Listo.....',
                nombre,
                email,
                password,
                avatar,
                role,
                idUser               
            })     
            
        } catch (error) {
      
          res.status(500).json({
              ok: false,
              msg: 'Hubo error en actualizaUsuario... revisar el log'
          }) ;    
            
        }


}

const eliminaUsuario = async (req:Request, res:Response)=>{

    const idUser = req.params.id;

    try {
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


}


export default { 
        getUsuarios, 
        grabaUsuario,
        actualizaUsuario,
        eliminaUsuario
    };