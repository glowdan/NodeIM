<?php
/**
 * Created by JetBrains PhpStorm.
 * User: glowdan
 * Date: 13-3-2
 * Time: PM8:46
 * To change this template use File | Settings | File Templates.
 */
class UsersController extends Cola_Controller
{
    protected $user;
    public function __construct()
    {
        parent::__construct();
        $this->user = $this->model('User');
    }
    public function indexAction()
    {
        $userList = $this->user->getUser();
        $this->view->userList = $userList;
        $this->display('header.php', 'views/Element/');
        $this->display();
        $this->display('footer.php', 'views/Element/');
    }
    public function addAction()
    {
        if($this->post('username')){
            $arr = array(
                'username'=>$this->post('username'),
                'displayName'=>$this->post('displayName')
            );
            $this->user->addUser($arr);
        }
        $this->redirect();
    }
    public function editAction()
    {

    }
    public function deleteAction()
    {
        $id = $this->getVar('id');
        $this->user->deleteUser($id);
        $this->redirect();
    }

}
