import Component from '../utils/component';
import ProfileForm from '../components/form/profile-form';
import Input from '../components/input';
import List from '../components/list';
import LineInput from '../components/lineinput';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field, FieldBlock} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import userApi from '../api/user-api';
import { User } from './ProfilePage';
import Router from '../router';

export default class ChangePassword extends List {
	router = new Router('#root');
	constructor(tag = 'div', props: {user?: User} = {}) {

		const classAvatar = 'avatar';
		const avatarProps = {};
		const avatar: Avatar = new Avatar(
			'div',
			avatarProps,
			classAvatar
		);
		
		const fields: Field[] = [
				{type: 'password', label: 'Старый\u00A0пароль', name: 'oldPassword', value: '', 
				valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.PASSWORD, autocomplete: 'current-password'},
				{type: 'password', label: 'Новый\u00A0пароль', name: 'newPassword', value: '', 
				valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.PASSWORD},
				{type: 'password', label: 'Повторите\u00A0новый\u00A0пароль', name: 'confirmPassword', 
				value: '', valid: REG_EXP.PASSWORD, errorMsg: ERROR_MSG.CONFIRM_NEW_PASSWORD},
				{type: 'hidden', name: 'login', value: props?.user?.login, autocomplete: 'login'},
			];
		
		const inputArr: Input[] = fields.map(({type, name, value, autocomplete}, i: number)=>{
			return new Input(
				'input', 
				{attr: {type, id: name, name, value, autocomplete, autofocus: (i===0)}},
				'form__input input__right'
				);
		});
		
		const lineInputArr: Input[]|LineInput[] = fields.map(({type, label, name, valid, errorMsg}, i)=>{
			const lineinput: FieldBlock = {label, input: inputArr[i]};
	
			const fieldvalid = (name==='confirm_password') ? function(){
				return (<HTMLInputElement> inputArr[1].element).value === (<HTMLInputElement> 
					inputArr[2].element).value;
			} : valid;
			lineinput.valid = fieldvalid; 
			lineinput.fieldErrorMsg =  errorMsg;
	
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
	
		const button: Button|null = new Button(
				'button', 
				{attr: {type: 'submit', name: 'save'}, label: 'Сохранить'},
				'form__button form__button__w250'
			);
	
		const link = null;
		
		const form: Component = new ProfileForm(
			'main', 
			{
				formClass: 'profile',
				titleClass: 'form__title',
				avatar,
				title: null,
				inputs,
				button,
				link,
				request: {
					f_submit: userApi.changePassword,
					resolve: (resp: string)=>{
						const res = JSON.parse(resp);
						const {reason} = res;
						if(reason){
							form.setProps({...form.props, errorMsg: reason});
						} else {
							this.router.go(PATH.PROFILE);
						}
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
						this.setProps({...this.props, errorMsg: 'Server error'});
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
}