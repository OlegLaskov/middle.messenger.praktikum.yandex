import Router from './router';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { PATH } from './router/paths';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import Error500 from './pages/Error500';
import Error404 from './pages/Error404';
import { connect } from './utils/HOC';

import './style.scss';

const router = new Router('#root');
router
	.use(PATH.LOGIN, LoginPage)
	.use(PATH.SIGNUP, SignupPage)
	.use(PATH.CHAT, ChatPage)
	.use(PATH.PROFILE, connect(ProfilePage), {readonly: true})
	.use(PATH.EDIT_PROFILE, connect(ProfilePage), {readonly: false})
	.use(PATH.CHANGE_PASSWORD, ProfilePage, {readonly: false, changepassword: true})
	.use(PATH.ERROR500, Error500)
	.use(PATH.ERROR404, Error404)
	.start();
