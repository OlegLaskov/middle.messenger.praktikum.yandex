import Component from '../core/component';
import store from '../core/store';
import { connect, saveUserDataToStore } from '../core/HOC';
import List from '../components/list';
import Button from '../components/button';
import {REG_EXP, ERROR_MSG} from '../utils/validationConst';
import LeftNav from '../components/leftnav';
import Avatar from '../components/avatar';
import { PATH } from '../router/paths';
import Link from '../components/link';
import userApi from '../api/user-api';
import InputList from '../components/list/input-list';
import ProfileForm from '../components/form/profile-form';
import Router from '../router';
import Modal from '../components/modal';
import InputBlock from '../components/inputBlock';
import Form from '../components/form';
import { Field, FormWithFile, Indexed, User } from '../core/types';

export default class ProfilePage extends List {
	router = new Router('#root');
	constructor(props: {readonly: boolean, user?: User} 
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
			avatarProps,
			'div',
			classAvatar
		);
		
		const fields: Field[] = [
				{type: 'text', label: 'Почта', name: 'email', value: email || '', 
					validationRegexpOrFunc: REG_EXP.EMAIL, errorMsg: ERROR_MSG.EMAIL, autofocus: true},
				{type: 'text', label: 'Логин', name: 'login', value: login || '', 
					validationRegexpOrFunc: REG_EXP.LOGIN, errorMsg: ERROR_MSG.LOGIN},
				{type: 'text', label: 'Имя', name: 'first_name', value: first_name || '', 
					validationRegexpOrFunc: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Фамилия', name: 'second_name', value: second_name || '', 
					validationRegexpOrFunc: REG_EXP.NAME, errorMsg: ERROR_MSG.NAME},
				{type: 'text', label: 'Имя в чате', name: 'display_name', value: display_name || '', 
					validationRegexpOrFunc: REG_EXP.DISPLAY_NAME, errorMsg: ERROR_MSG.DISPLAY_NAME},
				{type: 'text', label: 'Телефон', name: 'phone', value: phone || '', 
					validationRegexpOrFunc: REG_EXP.PHONE, errorMsg: ERROR_MSG.PHONE},
			];
		
		const inputObj = fields.reduce((obj: {[key:string|symbol]: Field}, field)=>{
			obj[field.name] = field;
			return obj;
		}, {});

		const inputs: List = new InputList({children: inputObj, readonly, user}, 'div');
	
		const button: Button|null = readonly ? null 
			: new Button(
				{attr: {type: 'submit', name: 'save'}, label: 'Сохранить'},
				'button', 
				'form__button form__button__w250'
			);
	
		const link = readonly ? new List(
				{
					changeprofile: new Link(
						{href: PATH.EDIT_PROFILE, class1: '', label: 'Изменить данные'},
						undefined,
						'link__group link__to_left'
						),
					changepass: new Link(
						{href: PATH.CHANGE_PASSWORD, class1: '', label: 'Изменить пароль'},
						undefined,
						'link__group link__to_left'
					),
					exit: new Link(
						{href: PATH.LOGIN, class1: 'color-red', label: 'Выйти'},
						undefined,
						'link__group link__to_left'
					)
				}
			)
			: null;
		
		const form: Component = new ProfileForm(
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
			'div', 
			'body'
		);
		
		const leftnav = new LeftNav({href: PATH.CHAT}, 'nav');

		const avatarName = 'avatar';
		const imgInput = new InputBlock(
			{
				input: {attr: {type: 'file', accept:"image/*", name: avatarName, id: avatarName}},
				name: avatarName,
				label: 'Аватар',
				validationRegexpOrFunc: REG_EXP.NO_EMPTY, 
				fieldErrorMsg: 'Нужно выбрать файл'
			}
		);
		const changeAvatarBtn = new Button(
			{
				label: 'Поменять',
				attr: {type: 'submit', id: 'changeAvatarBtn'}
			});

		const changeAvatarForm = new Form(
			{
				title: 'Загрузить файл',
				inputs: new List({imgInput}),
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
			undefined,
			'modal__dialog');
		
		const changeAvatarModal = new Modal(
			{
				form: changeAvatarForm
			},
			undefined,
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
			{
				first: leftnav,
				second: form,
				changeAvatarModal,
				user,
				events
			},
			'div', 
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

	show(): void {
		saveUserDataToStore();
		this.getContent().style.display = "block";
		this.isShow = true;
	}
}