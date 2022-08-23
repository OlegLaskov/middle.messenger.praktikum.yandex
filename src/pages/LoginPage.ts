import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import InputBlock from '../components/inputBlock';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG} from '../utils/validationConst';
import Link from '../components/link';
import { PATH } from '../router/paths';
import Router from '../router';
import loginApi from '../api/login-api';
import store from '../core/store';
import { Field } from '../core/types';

const fields: Field[] = [
	{
		type: 'text', 
		name: 'login', 
		label: 'Логин', 
		autocomplete: 'login', 
		validationRegexpOrFunc: REG_EXP.LOGIN, 
		errorMsg: ERROR_MSG.LOGIN
	},
	{
		type: 'password', 
		name: 'password', 
		label: 'Пароль', 
		autocomplete: 'current-password', 
		validationRegexpOrFunc: REG_EXP.PASSWORD, 
		errorMsg: ERROR_MSG.PASSWORD
	},
];

const inputArr = fields.map(({type, name, autocomplete})=>{
	return new Input({attr: {type, id: name, name, placeholder: ' ', autocomplete}});
});
const inputBlockArr = fields.map(({name, label, validationRegexpOrFunc, errorMsg}, i)=>{
	return new InputBlock({name, label, input: inputArr[i], validationRegexpOrFunc, fieldErrorMsg: errorMsg});
});
const inputObj = fields.reduce((obj: {[key:string]: InputBlock}, field, i)=>{
	obj[field.name] = inputBlockArr[i];
	return obj;
}, {});

const inputs = new List(inputObj);
const button = new Button({attr: {type: 'submit', name: 'Sign in', class: ''}, label: 'Войти'});
const link = new Link({href: PATH.SIGNUP, label: 'Нет аккаунта?'});

export default class LoginPage extends Form {
	router = new Router('#root');
	constructor(){
		super(
			{
				containerClass: 'container-form-login',
				formClass: 'form',
				titleClass: 'form__title',
				title: 'Вход',
				inputs,
				button,
				link,
				request: {
					f_submit: loginApi.login,
					resolve: (resp: string)=>{
						if(resp.toUpperCase() === 'OK'){
							this.router.go(PATH.CHAT);
						} else {
							const res = JSON.parse(resp);
							const {reason} = res;
							this.setProps({...this.props, errorMsg: reason});
						}
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
						this.setProps({...this.props, errorMsg: 'Server error'});
					}
				}
			},
			'div',
			'body'
		);
	}
	componentDidMount(){
		loginApi.logout();
		const state = store.getState();
		if(state && Object.keys(state).length){
			store.clear();
		}
	}
	show(): void {
		this.getContent().style.display = "block";
		this.isShow = true;
		loginApi.logout();
		store.clear();
	}
}