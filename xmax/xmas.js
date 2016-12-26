/**
 * Created by shin on 2016/12/21.
 */
var log=require("../core/Log");
var sqler=require('../SQL/sqler');
var xmas={
    sql:null,
    onGetLottery:function(){},
    onCheckUser:function(){},
    checkUser:function(useremail){
        if(!this.sql){
            this.sql=sqler.initSql();
        }
        this.sql.init();
        var time=new Date();
        var hour=time.getHours();
        var hourtype=1;
        console.log(hour);
        if(hour>=0 && hour<=12)
        {
            hourtype=1;//上午
        }
        else
        {
            hourtype=2;//下午
        }
        this.sql.query("select count(*) as countnum from users where email='"+useremail+"' and usertype="+hourtype+"",this.checkIsAvraible);
    },
    checkIsAvraible:function(e,rows,fields)
    {
        if(rows[0]['countnum']>=1)
        {
            log.log("avriable user");//用户有效
            this.checkUser(1);
        }
        else
        {
            log.log("unavriable user");//用户无效
            this.checkUser(0);
        }
    },
    getLottery:function(email){
        //
        if(!this.sql){
            this.sql=sqler.initSql();
        }
        this.sql.init();
        this.onGetLottery();
    }
};
module.exports=Object.create(xmas);