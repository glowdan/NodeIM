<form method="post" action='<?php echo $this->url(array('controller'=>'groups', 'model'=>'addUserPost'));?>'>
    <ul>
    <?php
    if(!empty($this->allUser)){
        foreach($this->allUser as $user){
    ?>
            <li><input type="checkbox" id="user_<?php echo $user['id'];?>" name="user_<?php echo $user['id'];?>"> <?php echo $user['displayName'];?></li>
    <?php
        }
    }
    ?>
    </ul>
    <input type="hidden" name="groupId" value="<?php echo $this->gid;?>">
    <input type="submit" name='addUserSub' value="添加新用户">
    <script type="text/javascript">
    <?php
    if(!empty($this->hadUser)){
        foreach($this->hadUser as $user){
    ?>
            $('#user_<?php echo $user['id'];?>').attr('checked',true);
    <?php
        }
    }
    ?>
    </script>
</form>