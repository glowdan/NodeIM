<?php
/**
 * Created by JetBrains PhpStorm.
 * User: glowdan
 * Date: 13-3-2
 * Time: PM8:42
 * To change this template use File | Settings | File Templates.
 */
class UserModel extends Cola_Model
{
    public $_table = 'user';
    public function getUser()
    {
        $sql = "select * from `user`";
        $rtn = $this->sql($sql);
        return $rtn;
    }

    public function editUser()
    {

    }

    public function addUser($arr)
    {
        $this->insert($arr, 'user');
    }

    public function deleteUser($id)
    {
        $this->delete($id, 'id');
    }
}
