import List from '../components/list';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG, Field} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import Link from '../components/link';
import userApi, { FormWithFile } from '../api/user-api';
import InputList from '../components/list/input-list';
import ProfileForm from '../components/form/profile-form';
import Component from '../utils/component';
import Router from '../router';
import Modal from '../components/modal';
import InputBlock from '../components/inputBlock';
import Form from '../components/form';
import store, { Indexed } from '../utils/store';
import { connect } from '../utils/HOC';

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

		const {readonly, user} = props;

		const {email, login, first_name, second_name, display_name, phone} = user || {};
		
		const classAvatar = readonly ? 'avatar avatar__changable' : 'avatar';

		const avatarProps = readonly ? {changephoto: 'changephoto'} : {};
		const mapStateToProps = (state: Indexed<unknown>)=>{
			let avatar = (<User> state?.user)?.avatar;
			avatar && (avatar = 'https://ya-praktikum.tech/api/v2/resources/' + avatar);
			return {
				avatar
			}
		}
		const ConnectedAvatar = connect(Avatar, mapStateToProps);
		const avatar = new ConnectedAvatar(
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
		
		const inputObj = fields.reduce((obj: {[key:string|symbol]: Field}, field)=>{
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
		
		const leftnav = new LeftNav('nav', {href: PATH.CHAT});

		const avatarName = 'avatar';
		const imgInput = new InputBlock(
			undefined,
			{
				input: {attr: {type: 'file', accept:"image/*", name: avatarName, id: avatarName}},
				name: avatarName,
				label: 'Аватар',
				valid: REG_EXP.NO_EMPTY, 
				fieldErrorMsg: 'Нужно выбрать файл'
			}
		);
		const changeAvatarBtn = new Button(undefined,
			{
				label: 'Поменять',
				attr: {type: 'submit', id: 'changeAvatarBtn'}
			});

		const changeAvatarForm = new Form(undefined,
			{
				// formClass: 'form',
				title: 'Загрузить файл',
				inputs: new List(undefined, {imgInput}),
				button: changeAvatarBtn,
				request: {
					f_submit: (form: FormWithFile)=>{
						this.toggleChangeAvatarModal(false); 
						return userApi.changeAvatar(form);
					},
					resolve: (resp: string)=>{
						const user = JSON.parse(resp);
						store.set('user', user);
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
						this.setProps({...this.props, errorMsg: 'Server error'});
					}
				}
			},
			'modal__dialog');
		
		const changeAvatarModal = new Modal(
			undefined,
			{
				form: changeAvatarForm
			},
			'modal'
		);

		const events = {click: (event: PointerEvent)=>{
			const id = (<HTMLBodyElement> event.target).id;
			if(id === 'avatarDiv' || id === 'avatarImg'){
				this.toggleChangeAvatarModal(true);
			} else if(id === 'modal'){
				this.toggleChangeAvatarModal(false);
			}
		}};
	
		super(
			'div', 
			{
				first: leftnav,
				second: form,
				changeAvatarModal,
				user,
				events
			},
			'body'
		)
	}

	toggleChangeAvatarModal = (mode: boolean) =>{
		const changeAvatarModal = this.children.changeAvatarModal;
		if(mode){
			changeAvatarModal.show();
		} else if(mode === false){
			changeAvatarModal.hide();
		} else {
			changeAvatarModal.isShow ? changeAvatarModal.hide() : changeAvatarModal.show();
		}
	}
}