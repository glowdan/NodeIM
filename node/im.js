var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var md5 = require('blueimp-md5').md5;
var server = require('http').createServer(
    function (req, response) {
//        fs.readFile(__dirname + '/im.html', function (err, data) {
//            response.writeHead(200, {'Content-Type':'text/html'});
//            response.write(data);
//            response.end();
//        });
    }
);

//console.log(md5('111111'));
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'im'
});

connection.connect();
connection.query('truncate online');
server.listen(9527);

var nowjs = require("now");
var everyone = nowjs.initialize(server);
var rf = refresh();
nowjs.groupPerson = new Array();

nowjs.on('connect', function () {
    console.log("come: " + this.now.name);
    var thisUser = this.now.name?this.now.name:0;
    connection.query('REPLACE INTO online SET ?', {uid:thisUser}, function () {
        connection.query('SELECT o.uid,u.* from online as o,user as u where o.uid=u.id', function (err, rows, fields) {
            if (err) throw err;
            everyone.now.onlineUsers = rows;
            rf(rows);
        });
    });
    if(thisUser.length>0){
        connection.query('REPLACE INTO userClient SET ?', {userId:thisUser, clientId:this.user.clientId});
    }
    var userClient = this.user.clientId;
    connection.query('select roomid from community where FIND_IN_SET("'+thisUser+'", person)',function(err, rows){
        if(err) throw err;
        for(var index in rows){
            nowjs.getGroup(rows[index]['roomid']).addUser(userClient);
        }
    });
    connection.query('select gp.gid from groupPerson as gp,user as u where u.id=gp.uid and u.id='+thisUser, function(err, rows){
        if(err) throw err;
        for(var index in rows){
            nowjs.getGroup("group_"+rows[index]['gid']).addUser(userClient);
        }
    });
    //console.log(this.user.clientId);
    nowjs.getGroup("myself_"+thisUser).addUser(userClient);
});

nowjs.on('disconnect', function () {
    console.log("leave: " + this.now.name);
    var thisUser = this.now.name?this.now.name:0;
    connection.query('delete from online where uid=' + thisUser, function () {
        connection.query('SELECT uid from online', function (err, rows, fields) {
            if (err) throw err;
//            for(var index in rows){
//                console.log('当前值:'+rows[index]['uid']);
//            }
            everyone.now.onlineUsers = rows;
            rf(rows);
        });
    });
    connection.query('DELETE FROM userClient WHERE userId=' + thisUser);
    var userClient = this.user.clientId;
    connection.query('select roomid from community where FIND_IN_SET("'+thisUser+'", person)',function(err, rows){
        if(err) throw err;
        for(var index in rows){
            nowjs.getGroup(rows[index]['roomid']).removeUser(userClient);
            nowjs.getGroup(rows[index]['roomid']).count(function (count) {
                if (count < 1) {
                    connection.query('delete from community where roomid="' + rows[index]['roomid']+'"', function () {});
                }
            });
        }
    });
    connection.query('select gp.gid from groupPerson as gp,user as u where u.id=gp.uid and u.id='+thisUser, function(err, rows){
        if(err) throw err;
        for(var index in rows){
            nowjs.getGroup("group_"+rows[index]['gid']).removeUser(userClient);
        }
    });
    nowjs.getGroup("myself_"+thisUser).removeUser(userClient);
});

function refresh() {
    var rf = function () {
        everyone.now.changeStatus();
    };
    return rf;
}
function nowTime() {
    var date = new Date();
    var date = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' + date.getUTCDate() + ' ' + ('00' + date.getUTCHours()).slice(-2) + ':' + ('00' + date.getUTCMinutes()).slice(-2) + ':' + ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}
//everyone.on('join', function(){
//    console.log('join'+this.user.clientId);
//});
//everyone.on('leave', function(){
//    console.log('leave'+this.user.clientId);
//})
everyone.now.changeRoom = function (newRoom) {
    nowjs.getGroup(newRoom).addUser(this.user.clientId);
    everyone.now.findOtherUser(newRoom);
    this.now.room = newRoom;
    this.now.receiveMessageServer("[进入 " + this.now.room + "]");
    var that = this;
    nowjs.getGroup(this.now.room).count(function (count) {
        var prettyCount = (count === 1) ? "此人不在线！" : " 开始聊天吧.";
        that.now.receiveMessageServer("正在和 " + that.now.room + "聊天. " + prettyCount);
    });
};

everyone.now.addChat = function (newRoom, uid) {
    console.log('addchat-room'+ newRoom);
    nowjs.groupPerson[newRoom] = new Array(this.user.clientId);
    //connection.query('REPLACE INTO community SET ?', {roomid:newRoom,owner:uid,person:uid});
    everyone.now.findOtherUser(newRoom, this.user.clientId, uid);
};

everyone.now.leaveChat = function (newRoom) {
    this.now.receiveMessageServer("[离开 " + this.now.room + "]");
    nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
};

everyone.now.distributeMessage = function (message) {
    nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name + "房间", message, 'common');
};

everyone.now.distributeChatMessage = function (message, room, sender, displayName) {
    console.log(room + ' '+sender + ' ' +message);
    var person = nowjs.groupPerson[room];
    var str = '';
    for (var index in person) {
        str += ',"' + person[index] + '"';
    }

    var insertSql = function(receiver){
        connection.query('INSERT INTO message SET ?',
            {userid:sender, addtime:nowTime(), content:message, talkto:receiver}
        );
    };
    //console.log('SELECT distinct clientId,userId FROM userClient WHERE clientId IN (""' + str + ')');
    connection.query('SELECT distinct clientId,userId FROM userClient WHERE clientId IN (""' + str + ')',
        function (err, rows) {
            if (err) throw err;

            var receiver = function(){
                var uid = [];
                for (var index in rows) {
                    if (rows[index]['userId'] != sender) {
                        uid.push(rows[index]['userId']);
                    }
                }
                return uid.join();
            };
            insertSql(receiver());
            var repairGroup = function(){
                for(var index in rows){
                    //console.log(rows[index]['clientId']);
                    if (rows[index]['clientId']!=undefined){

                                nowjs.getGroup(room).addUser(rows[index]['clientId']);
                                console.log(rows[index]['userId']);

                    }
                }
            }
            nowjs.getGroup(room).now.receiveMessage(room, message, sender, displayName, repairGroup());
        }
    );
};

everyone.now.applyChat = function (newRoom, applyClientId) {
    console.log('newRoom'+ newRoom);
    nowjs.getGroup(newRoom).addUser(applyClientId);
    nowjs.getGroup(newRoom).addUser(this.user.clientId);
//    nowjs.getGroup(newRoom).on('join', function(){
//            nowjs.getGroup(newRoom).removeUser(this.user.clientId);
//    });
    this.now.room = newRoom;
    var thisClientId = this.user.clientId;
    if(applyClientId!=thisClientId){
        nowjs.groupPerson[newRoom].push(thisClientId);
    }
//    nowjs.getGroup(newRoom).on('leave', function(){
//        nowjs.groupPerson[newRoom].remove(this.user.clientId);
//    });
    //console.log(nowjs.groupPerson[newRoom].length);
    var insertCommunity = function(uids, builder){
        console.log(uids);
        connection.query('REPLACE INTO community SET ?', {roomid:newRoom,owner:builder,person:uids});
    };
    if(thisClientId!=applyClientId){
        connection.query("select distinct clientId,userId from userClient WHERE clientId in('"+thisClientId+"','"+applyClientId+"')", function(err, rows){
            if(err) throw err;
            var builder;
            //console.log("select clientId,userId from userClient WHERE clientId in('"+thisClientId+"','"+applyClientId+"')");
            var userid = function(){
                var uid=[];
                for (var index in rows){
                    if(rows[index]['clientId']==applyClientId)
                        builder = rows[index]['userId'];
                    uid.push(rows[index]['userId']);
                    console.log('userId:'+rows[index]['userId']);
                }
                return uid.join();
            };
            insertCommunity(userid(), builder);
        });
    }

//    nowjs.getGroup(newRoom).on('leave', function(){
//        if(nowjs.getGroup(newRoom).count(function(num){
//            if(num <1){
//                nowjs.groupPerson.remove(newRoom);
//            }
//        }));
//        console.log(nowjs.groupPerson.length);
//    });
    //console.log('push:' + nowjs.groupPerson[newRoom]);
    nowjs.getGroup(newRoom).now.receiveMessageServer("[开始聊天 " + this.now.room + "]");
    var that = this;
    nowjs.getGroup(this.now.room).count(function (count) {
        var prettyCount = (count === 1) ? "此人不在线！" : " 开始聊天吧.";
        that.now.receiveMessageServer("正在和 " + that.now.room + "聊天. " + prettyCount);
    });
};

everyone.now.pushGroups=function(){
    var currentId = this.now.name;
    connection.query("select g.* from groups as g,groupPerson as gp where gp.gid=g.id and gp.uid="+currentId,function(err, rows){
        if(err) throw err;
        nowjs.getGroup("myself_"+currentId).now.unfoldGroup(rows);
    })
};
everyone.now.pushgroupPerson = function(groupId){
    var currentId = this.now.name;
    connection.query("select u.* from user as u,groupPerson as gp where gp.uid=u.id and gp.gid="+groupId, function(err, rows){
        if(err) throw err;
        nowjs.getGroup("myself_"+currentId).now.unfoldGroupPerson(groupId, rows);
    })
};
everyone.now.distributeGroupChatMessage = function (message, room, sender, displayName, roomName) {
    console.log(room + ' '+sender + ' ' +message);
    var person = nowjs.groupPerson[room];
    var str = '';
    for (var index in person) {
        str += ',"' + person[index] + '"';
    }
    nowjs.getGroup(room).now.receiveGroupMessage(room, message, sender, displayName,roomName);

    connection.query('INSERT INTO groupMessage SET ?', {userid:sender, addtime:nowTime(), content:message, talkto:room.replace('group_', '')} ,function(){

    });
};