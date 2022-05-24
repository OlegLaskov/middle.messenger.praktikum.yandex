import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import InputBlock from '../components/inputBlock';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field} from '../utils/validationConst';

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
		'input', 
		{attr: {type, id: name, name, placeholder: ' ', autocomplete}}
		);
});

const inputBlockArr: InputBlock[] = fields.map(({name, label, valid, errorMsg}, i)=>{
	const fieldvalid = (name==='confirm_password') ? function(){
		return (<HTMLInputElement> inputArr[5].element).value === (<HTMLInputElement> inputArr[6].element).value;
	} : valid;

	return new InputBlock(
		'div', 
		{name, label, input: inputArr[i], valid: fieldvalid, fieldErrorMsg: errorMsg}
		);
});

const inputObj: {[key: string|symbol]: InputBlock} = fields.reduce(
	(obj: {[key:string|symbol]: InputBlock}, field, i) => {
	obj[field.name] = inputBlockArr[i];
	return obj;
}, {});

const inputs: List = new List('div', inputObj);
const button: Button = new Button(
	'button', 
	{attr: {type: 'submit', name: 'Sign up', class: ''}, 
	label: 'Зарегистрироваться'}
);

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