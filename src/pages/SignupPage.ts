import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import InputBlock from '../components/inputBlock';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field} from '../utils/validationConst';
import Link from '../components/link';
import { PATH } from '../router/paths';
import Router from '../router';
import signupApi from '../api/signup-api';
import { ValidFunction } from '../core/types';

const fields: Field[] = [
	{
		type: 'email', name: 'email', label: 'Почта', autocomplete: 'email', 
		valid: REG_EXP.EMAIL, errorMsg: ERROR_MSG.EMAIL
	},
	{
		type: 'text', name: 'login', label: 'Логин', autocomplete: 'login', 
		valid: REG_EXP.LOGIN, errorMsg: ERROR_MSG.LOGIN
	},
	{
		type: 'text', name: 'first_name', label: 'Имя', autocomplete: 'first-name', 
		valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME
	},
	{
		type: 'text', name: 'second_name', label: 'Фамилия', autocomplete: 'last-name', 
		valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME
	},
	{
		type: 'tel', name: 'phone', label: 'Телефон', autocomplete: 'phone', 
		valid: REG_EXP.PHONE, errorMsg: ERROR_MSG.PHONE
	},
	{
		type: 'password', name: 'password', label: 'Пароль', 
		valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.PASSWORD
	},
	{
		type: 'password', name: 'confirm_password', label: 'Пароль ещё раз', 
		valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.CONFIRM_PASSWORD
	},
];

const inputArr: Input[] = fields.map(({type, name, autocomplete})=>{
	return new Input(
		{attr: {type, id: name, name, placeholder: ' ', autocomplete}},
		'input'
		);
});

const inputBlockArr: InputBlock[] = fields.map(({name, label, valid, errorMsg}, i)=>{
	const fieldvalid: ValidFunction|RegExp|undefined = (name==='confirm_password') ? function(){
		return (<HTMLInputElement> inputArr[5].element).value === (<HTMLInputElement> inputArr[6].element).value;
	} : valid;

	return new InputBlock(
		{name, label, input: inputArr[i], valid: fieldvalid, fieldErrorMsg: errorMsg},
		'div'
		);
});

const inputObj: {[key: string|symbol]: InputBlock} = fields.reduce(
	(obj: {[key:string|symbol]: InputBlock}, field, i) => {
	obj[field.name] = inputBlockArr[i];
	return obj;
}, {});

const inputs: List = new List(inputObj, 'div');
const button: Button = new Button(
	{attr: {type: 'submit', name: 'Sign up', class: ''}, 
	label: 'Зарегистрироваться'},
	'button'
);
const link = new Link({href: PATH.LOGIN, label: 'Войти'}, 'div');

export default class SignupPage extends Form {
	router = new Router('#root');
	constructor(){
		super(
			{
				containerClass: 'container-form-signup',
				formClass: 'form',
				titleClass: 'form__title',
				title: 'Регистрация',
				inputs,
				button,
				link,
				request: {
					f_submit: signupApi.signup,
					resolve: ()=>{
						this.router.go(PATH.CHAT);
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
					}
				}
			},
			'div', 
			'body'
		)
	}
}