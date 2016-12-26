/**
 * Created by shin on 2016/12/21.
 */

var fs = require('fs');
var Log={
    logstr:"",
    log:function(str){
        console.log(str);
        this.logstr+="\n"+str;
        fs.writeFile('public/log.txt', this.logstr, function (err) {
                if (err) throw err;
                 console.log('It\'s saved!'); //文件被保存
            });
    },
    getStr:function(){

    }
}
module.exports=Log;