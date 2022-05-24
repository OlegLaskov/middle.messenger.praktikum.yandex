// import {default as renderDOM} from './utils/render';
// import main from './pages/main';
// import login from './pages/LoginPage';
// import signup from './pages/signup';
// import profile from './pages/profile';
// import error from './pages/error';
// import Component from './utils/component';

import './style.scss';
import Router from './router';
import LoginPage from './pages/LoginPage';


const router = new Router('#root');
router
	.use('/', LoginPage)
	.start();

/* const data: {[key: string]: Component|string} = {
	'/': login(),
	'/signup': signup(),
	'/profile': profile({readonly: true}),
	'/changeprofile': profile({readonly: false}),
	'/changepassword': profile({readonly: false, changepassword: true}),
	'/error': error({
		title: '500',
		content: 'Мы уже фиксим',
		links: [
			{href: '/chat', class1: '', label: 'Назад к чатам'},
		],
		
	}),
	'/error404': error({
		title: '404',
		content: 'Не туда попали',
		links: [
			{href: '/chat', class1: '', label: 'Назад к чатам'},
		],
	}),
	'/chat': main(),


};

const page: Component|string = data[window.location.pathname] || data['/error404'];
renderDOM('#root', page); */
