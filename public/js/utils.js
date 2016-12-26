/**
 * Created by shin on 2016/12/22.
 */
function dialog_left(str)
{
    var div=document.createElement('div');
    div.setAttribute('class','dialog');
    var divicon=document.createElement('div');
    var dd=parseInt(Math.random()*3);
    console.log(dd);
    var classnames=['icon icon','icon icon1','icon icon2','icon icon3'];
    var clasname=classnames[dd]
    divicon.setAttribute('class',clasname);
    var divtxt=document.createElement('div');
    divtxt.setAttribute('class','txt');
    divtxt.innerHTML=str;
    div.appendChild(divicon);
    div.appendChild(divtxt);
    return div;
}
function dialog_right(str)
{
    var div=document.createElement('div');
    div.setAttribute('class','dialog dialog_self');
    var divicon=document.createElement('div');
    divicon.setAttribute('class','icon');
    var divtxt=document.createElement('div');
    divtxt.setAttribute('class','txt');
    divtxt.innerHTML=str;
    div.appendChild(divtxt);
    div.appendChild(divicon);
    return div;
}