import sql from 'mssql';
import MsSql from '../sql/mssql';
import fs from 'fs';

const actualizarImagen = async (tipo:string, id:string, archivo:string)=>{

    switch (tipo) {
        case 'usuarios':
            try {
                let pool = await MsSql.instance.cnn.connect();
                // validar que el id del usuarios exista
                let result = await pool.request()
                                        .input("usrId",     sql.Int,   id)
                                        .execute('spUsuarios_ById')

                if(result.recordset.length <= 0 ){
                    return false;
                }

                const pathViejo = `./src/uploads/${tipo}/${result.recordset[0].usrAvatar}`
                if(fs.existsSync(pathViejo)){
                    // eliminar imagen anterior
                    fs.unlinkSync(pathViejo)
                }

                result = await pool.request()
                .input("usrId",         sql.Int,        id)
                .input("usrAvatar",     sql.VarChar,    archivo)
                .execute('spUsuarios_UpdAvatar')

                console.log(result);

                return true;

                
            } catch (error) {
                console.log(error);
                return false;
            }      
            finally{
        
                MsSql.instance.cnn.close(); 
                console.log('cerrando conexion de Database');
        
            }
            
            break;
        case 'items':
        
            break;

        default:
            break;
    }

}


export  {
    actualizarImagen
}