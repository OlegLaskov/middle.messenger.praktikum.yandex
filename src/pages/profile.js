import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import LineInput from '../components/lineinput';
import Button from '../components/button';
import {regExp, errorMsg} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';


export default function profile({readonly = true, changepassword = false} = {}){

	const classAvatar = readonly ? 'avatar avatar__changable' : 'avatar';

	const avatarProps = readonly ? {changephoto: 'changephoto'} : {};
	const avatar = new Avatar(
		'div',
		avatarProps,
		classAvatar
	);
	
	const fields = changepassword ?
		[
			{type: 'password', label: 'Старый\u00A0пароль', name: 'current_password', value: '', 
			valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'current-password'},
			{type: 'password', label: 'Новый\u00A0пароль', name: 'new_password', value: '', 
			valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'new-password'},
			{type: 'password', label: 'Повторите\u00A0новый\u00A0пароль', name: 'confirm_password', 
			value: '', valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'new-password'},
			{type: 'hidden', name: 'login', value: 'ivanivanov', autocomplete: 'login', valid: null},
		]
		: [
			{type: 'text', label: 'Почта', name: 'email', value: 'pochta@yandex.ru', valid: regExp.email, errorMsg: errorMsg.email},
			{type: 'text', label: 'Логин', name: 'login', value: 'ivanivanov', valid: regExp.login, errorMsg: errorMsg.login},
			{type: 'text', label: 'Имя', name: 'first_name', value: 'Иван', valid: regExp.name, errorMsg: errorMsg.name},
			{type: 'text', label: 'Фамилия', name: 'second_name', value: 'Иванов', valid: regExp.name, errorMsg: errorMsg.name},
			{type: 'text', label: 'Имя в чате', name: 'display_name', value: 'Иван', valid: regExp.display_name, errorMsg: errorMsg.display_name},
			{type: 'text', label: 'Телефон', name: 'phone', value: '+7 909 967 3030', valid: regExp.phone, errorMsg: errorMsg.phone},
		];
	
	const inputArr = fields.map(({type, name, value, autocomplete}, i)=>{
		return new Input(
			'input', 
			{attr: {type, id: name, name, value, readonly, autocomplete, autofocus: i===0}},
			'form__input input__right'
			);
	});
	
	const lineInputArr = fields.map(({type, label, name, valid, errorMsg}, i)=>{
		let lineinput = {label, input: inputArr[i]};

		if(!readonly){
			const fieldvalid = (name==='confirm_password') ? function(){
				return inputArr[1]._element.value===inputArr[2]._element.value;
			} : valid;
			lineinput.valid = fieldvalid; 
			lineinput.fieldErrorMsg = errorMsg;
		}

		return type === 'hidden' ? inputArr[i]
			: new LineInput(
				'div', 
				lineinput
			);
	});
	
	const inputObj = fields.reduce((obj, field, i)=>{
		obj[field.name] = lineInputArr[i];
		return obj;
	}, {});
	
	const inputs = new List('div', inputObj);

	const button = readonly ? null 
		: new Button(
			'button', 
			{attr: {type: 'submit', name: 'save'}, label: 'Сохранить'},
			'form__button form__button__w250'
		);

	const links = readonly ? [
			{href: '/changeprofile', class0: 'link__to_left', class1: '', label: 'Изменить данные'},
			{href: '/changepassword', class0: 'link__to_left', class1: '', label: 'Изменить пароль'},
			{href: '/login', class0: 'link__to_left', class1: 'color-red', label: 'Выйти'},
		] : null;
	
	const form = new Form(
		'main', 
		{
			formClass: 'profile',
			titleClass: 'form__title',
			avatar,
			title: readonly ? 'Иван' : null,
			inputs,
			button,
			links,
		},
		'container-profile'
	);
	
	const leftnav = new LeftNav();

	return new List(
		'div', 
		{
			first: leftnav,
			second: form
		},
		'body'
	);
}