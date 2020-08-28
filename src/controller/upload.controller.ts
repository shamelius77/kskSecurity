import {Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

import  { actualizarImagen }   from '../helpers/actualizar-imagen';



const upload = async (req:Request, res:Response)=>{

    const {tipo, id} = req.params;
    const {fileUpload} = req.body;
   
    try {

        // validar tipo
        const tiposValidos:string[] = ['usuarios','items'];
        if (!tiposValidos.includes(tipo)){
             return res.status(400).json({
                ok: false,
                msg: 'el tipo no es valido (usuarios)'
            }) ; 
        }

        // validar que exita un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'no hay ningun archivo'
          })
        }

        // procesar el archivo.....
        const file:any = req.files.imagen;
        const nombreCortado:Array<string> = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1]

        // extensiones validas
        const extensionesValidas:string[] = ['png', 'jpg', 'jpeg', 'gif']
        if (!extensionesValidas.includes(extensionArchivo)){
            return res.status(400).json({
               ok: false,
               msg: 'solo extensiones .png .jpg .jpeg .gig'
           }) ; 
       }

       // Generar el nombre del archivo
       const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

       // path para guardar la imagen
       const path = `./src/uploads/${tipo}/${nombreArchivo}`

       // mover la iamgen
       file.mv(path, (err:any)=> {
            if (err){
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'hubo error inesperado...'
                })
            }

            res.status(200).json({
                ok: true,
                msg: 'file upload...',
                nombreArchivo
            }) ; 
      });

      // Actualizar base de datos
       actualizarImagen(tipo, id, nombreArchivo);

       
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo error inesperado... revisar el log'
        }) ; 
        
    }
    
}

const retornaImagen = async (req:Request, res:Response)=>{
    const {tipo, foto} = req.params;

    try {
        const pathImagen = path.join(__dirname, `../uploads/${tipo}/${foto}`);
        
        if(fs.existsSync(pathImagen)){
            res.sendFile( pathImagen );
        }else{
            const pathImagen = path.join(__dirname, `../uploads/noimage.png`);
            res.sendFile( pathImagen );
        }
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo error inesperado... revisar el log'
        }) ; 
        
    }

}

export default { 
        upload,
        retornaImagen
    };