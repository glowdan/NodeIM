<div>
    <li><a href="<?php echo $this->url(array('controller'=>'groups', 'model'=>'index' ));?>">群组管理</a></li>
</div>
<div>
    <table>
        <tr>
            <th>ID</th>
            <th>名称</th>
            <th>操作</th>
            <th>用户</th>
        </tr>
        <?php
        foreach($this->groupList as $group){
            ?>
            <tr>
                <td><?php echo $group['id']?></td>
                <td><?php echo $group['title']?></td>
                <td>
                    <a href="<?php echo $this->url(array('controller'=>'groups', 'model'=>'delete', 'params'=>array('id'=>$group['id']) ));?>">删除</a> |
                    <a href="<?php echo $this->url(array('controller'=>'groups', 'model'=>'addUser', 'params'=>array('id'=>$group['id']) ));?>">添加用户</a> |
                    <a href="#" class="groupUserList" id='gu_<?php echo $group['id'];?>'>用户</a>
                </td>
                <td>
                    <span id='gulist_<?php echo $group['id']?>'></span>
                </td>
            </tr>
            <?php
        }
        ?>
        <form method="post" action="<?php echo $this->url(array('controller'=>'groups', 'model'=>'add' ));?>">
            <tr>
                <td></td>
                <td><input type="text" name='title'></td>
                <td><input type="submit" name="submit" value="新添加"></td>
            </tr>
        </form>
    </table>

</div>
    <script type="text/javascript">
        $(document).ready(function () {
        $('.groupUserList').click(function()
        {
            var id = $(this).attr('id').replace('gu_', '');
            $.getJSON(
                    '<?php echo $this->url(array('controller'=>'groups', 'model'=>'groupUser'));?>/id/'+id,
                    {},
                    function(data)
                    {
                        for(var index in data){
                            $('#gulist_'+id).append(data[index]['displayName']);
                        }
                    }
            )
        });
        })
    </script>