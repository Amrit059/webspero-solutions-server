import * as express from 'express';
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { checkSession } from '../midddlewares/user-check.session';

const newUserController = new UserController();

const router: Router = express.Router();

/* user Api start from here */

/**
* /login/user
* @author Amritpal Singh
* @FinalUrlExample /rest/api/login/user
* @description this route used for login user
*/
router.post(
    '/rest/api/login/user',
    newUserController.loginUser);

/**
* /fetch/user/list/by/location
* @author Amritpal Singh
* @FinalUrlExample /rest/api/fetch/user/list/by/location
* @description this route used for fetching user list by location
*/
router.get(
    '/rest/api/fetch/user/list/by/location',
    checkSession,
    newUserController.getUserListByLocation);

/**
* /fetch/user/by/id
* @author Amritpal Singh
* @FinalUrlExample /rest/api/fetch/user/by/id
* @description this route used for fetching user by id
*/
router.get(
    '/rest/api/fetch/user/by/id',
    checkSession,
    newUserController.getUserById);

/**
* /update/user
* @author Amritpal Singh
* @FinalUrlExample /rest/api/update/user
* @description this route used for update user
*/
router.put(
    '/rest/api/update/user',
    newUserController.updateUser);

/**
* /create/user
* @author Amritpal Singh
* @FinalUrlExample /rest/api/create/user
* @description this route used for create user
*/
router.post(
    '/rest/api/create/user',
    newUserController.createUser);

/**
* /update/user/active/status
* @author Amritpal Singh
* @FinalUrlExample /rest/api/update/user/active/status
* @description this route used for update user active status
*/
router.put(
    '/rest/api/update/user/active/status',
    checkSession,
    newUserController.logoutUser);

/* user Api end here */

export default router;
