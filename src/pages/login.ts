import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import InputBlock from '../components/inputBlock';
import Button from '../components/button';
import {regExp, errorMsg} from '../utils/validationConst';

const fields = [
	{
		type: 'text', name: 'login', label: 'Логин', autocomplete: 'login', 
		valid: regExp.login, errorMsg: errorMsg.login
	},
	{
		type: 'password', name: 'password', label: 'Пароль', autocomplete: 'current-password', 
		valid: regExp.password, errorMsg: errorMsg.password
	},
];

const inputArr = fields.map(({type, name, autocomplete})=>{
	return new Input('input', {attr: {type, id: name, name, placeholder: ' ', autocomplete}});
});
const inputBlockArr = fields.map(({name, label, valid, errorMsg}, i)=>{
	return new InputBlock('div', {name, label, input: inputArr[i], valid, fieldErrorMsg: errorMsg});
});
const inputObj = fields.reduce((obj: {[key:string|symbol]: any}, field, i)=>{
	obj[field.name] = inputBlockArr[i];
	return obj;
}, {});

const inputs = new List('div', inputObj);
const button = new Button('button', {attr: {type: 'submit', name: 'Sign in', class: ''}, label: 'Войти'});

export default function login(){
	
	return new Form(
		'main', 
		{
			formClass: 'form',
			titleClass: 'form__title',
			title: 'Вход',
			inputs,
			button,
			links: [
				{href: '/signup', class1: '', label: 'Нет аккаунта?'},
			],
			request: {
				url: '/auth/signin',
				options: {
					method: 'post'
				},
				resolve: (resp: string)=>{
					console.log('resp='+typeof resp, resp);
					if(resp.toUpperCase() === 'OK'){
						// Авторизован -> redirect to Main Page
					} else {
						const res = JSON.parse(resp);
						console.log('res', res, this);
					}
				},
				reject: (err: Error)=>{
					console.log('err='+typeof err, err);
				}
			}
		},
		'container-form-login'
	);
}