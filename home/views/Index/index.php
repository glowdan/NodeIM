<!DOCTYPE html>
<html lang="en">
<head>
    <title>IM</title>
    <link href="/chat/css/main.css" rel="stylesheet" >

</head>

<body>
<div id="messages"><br>欢迎来到GlowDan</div>
<div id="main"></div>
<div class='clear'></div>
<div id="onlineListDiv">
    <b>在线成员列表</b>
    <ul id='onlineList'></ul>

</div>
<br>

<div id="messagePool">
    <b>正在聊天</b>
    <br/>

</div>
<div id="messageBar">
    <ul id='messageBarElements'>
        <li><a href='#'>ssssssssss</a><div class='messageWindow'></div></li>
        <li><a href='#'>ssssssssss</a>
            <div class='messageWindow'>
                <div class="messageFlow">
                    a<br/>
                    a<br/>
                    a<br/>
                    a<br/>
                    a<br/>
                </div>
                <div class="messageInputArea">
                    <div><textarea class="messageInput"></textarea></div>
                    <input type='button' value="发送" class="messageSub">
                </div>
            </div>
        </li>
    </ul>
</div>
<div id="groupPool">
    <a href="#" id="groupLink">群组</a><br/>
</div>
<div id="groupMessagePool">
    <b>正在聊天</b>
    <br/>

</div>
<input type="text" id="text-input">
<input type="hidden" id="user-displayname">
<input type="hidden" id="user-uid">
<input type="hidden" id="user-username">

<div id="serverMessage"><br><b>服务消息</b><br></div>
<script type="text/javascript" src="/chat/js/jquery-1.9.1.min.js"></script>
<script src="http://localhost:9527/nowjs/now.js"></script>
<script>
    now.name = <?php echo $this->id;?>;
    currentUserId = <?php echo $this->id;?>;
</script>
<script type="text/javascript" src="/chat/js/client.js"></script>
</body>
</html>