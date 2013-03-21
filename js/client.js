$(document).ready(function () {

    now.receiveMessage = function (name, message, sender, displayName) {
        newDialog(name, message, sender, displayName);
    };
    now.receiveMessageServer = function (message) {
        $("#serverMessage").append("<br/>" + message);
    };
    now.findOtherUser = function (newRoom, applyid, uid) {
        var allids = newRoom.split('_');
        for (var index in allids) {
            if (allids[index] == now.name) {
                now.applyChat(newRoom, applyid);
            }
        }
    };
    now.initHtmlVars = function (info) {
        //info = info[0];
        $("#serverMessage").append("<br/>" + info[0]['displayName']);
    };
    now.changeStatus = function () {
        $('.add').removeClass('online').addClass('outline');
        for (var index in now.onlineUsers) {
            var currentid = now.onlineUsers[index]['uid'];
            if (currentid == currentUserId && $('#onlineList #currentUser').length < 1) {
                //alert(0);
                $('#onlineList').append("<li><span id='currentUser'>" + now.onlineUsers[index]['displayName'] + "</span> </li>");
                $('#user-displayname').val(now.onlineUsers[index]['displayName']);
                $('#user-uid').val(now.onlineUsers[index]['uid']);
                $('#user-username').val(now.onlineUsers[index]['username']);
            } else if (currentid != now.name) {
                if ($('#onlineList #open' + currentid).length > 0) {
                    $('#open' + currentid).removeClass('outline').addClass('online');
                } else {
                    newComer(now.onlineUsers[index]);
                }
            }
        }
    };
    now.unfoldGroup = function(rows){
        for(var index in rows){
            var group = rows[index];
            $('#groupPool').append('<a href="#" class="add" id="group_open_' + group['id'] + '">' + group['title'] + '</a> | ' +
                '<a href="#" class="leave" id="group_list_' + group['id'] + '">LIST</a> -<br/><div id="group_person_'+group['id']+'"></div><br>');
            $("#group_list_"+group['id']).click(function(){
                now.pushgroupPerson(group['id']);
            });
            $("#group_open_"+group['id']).click(function(){
                if ($('#groupMessagePool #groupMessage_' + group['id']).length < 1) {
                    //var chatid = name;
                    $('#groupMessagePool').append('<div id="groupMessage_' + group['id'] + '" style="background: ' + getRandomColor() + ';height: 60px;"></div>');
                    $('#groupMessagePool').append('<input type="button" value="发送给：' + group['title'] + '" id="groupSendButton_' + group['id'] + '" class="send-button">');
                    $('#groupSendButton_' + group['id']).click(function () {
                        var roomid = $(this).attr('id').replace('groupSendButton_', 'group_');
                        var sender = $("#user-uid").val();
                        var sendusername = $("#user-displayname").val();
                        now.distributeGroupChatMessage($('#text-input').val(), roomid, sender, sendusername,group['title']);
                        $('#text-input').val("");
                    });
                }
            });
        }
    };
    now.unfoldGroupPerson = function(groupId, rows){
        for(var index in rows){
            $("#group_person_"+groupId).append(rows[index]['displayName']);
        }
    };
    now.receiveGroupMessage = function(room, message, sender, displayName, roomName){
        var room = room.replace('group_', '');
        if ($('#groupMessagePool #groupMessage_' + room).length < 1) {
            //var chatid = name;
            $('#groupMessagePool').append('<div id="groupMessage_' + room + '" style="background: ' + getRandomColor() + ';height: 60px;"></div>');
            $('#groupMessagePool').append('<input type="button" value="发送给：' + roomName + '" id="groupSendButton_' + room + '" class="send-button">');
            $('#groupSendButton_' + room).click(function () {
                var roomid = $(this).attr('id').replace('groupSendButton_', 'group_');
                var sender = $("#user-uid").val();
                var sendusername = $("#user-displayname").val();
                now.distributeGroupChatMessage($('#text-input').val(), roomid, sender, sendusername);
                $('#text-input').val("");
            });
        }
        $("#groupMessage_"+room).append("<br><b>" + displayName + "说</b>: " + message);
    };
    //now.pushGroups();
    var newComer = function (user) {
        if (user['displayName'] === undefined) {
            return null;
        }
        $('#onlineList').append('<li><a href="#" class="add" id="open' + user['uid'] + '">' + user['displayName'] + '</a> | ' +
            '<a href="#" class="leave" id="close' + user['uid'] + '">X</a> </li>');
        $('#open' + user['uid']).addClass('online');
        $('#open' + user['uid']).click(function () {
            var chatid = $(this).attr('id').replace('open', '');
            if (chatid > currentUserId) {
                chatid = currentUserId + '_' + chatid;
            } else {
                chatid = chatid + '_' + currentUserId;
            }
            if ($("#messagePool #message" + chatid).length < 1) {
                $('#messagePool').append('<div id="message' + chatid + '" style="background: ' + getRandomColor() + ';height: 60px;"></div>');
                $('#messagePool').append('<input type="button" value="发送给：' + user['displayName'] + '" id="send-button' + chatid + '" class="send-button">');
                $('#send-button' + chatid).click(function () {
                    var roomid = $(this).attr('id').replace('send-button', '');
                    var sender = $("#user-uid").val();
                    var sendusername = $("#user-displayname").val();
                    now.distributeChatMessage($('#text-input').val(), roomid, sender, sendusername);
                    $('#text-input').val("");
                });
                now.addChat(chatid, currentUserId);
            }
        });
    };
    var newDialog = function (name, message, sender, displayName) {
        if ($('#messagePool #message' + name).length < 1) {
            var chatid = name;
            $('#messagePool').append('<div id="message' + name + '" style="background: ' + getRandomColor() + ';height: 60px;"></div>');
            $('#messagePool').append('<input type="button" value="发送给：' + displayName + '" id="send-button' + name + '" class="send-button">');
            $('#send-button' + name).click(function () {
                var roomid = $(this).attr('id').replace('send-button', '');
                var sender = $("#user-uid").val();
                var sendusername = $("#user-displayname").val();
                now.distributeChatMessage($('#text-input').val(), roomid, sender, sendusername);
                $('#text-input').val("");
            });
            $("#message" + name).append("<br><b>" + displayName + "说</b>: " + message);
        } else {
            $("#message" + name).append("<br><b>" + displayName + "说</b>: " + message);
        }
    };

    $("#groupLink").click(function(){
        now.pushGroups();
    });

    var getRandomColor = function () {
        return '#' + (Math.random() * 0xffffff << 0).toString(16);
    };
    $("#send-button").click(function () {
        now.distributeMessage($("#text-input").val());
        $("#text-input").val("");
    });

    $("#text-input").keypress(function (e) {
        //if (e.which && e.which === 13) {
        //$("#send-button").click();
        //return false;
        //}
    });
});