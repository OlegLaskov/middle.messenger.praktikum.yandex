import ProfileForm from '../components/form/profile-form';
import Input from '../components/input';
import List from '../components/list';
import LineInput from '../components/lineinput';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import userApi from '../api/user-api';
import Router from '../router';
import { User } from '../core/types';
import Form from '../components/form';

export default class ChangePassword extends List {
	router = new Router('#root');
	constructor(props: {user?: User} = {}) {

		const classAvatar = 'avatar',
			avatarProps = {},
			avatar = new Avatar(
				avatarProps,
				'div',
				classAvatar
			),
		
			passwordInput = new Input({attr: {
				type: 'password', 
				name: 'oldPassword', 
				value: '', 
				autocomplete: 'password'
			}}, undefined, 'form__input form__input__right'),
			passwordBlock = new LineInput({
				input: passwordInput,
				label: 'Старый\u00A0пароль', 
				validationRegexpOrFunc: REG_EXP.PASSWORD, 
				fieldErrorMsg: ERROR_MSG.PASSWORD, 
			}, 'div'),
			newPasswordInput = new Input({attr: {
				type: 'password', 
				name: 'newPassword', 
				value: ''
			}}, undefined, 'form__input form__input__right'),
			newPasswordBlock = new LineInput({
				input: newPasswordInput,
				label: 'Новый\u00A0пароль', 
				validationRegexpOrFunc: REG_EXP.PASSWORD, 
				fieldErrorMsg: ERROR_MSG.PASSWORD
			}),
			confirmPasswordInput = new Input({attr: {
				type: 'password', 
				name: 'confirmPassword', 
				value: ''
			}}, undefined, 'form__input form__input__right'),
			confirmPasswordBlock = new LineInput({
				input: confirmPasswordInput,
				label: 'Повторите\u00A0новый\u00A0пароль', 
				validationRegexpOrFunc: ()=>(
					(<HTMLInputElement> newPasswordInput.element).value === (<HTMLInputElement> 
					confirmPasswordInput.element).value), 
				fieldErrorMsg: ERROR_MSG.CONFIRM_NEW_PASSWORD
			}),
			loginInput = new Input({attr: {
				type: 'hidden', 
				name: 'login', 
				value: props?.user?.login
			}}),

			inputs = new List({
				passwordBlock,
				newPasswordBlock,
				confirmPasswordBlock,
				loginInput
			}),
	
			button = new Button(
				{attr: {type: 'submit', name: 'save'}, label: 'Сохранить'},
				'button', 
				'form__button form__button__w250'
			),
	
			form = new ProfileForm(
				{
					formClass: 'profile',
					titleClass: 'form__title',
					avatar,
					title: null,
					inputs,
					button,
					request: {
						f_submit: userApi.changePassword,
						resolve: (resp: string)=>{
							if(resp === 'OK'){
								alert('Пароль успешно изменен');
								this.router.go(PATH.PROFILE);
								return;
							}
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
				'div', 
				'container-profile'
			),
		
			leftnav = new LeftNav({href: PATH.CHAT}, 'nav');
	
		super(
			{
				first: leftnav,
				second: form
			},
			'div', 
			'body'
		);
	}
	hide(): void {
		this.getContent().style.display = "none";
		this.isShow = false;
		(<Form> this.children.second).clearForm();
	}

}