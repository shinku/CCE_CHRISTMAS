/**
 * Created by shin on 2016/12/20.
 */
var log=require("../core/Log");
var mysql=require('mysql');
var config=require("../core/config");
function sqler()
{
    this.isInited=false;
    this.id=Math.random()*100;
    this.onInit=function(){};
    /*var connection = mysql.createConnection(config);

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });
    return;*/
    var self=this;
    //console.log(config);
    this.connection=mysql.createConnection(config);
    /*
    * host:config.mysqladdress,
     user:config.mysqlaccount,
     port : 3306,
     password:config.mysqlpqssword,
     database:config.mysqldatabase*/
    this.connection.on('error',function(error){
        log.log("ERROR");
        if(error && error.code === 'PROTOCOL_CONNECTION_LOST')
        {
            log.log('reconnect');
            self.connection.connect();
        }
    });
    this.init=function(callback)
    {
        if(self.isInited)
        {
            return;
        }
        self.isInited=true;
        self.connection.connect(function(e){
           //console.log(e);
           //console.log(self.connection);
           if(e && e.code === 'PROTOCOL_CONNECTION_LOST')
           {

           }
           else
           {
               //console.log(callback);
               //callback();
               self.handleConnectDone();
           }
       });
    };
    this.handleConnectDone=function(){
        self.onInit();
    };
    this.test=function()
    {
        this.query('select count(*) from users where email="abc@wd.com" and usertype=1',function(e,row){
            console.log(row);
        });
    };
    this.query=function(querystr,fun){
        log.log("SQL:"+querystr+"---->"+self.id);
        this.connection.query(querystr,fun);
    };
    this.handleConnect=function(e)
    {
        log.log(e);
    };
    this.closeSql=function()
    {
        this.connection.disconnect();
    }
};
var CCE_SQL={
    initSql:function() {
        return new sqler()
    },
    init:function(){}
};
module.exports=CCE_SQL;