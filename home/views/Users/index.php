<div>
    <li><a href="<?php echo $this->url(array('controller'=>'users', 'model'=>'index' ));?>">用户管理</a></li>
</div>
<div>
    <table>
        <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>登录名</th>
            <th>操作</th>
        </tr>
        <?php
        foreach($this->userList as $user){
?>
        <tr>
            <td><?php echo $user['id']?></td>
            <td><?php echo $user['username']?></td>
            <td><?php echo $user['displayName']?></td>
            <td>
                <a href="<?php echo $this->url(array('controller'=>'users', 'model'=>'delete', 'params'=>array('id'=>$user['id']) ));?>">删除</a> |
                <a href="<?php echo $this->url(array('controller'=>'users', 'model'=>'edit', 'params'=>array('id'=>$user['id']) ));?>">编辑</a>
            </td>
        </tr>
            <?php
        }
?>
        <form method="post" action="<?php echo $this->url(array('controller'=>'users', 'model'=>'add' ));?>">
            <tr>
                <td></td>
                <td><input type="text" name='username'></td>
                <td><input type="text" name='displayName'> </td>
                <td><input type="submit" name="submit" value="新添加"></td>
            </tr>
        </form>
    </table>

</div>