<?php
/**
 * Created by JetBrains PhpStorm.
 * User: glowdan
 * Date: 13-3-2
 * Time: PM8:44
 * To change this template use File | Settings | File Templates.
 */
class GroupModel extends Cola_Model
{
    public $_table = 'groups';
    public function getGroup()
    {
        $sql = "select * from `groups`";
        $rtn = $this->sql($sql);
        return $rtn;
    }

    public function editGroup()
    {

    }

    public function addGroup($arr)
    {
        $arr['adder'] = 1;
        $this->insert($arr, 'groups');
    }

    public function deleteGroup($id)
    {
        $this->delete($id, 'id');
    }
    public function groupUser($gid)
    {
        $sql = "select u.* from user as u,groupPerson as gp where gp.uid=u.id and gp.gid=$gid";
        return $this->sql($sql);
    }
    public function rebuildGroupUser($gid, $ids)
    {
        $this->sql("delete from groupPerson where gid=$gid");
        foreach($ids as $id){
            $this->insert(array('gid'=>$gid, 'uid'=>$id), 'groupPerson');
        }
        return true;
    }
}
