<?php
/**
 * Created by JetBrains PhpStorm.
 * User: glowdan
 * Date: 13-3-2
 * Time: PM8:55
 * To change this template use File | Settings | File Templates.
 */
class GroupsController extends Cola_Controller
{
    protected $group;
    public function __construct()
    {
        parent::__construct();
        $this->group = $this->model('Group');
    }
    public function indexAction()
    {
        $groupList = $this->group->getGroup();
        $this->view->groupList = $groupList;
        $this->display('header.php', 'views/Element/');
        $this->display();
        $this->display('footer.php', 'views/Element/');
    }

    public function addAction()
    {
        if($this->post('title')){
            $arr = array(
                'title'=>$this->post('title')
            );
            $this->group->addGroup($arr);
        }
        $this->redirect();
    }

    public function editAction()
    {

    }

    public function deleteAction()
    {
        $id = $this->getVar('id');
        $this->group->deleteGroup($id);
        $this->redirect();
    }
    public function editUserAction()
    {

    }
    public function groupUserAction()
    {
        $gid = $this->getVar('id');
        echo json_encode($this->group->groupUser($gid));
    }
    public function addUserAction()
    {
        $gid = $this->getVar('id');
        $allUser = $this->model('User')->getUser();
        $hadUser = $this->group->groupUser($gid);
        $this->view->allUser = $allUser;
        $this->view->hadUser = $hadUser;
        $this->view->gid = $gid;
        $this->display('header.php', 'views/Element/');
        $this->display();
        $this->display('footer.php', 'views/Element/');
    }
    public function addUserPostAction()
    {
        $post = $this->post();
        $gid= $post['groupId'];
        if(empty($post)){
            return false;
        }
        $newIds = array();
        foreach($post as $key=>$one){
            if(strstr($key, 'user_', 0)){
                $newIds[] = str_replace('user_', '', $key);
            }
        }
        if($this->group->rebuildGroupUser($gid, $newIds))
            $this->redirect();
    }
}
