<?php
/**
 * Created by JetBrains PhpStorm.
 * User: glowdan
 * Date: 13-2-27
 * Time: PM9:43
 * To change this template use File | Settings | File Templates.
 */
class HomeController extends Cola_Controller
{
    function indexAction()
    {
        echo 1;
    }
    function homeAction()
    {
        $userId = $this->getVar('id');echo $userId;
        $this->view->id = $userId;
        $this->display();
    }
    function testAction()
    {
        echo 2;
    }
}
