/**
 * Created by shin on 2016/12/21.
 */


var scoketio=require('socket.io');
var people=require('./people');
var mysql=require('../SQL/sqler');
var log=require('../core/Log');

var chatRoom=function(){
    this.roomnumber=Math.random()*100;
    var self=this;
    this.group={};
    this.io;
    this.chatHistory=[];
    this.emailRecord={};
    this.sockets={};
    this.managerSocket=null;
    this.winnerlist={};
    this.lotteryCount=0;
    this.init=function(server){
        self.io=scoketio.listen(server);
        self.io.on('connection',function(socket){
            log.log("socket in "+socket.id);
            socket.emit('connection');
            socket.on('baomin', function(data) {

                //将消息输出到控制台
                //data format{'email':''}
                console.log(data);
                //1;判断email有效性
                    //1.1email 有效,新建people对象，将socket 交付给people托管
                    //1.2email无效，结束。socket告知对方你还没有权限参加互动。
                //2.如果email为'CCEMANAGER'的话。
                //CCEMANAGER为管理员专属，当前socket只能存在一个管理员的socket
                   if(data.email=="CCEMANAGER") {
                       log.log('ccemanager in');
                        if(self.managerSocket)
                        {
                            self.managerSocket.emit('out',{'msg':'you are out',id:self.managerSocket.id});
                            self.managerSocket=null;
                        }
                        self.managerSocket=socket;
                        self.managerSocket.emit('getHistory',{'history':self.chatHistory,'winners':self.winnerlist});
                        self.managerSocket.on('lottery',self.handleLottery);

                   } else{
                        //self.checkEmail(data);
                       var pe=new people(self,socket,data);
                   }

            });
        })

    };
    this.recordChat=function(email,str){

        //self.emailRecord:记录每一个人的内容回复{"abc@123.com":['12','323'],'sss@mm.com',['dd','ffff']};
        //self.chatHistory:所有人的消息回复内容记录[{email:'}]
        if(!self.emailRecord[email])
        {
            self.emailRecord[email]=[];
        }
        self.emailRecord[email].push(str);
        self.chatHistory.push({"email":email,'content':str});
        //console.log(self.emailRecord);
        //console.log(self.chatHistory);
    };
    this.handleLottery=function(data)
    {
        //xmas.getLottery();
        var array=data;
        var winnerlist=self.winnerlist;
        //判断当前数组可以进行抽奖
        var canLottery=false;
        for(var i=0;i<array.length;i++)
        {
            var em=array[i]['email'];
            if(!winnerlist[em])
            {
                canLottery=true;
            }
        }
        if(canLottery==false)
        {
            log.log('can not lottery');
            self.managerSocket.emit('noWin',{'content':'nowinner'});
            return;
        }
        self.lotteryCount++;
        var index=0;
        var length=array.length;
        var latteryIndex=parseInt(Math.random()*length);
        /*log.log("DATA IS ->");
        log.log(data);
        log.log(length);
        log.log(latteryIndex);
        log.log(array);*/
        var winneremail=array[latteryIndex].email;
        if(self.lotteryCount==5)
        {
            var isCheck=false;
            for(var i=0;i<array.length;i++)
            {
                if(array[i].email.toLocaleLowerCase()=='cici.liu@ccegroup.cn')
                {
                    latteryIndex=i;
                    winneremail='cici.liu@ccegroup.cn';
                    winnerlist[winneremail]=1;
                    isCheck=true;
                    self.managerSocket.emit('getWin',{'email':winneremail,'arrindex':latteryIndex,'content':array[latteryIndex].content,'winnerlist':winnerlist});
                    return;
                }
            }
            if(!isCheck)
            {
                while(winnerlist[winneremail]==1)
                {
                    latteryIndex=parseInt(Math.random()*length);
                    winneremail=array[latteryIndex].email;
                };
                /*console.log('WINNDER LIST');
                 console.log(winnerlist);*/
                winnerlist[winneremail]=1;
                //console.log("WINNER IS");
                //console.log({'email':winneremail,'arrindex':latteryIndex,'content':array[latteryIndex].content});
                self.managerSocket.emit('getWin',{'email':winneremail,'arrindex':latteryIndex,'content':array[latteryIndex].content,'winnerlist':winnerlist});
            }
        }
        else {
            while(winnerlist[winneremail]==1 || winneremail.toLocaleLowerCase()=='cici.liu@ccegroup.cn')
            {
                latteryIndex=parseInt(Math.random()*length);
                winneremail=array[latteryIndex].email;
            };
            /*console.log('WINNDER LIST');
             console.log(winnerlist);*/
            winnerlist[winneremail]=1;
            //console.log("WINNER IS");
            //console.log({'email':winneremail,'arrindex':latteryIndex,'content':array[latteryIndex].content});
            self.managerSocket.emit('getWin',{'email':winneremail,'arrindex':latteryIndex,'content':array[latteryIndex].content,'winnerlist':winnerlist});
        }
    },
    this.TellManager=function(data)
    {
        self.recordChat(data.email,data.content);
        if(self.managerSocket)
        {
            self.managerSocket.emit('wearechatting',data);
        }
        for(var oo in self.group)
        {
            //console.log(oo);
            //console.log(self.group[oo]);
            self.group[oo].say(data);

        }
    }
    this.tellAvriable=function(people)
    {
        var socket=people.peopleScoket;
        self.sockets[socket]=socket;
        self.group[people.peopleemail]=people;
        socket.emit('ok',{});
    };
    this.tellUnAvriable=function(people)
    {
        var socket=people.peopleScoket;
        //self.group[people.peopleemail]=null;
        socket.emit('illegal',{});
        self.removeSocket(socket);
        socket.disconnect();
    };
    this.removePeople=function(email)
    {
        //移除用户，一般不执行，只要用户参与留言就就回有抽奖机会。
        self.group[email]=null;

    };
    this.removeSocket=function(socketid)
    {
        log.log('socket '+socketid+" is removed");
        self.sockets[socketid]=null;
    };
    this.init();
}
var _ROOM=new chatRoom();
module.exports=_ROOM;
