import Form from '../components/form';
import Input from '../components/input';
import List from '../components/list';
import LineInput from '../components/lineinput';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field, FieldBlock} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import Link from '../components/link';
import userApi from '../api/user-api';
import { User } from './ProfilePage';

export default class ProfilePage extends List {
	constructor(props: {readonly: boolean, changepassword: boolean, user?: User} 
		= {readonly:true, changepassword:false}) {

		const {readonly, changepassword} = props;
		
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
				valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.PASSWORD, autocomplete: 'current-password'},
				{type: 'password', label: 'Новый\u00A0пароль', name: 'new_password', value: '', 
				valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.PASSWORD},
				{type: 'password', label: 'Повторите\u00A0новый\u00A0пароль', name: 'confirm_password', 
				value: '', valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.CONFIRM_NEW_PASSWORD},
				{type: 'hidden', name: 'login', value: 'ivanivanov', autocomplete: 'login'},
			]
			: [
				{type: 'text', label: 'Почта', name: 'email', value: 'pochta@yandex.ru', 
					valid: REG_EXP.EMAIL, errorMsg: ERROR_MSG.EMAIL},
				{type: 'text', label: 'Логин', name: 'login', value: 'ivanivanov', 
					valid: REG_EXP.LOGIN, errorMsg: ERROR_MSG.LOGIN},
				{type: 'text', label: 'Имя', name: 'first_name', value: 'Иван', 
					valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Фамилия', name: 'second_name', value: 'Иванов', 
					valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Имя в чате', name: 'display_name', value: 'Иван', 
					valid: REG_EXP.DISPLAY_NAME, errorMsg: ERROR_MSG.DISPLAY_NAME},
				{type: 'text', label: 'Телефон', name: 'phone', value: '+7 909 967 3030', 
					valid: REG_EXP.PHONE, errorMsg: ERROR_MSG.PHONE},
			];
		
		const inputArr: Input[] = fields.map(({type, name, value, autocomplete}, i: number)=>{
			return new Input(
				'input', 
				{attr: {type, id: name, name, value, readonly, autocomplete, autofocus: (!readonly && i===0)}},
				'form__input input__right'
				);
		});
		
		const lineInputArr: Input[]|LineInput[] = fields.map(({type, label, name, valid, errorMsg}, i)=>{
			const lineinput: FieldBlock = {label, input: inputArr[i]};
	
			if(!readonly){
				const fieldvalid = (name==='confirm_password') ? function(){
					return (<HTMLInputElement> inputArr[1].element).value === (<HTMLInputElement> 
						inputArr[2].element).value;
				} : valid;
				lineinput.valid = fieldvalid; 
				lineinput.fieldErrorMsg =  errorMsg;
			}
	
			return type === 'hidden' ? inputArr[i]
				: new LineInput(
					'div', 
					lineinput
				);
		});
		
		const inputObj: {[key: string|symbol]: Input|LineInput} = fields.reduce(
			(obj: {[key:string|symbol]: Input|LineInput}, field, i) => {
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
	
		const link = readonly ? new List(
				'div',
				{
					changeprofile: new Link(
						undefined,
						{href: PATH.EDIT_PROFILE, class1: '', label: 'Изменить данные'},
						'link__group link__to_left'
						),
					changepass: new Link(
						undefined,
						{href: PATH.CHANGE_PASSWORD, class1: '', label: 'Изменить пароль'},
						'link__group link__to_left'
					),
					exit: new Link(
						undefined,
						{href: PATH.LOGIN, class1: 'color-red', label: 'Выйти'},
						'link__group link__to_left'
					)
				}
			)
			: null;
		
		const form: Form = new Form(
			'main', 
			{
				formClass: 'profile',
				titleClass: 'form__title',
				avatar,
				title: readonly ? 'Иван' : null,
				inputs,
				button,
				link,
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
		
		const leftnav: LeftNav = new LeftNav('nav', {href: PATH.CHAT});
	
		super(
			'div', 
			{
				first: leftnav,
				second: form
			},
			'body'
		)
	}

	componentDidMount(): void {
		userApi.getUser()
			.then((user)=>{
				console.log('user=', user);
				
			})
			.catch((e)=>{
				console.log(e);
				
			})
	}
}