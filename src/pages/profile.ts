import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import LineInput from '../components/lineinput';
import Button from '../components/button';
import {regExp, errorMsg, Field, FieldBlock} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import Component from '../utils/component';

export default function profile({readonly = true, changepassword = false}: {readonly: boolean, changepassword?: boolean}): Component{

	const classAvatar: string = readonly ? 'avatar avatar__changable' : 'avatar';

	const avatarProps: {[key: string]: string} = readonly ? {changephoto: 'changephoto'} : {};
	const avatar: Avatar = new Avatar(
		'div',
		avatarProps,
		classAvatar
	);
	
	const fields: Field[] = changepassword ?
		[
			{type: 'password', label: 'Старый\u00A0пароль', name: 'current_password', value: '', 
			valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'current-password'},
			{type: 'password', label: 'Новый\u00A0пароль', name: 'new_password', value: '', 
			valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'new-password'},
			{type: 'password', label: 'Повторите\u00A0новый\u00A0пароль', name: 'confirm_password', 
			value: '', valid: regExp.password, errorMsg: errorMsg.password, autocomplete: 'new-password'},
			{type: 'hidden', name: 'login', value: 'ivanivanov', autocomplete: 'login'},
		]
		: [
			{type: 'text', label: 'Почта', name: 'email', value: 'pochta@yandex.ru', valid: regExp.email, errorMsg: errorMsg.email},
			{type: 'text', label: 'Логин', name: 'login', value: 'ivanivanov', valid: regExp.login, errorMsg: errorMsg.login},
			{type: 'text', label: 'Имя', name: 'first_name', value: 'Иван', valid: regExp.name, errorMsg: errorMsg.name},
			{type: 'text', label: 'Фамилия', name: 'second_name', value: 'Иванов', valid: regExp.name, errorMsg: errorMsg.name},
			{type: 'text', label: 'Имя в чате', name: 'display_name', value: 'Иван', valid: regExp.display_name, errorMsg: errorMsg.display_name},
			{type: 'text', label: 'Телефон', name: 'phone', value: '+7 909 967 3030', valid: regExp.phone, errorMsg: errorMsg.phone},
		];
	
	const inputArr: Input[] = fields.map(({type, name, value, autocomplete}, i: number)=>{
		return new Input(
			'input', 
			{attr: {type, id: name, name, value, readonly, autocomplete, autofocus: i===0}},
			'form__input input__right'
			);
	});
	
	const lineInputArr: Input[]|LineInput[] = fields.map(({type, label, name, valid, errorMsg}, i)=>{
		const lineinput: FieldBlock = {label, input: inputArr[i]};

		if(!readonly){
			const fieldvalid = (name==='confirm_password') ? function(){
				return (<HTMLInputElement> inputArr[1]._element).value === (<HTMLInputElement> inputArr[2]._element).value;
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
	
	const inputObj: {[key: string|symbol]: Input|LineInput} = fields.reduce((obj: {[key:string|symbol]: Input|LineInput}, field, i)=>{
		obj[field.name] = lineInputArr[i];
		return obj;
	}, {});
	
	const inputs: List = new List('div', inputObj);

	const button: Button|null = readonly ? null 
		: new Button(
			'button', 
			{attr: {type: 'submit', name: 'save'}, label: 'Сохранить'},
			'form__button form__button__w250'
		);

	const links: {[key: string]: string}[]|null = readonly ? [
			{href: '/changeprofile', class0: 'link__to_left', class1: '', label: 'Изменить данные'},
			{href: '/changepassword', class0: 'link__to_left', class1: '', label: 'Изменить пароль'},
			{href: '/', class0: 'link__to_left', class1: 'color-red', label: 'Выйти'},
		] : null;
	
	const form: Form = new Form(
		'main', 
		{
			formClass: 'profile',
			titleClass: 'form__title',
			avatar,
			title: readonly ? 'Иван' : null,
			inputs,
			button,
			links,
			request: {
				url: '/user/profile',
				options: {
					method: 'put'
				},
				resolve: (resp: string)=>{
					console.log('resp='+typeof resp, resp);
				},
				reject: (err: Error)=>{
					console.log('err='+typeof err, err);
				}
			}
		},
		'container-profile'
	);
	
	const leftnav: LeftNav = new LeftNav();

	return new List(
		'div', 
		{
			first: leftnav,
			second: form
		},
		'body'
	);
}