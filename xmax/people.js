/**
 * Created by shin on 2016/12/21.
 */
var sqler=require('../SQL/sqler');
var log=require('../core/Log');
var people=function(_room,socket,data){
    var self=this;
    this.peopleid=socket.id;
    //console.log("my data is "+data);
    log.log(_room);
    this.peopleemail=data.email;
    this.userType=1;
    this.peopleScoket=socket;//socket;
    log.log("roomnumber is "+_room.roomnumber);
    this.peopleScoket.on('disconnect',function(){
        _room.removeSocket(self.peopleScoket.id);
    });
    this.peopleScoket.on('chat',function(data){
        _room.TellManager(data);
    });
    this.handleSqlready=function(){
        log.log("sqlready");
        self.checkUser();
    };
    this.say=function(data){
        //{email:'',content:''}
        //前端：socket.emit('chat',{email:'',content:''});
        //self.peopleScoket.on('chat',self.onChat);
        self.peopleScoket.emit('withchat',data);
    };
    this.onChat=function(data)
    {
        //告知管理员我在说话
        _room.TellManager(data);

    };
    this.checkUser=function(){
        var time=new Date();
        var hour=time.getHours();
        var hourtype=1;
        if(hour>=0 && hour<=12)
        {
            hourtype=1;//上午
        }
        else
        {
            hourtype=2;//下午
        }
        self.userType=hourtype;
        self.peopleemail=self.peopleemail.toLocaleLowerCase();
        //self.sql.connection.query('select count(*) as countnum from users where email="'+self.peopleemail+'" and usertype='+hourtype+'',self.checkIsAvraible);
        //self.sql.query('select count(*) from users where email="abc@wd.com" and usertype=1',self.checkIsAvraible);
        self.sql.query('select count(*) as countnum from users where email="'+self.peopleemail+'"',self.checkIsAvraible);

    };
    this.checkIsAvraible=function(e,rows)
    {
        if(rows[0]['countnum']>=1)
        {
            log.log(self.peopleid+"  is   avriable user");//用户有效
            _room.tellAvriable(self);
        }
        else
        {
            log.log(self.peopleid+" is  unavriable user");//用户无效
            _room.tellUnAvriable(self);
        }
    };
    this.sql=sqler.initSql();
    //console.log(self.handleSqlready);
    this.sql.init();
    this.sql.onInit=this.handleSqlready;
    //1为上午。2为下午
};
module.exports=people;