import form from './pages/form.hbs';
import error from './pages/error.hbs';
import chat from './pages/chat.hbs';
import profile from './pages/profile.hbs';
import profileedit from './pages/profileedit.hbs';
import './style.scss';
import avatar from './components/avatar';
import input from './components/input';
import button from './components/button';
import link from './components/link';
import lineinput from './components/lineinput';
import leftnav from './components/leftnav';

const data = {
	'/': form({
		title: 'Вход',
		action: 'error',
		inputs: [
			{type: 'text', name: 'login', placeholder: ' ', class1: '', label: 'Логин'},
			{type: 'password', name: 'password', placeholder: ' ', class1: '', label: 'Пароль'},
		],
		buttons: [
			{type: 'submit', name: 'Sign in', class1: '', label: 'Войти'},
		],
		links: [
			{href: '/signup', class1: '', label: 'Нет аккаунта?'},
		],
	}),
	'/signup': form({
		title: 'Регистрация',
		action: 'profile',
		inputs: [
			{type: 'email', name: 'email', placeholder: ' ', class1: '', label: 'Почта'},
			{type: 'text', name: 'login', placeholder: ' ', class1: '', label: 'Логин'},
			{type: 'text', name: 'first_name', placeholder: ' ', class1: '', label: 'Имя'},
			{type: 'text', name: 'second_name', placeholder: ' ', class1: '', label: 'Фамилия'},
			{type: 'tel', name: 'phone', placeholder: ' ', class1: '', label: 'Телефон'},
			{type: 'password', name: 'password', placeholder: ' ', class1: '', label: 'Пароль'},
			{type: 'password', name: 'confirm_password', placeholder: ' ', class1: '', label: 'Пароль ещё раз'},
		],
		buttons: [
			{type: 'submit', name: 'Sign up', class1: '', label: 'Зарегистрироваться'},
		],
		links: [
			{href: '/', class1: '', label: 'Войти'},
		],
	}),
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
	'/chat': chat(),

	'/profile': profile({
		avatarSrc: 'https://www.svgrepo.com/show/350357/image.svg',
		avatarAlt: 'Avatar',
		avatarClass: 'avatar__changable',
		name: 'Иван',
		fields: [
			{field: 'Почта', value: 'pochta@yandex.ru', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
			{field: 'Логин', value: 'ivanivanov', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
			{field: 'Имя', value: 'Иван', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
			{field: 'Фамилия', value: 'Иванов', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
			{field: 'Имя в чате', value: 'Иван', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
			{field: 'Телефон', value: '+7 (909) 967 30 30', class1: '', class2: '', class3: 'input__right', readonly: 'readonly'},
		],
		links: [
			{href: '/changeprofile', class0: 'link__to_left', class1: '', label: 'Изменить данные'},
			{href: '/changepassword', class0: 'link__to_left', class1: '', label: 'Изменить пароль'},
			{href: '/chat', class0: 'link__to_left', class1: 'color-red', label: 'Выйти'},
		],
	}),
	'/changeprofile': profileedit({
		avatarSrc: 'https://www.svgrepo.com/show/350357/image.svg',
		avatarAlt: 'Avatar',
		name: 'Иван',
		fields: [
			{field: 'Почта', value: 'pochta@yandex.ru', class1: '', class2: '', class3: 'input__right'},
			{field: 'Логин', value: 'ivanivanov', class1: '', class2: '', class3: 'input__right'},
			{field: 'Имя', value: 'Иван', class1: '', class2: '', class3: 'input__right'},
			{field: 'Фамилия', value: 'Иванов', class1: '', class2: '', class3: 'input__right'},
			{field: 'Имя в чате', value: 'Иван', class1: '', class2: '', class3: 'input__right'},
			{field: 'Телефон', value: '+7 (909) 967 30 30', class1: '', class2: '', class3: 'input__right'},
		],
		buttons: [
			{type: 'submit', name: 'save', class1: 'form__button__w250', label: 'Сохранить'},
		],
	}),
};

document.getElementById('root').innerHTML = data[window.location.pathname] || data['/error404'];
