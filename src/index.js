import {default as renderDOM} from './utils/render';
import login from './pages/login';
import signup from './pages/signup';
import profile from './pages/profile';
import error from './pages/error.hbs';
import chat from './pages/chat.hbs';
import './style.scss';
import link from './components/link';
import main from './pages/main';

const data = {
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

const page = data[window.location.pathname] || data['/error404'];
renderDOM('#root', page);
