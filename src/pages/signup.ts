import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import InputBlock from '../components/inputBlock';
import Button from '../components/button';
import {regExp, errorMsg, Field} from '../utils/validationConst';

const fields: Field[] = [
	{
		type: 'email', name: 'email', label: 'Почта', autocomplete: 'email', 
		valid: regExp.email, errorMsg: errorMsg.email
	},
	{
		type: 'text', name: 'login', label: 'Логин', autocomplete: 'login', 
		valid: regExp.login, errorMsg: errorMsg.login
	},
	{
		type: 'text', name: 'first_name', label: 'Имя', autocomplete: 'first-name', 
		valid: regExp.name, errorMsg: errorMsg.name
	},
	{
		type: 'text', name: 'second_name', label: 'Фамилия', autocomplete: 'last-name', 
		valid: regExp.name, errorMsg: errorMsg.name
	},
	{
		type: 'tel', name: 'phone', label: 'Телефон', autocomplete: 'phone', 
		valid: regExp.phone, errorMsg: errorMsg.phone
	},
	{
		type: 'password', name: 'password', label: 'Пароль', 
		valid: regExp.password, errorMsg: errorMsg.password
	},
	{
		type: 'password', name: 'confirm_password', label: 'Пароль ещё раз', 
		valid: regExp.password, errorMsg: errorMsg.confirm_password
	},
];

const inputArr: Input[] = fields.map(({type, name, autocomplete})=>{
	return new Input(
		'input', 
		{attr: {type, id: name, name, placeholder: ' ', autocomplete}}
		);
});

const inputBlockArr: InputBlock[] = fields.map(({name, label, valid, errorMsg}, i)=>{
	const fieldvalid = (name==='confirm_password') ? function(){
		return (<HTMLInputElement> inputArr[5]._element).value===(<HTMLInputElement> inputArr[6]._element).value;
	} : valid;

	return new InputBlock(
		'div', 
		{name, label, input: inputArr[i], valid: fieldvalid, fieldErrorMsg: errorMsg}
		);
});

const inputObj: {[key: string|symbol]: InputBlock} = fields.reduce((obj: {[key:string|symbol]: InputBlock}, field, i)=>{
	obj[field.name] = inputBlockArr[i];
	return obj;
}, {});

const inputs: List = new List('div', inputObj);
const button: Button = new Button('button',{attr: {type: 'submit', name: 'Sign up', class: ''}, label: 'Зарегистрироваться'});

export default function signup(){

	return new Form(
		'main', 
		{
			formClass: 'form',
			titleClass: 'form__title',
			title: 'Регистрация',
			inputs,
			button,
			links: [
				{href: '/', class1: '', label: 'Войти'},
			],
			request: {
				url: '/auth/signup',
				options: {
					method: 'post'
				},
				resolve: (resp: string)=>{
					console.log('resp='+typeof resp, resp);
				},
				reject: (err: Error)=>{
					console.log('err='+typeof err, err);
				}
			}
		},
		'container-form-signup'
	);
}