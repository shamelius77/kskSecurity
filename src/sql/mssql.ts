import mssql from "mssql";

let dbconfig = {
    server:             'DESKTOP-K9GNF1O',
    database:           'kskSecurity',
    user:               'sa',
    password:           '3108sham',
    port:               1433,
    connectionTimeout:  150000,
    options: {
        enableArithAbort: true,
        encrypt: true
      }
}

export default class MsSql {

    private static _instance:MsSql;
    cnn: mssql.ConnectionPool;
    conectado:boolean = false;

    constructor(){

        this.cnn =  new mssql.ConnectionPool(dbconfig);
        this.conectarDB();

    }

    // para trabajar el patron singleton 
    public static get instance(){

        return this._instance || (this._instance = new this() )

    }

    
    private conectarDB(){
        this.cnn.connect((err:mssql.ConnectionError )=>{
            if(err){
                console.log('existe error al conectar');
                console.log(err.message);
             
                this.cnn.close();
                return;
            }

            this.conectado = true;
            console.log(`base de datos online....`);

        })

    }

}

