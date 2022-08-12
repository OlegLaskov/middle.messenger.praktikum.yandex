import List from '../components/list';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import Link from '../components/link';
import userApi from '../api/user-api';
import store from '../utils/store';
import InputList from '../components/list/input-list';
import ProfileForm from '../components/form/profile-form';
import Component from '../utils/component';
import Router from '../router';

export type User = {
	"id": number,
	"first_name": string,
	"second_name": string,
	"display_name": string|null,
	"login": string,
	"email": string,
	"phone": string,
	"avatar": string|null
}

export default class ProfilePage extends List {
	router = new Router('#root');
	constructor(tag = 'div', props: {readonly: boolean, user?: User} 
		= {readonly:true}) {

		console.log('ProfilePage', props);
			
		const {readonly, user} = props;

		const {email, login, first_name, second_name, display_name, phone} = user || {};
		
		const classAvatar: string = readonly ? 'avatar avatar__changable' : 'avatar';

		const avatarProps: {[key: string]: string} = readonly ? {changephoto: 'changephoto'} : {};
		const avatar: Avatar = new Avatar(
			'div',
			avatarProps,
			classAvatar
		);
		
		const fields: Field[] = [
				{type: 'text', label: 'Почта', name: 'email', value: email || '', 
					valid: REG_EXP.EMAIL, errorMsg: ERROR_MSG.EMAIL, autofocus: true},
				{type: 'text', label: 'Логин', name: 'login', value: login || '', 
					valid: REG_EXP.LOGIN, errorMsg: ERROR_MSG.LOGIN},
				{type: 'text', label: 'Имя', name: 'first_name', value: first_name || '', 
					valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Фамилия', name: 'second_name', value: second_name || '', 
					valid: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Имя в чате', name: 'display_name', value: display_name || '', 
					valid: REG_EXP.DISPLAY_NAME, errorMsg: ERROR_MSG.DISPLAY_NAME},
				{type: 'text', label: 'Телефон', name: 'phone', value: phone || '', 
					valid: REG_EXP.PHONE, errorMsg: ERROR_MSG.PHONE},
			];
		
		const inputObj = fields.reduce((obj: {[key:string|symbol]: Field}, field, i)=>{
			obj[field.name] = field;
			return obj;
		}, {});

		const inputs: List = new InputList('div', {children: inputObj, readonly, user});
	
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
		
		const form: Component = new ProfileForm(
			'main', 
			{
				containerClass: 'container-profile',
				formClass: 'profile',
				titleClass: 'form__title',
				avatar,
				title: readonly ? first_name : null,
				inputs,
				button,
				link,
				user,
				request: {
					f_submit: userApi.changeProfile,
					resolve: (resp: string)=>{
						console.log('resp='+typeof resp, resp);
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
			'body'
		);
		
		const leftnav: LeftNav = new LeftNav('nav', {href: PATH.CHAT});
	
		super(
			'div', 
			{
				first: leftnav,
				second: form,
				user
			},
			'body'
		)
	}

/* 	componentDidMount(): void {
		store.set('userLoading', true);
		userApi.getUser()
			.then((user)=>{
				if(user && typeof user === 'string'){
					user = JSON.parse(user);
					store.set('user', user);
					store.set('userLoading', false);
					console.log('user=', user);
				}
			})
			.catch((e)=>{
				console.log(e);
				store.set('userLoading', false);
			});
		
	}
 */	
}