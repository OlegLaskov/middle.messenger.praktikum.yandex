import * as Handlebars from 'handlebars';
import Input from '../components/input';
import List from '../components/list';
import Label from '../components/label';
import { PATH } from '../router/paths';
import ChatList from '../components/list/chat-list';
import store from '../utils/store';
import chatApi from '../api/chat-api';
import AddChatForm from '../components/addChatForm';
import chatMainBlock from '../components/chatMainBlock';
import Modal from '../components/modal';
import InputBlock from '../components/inputBlock';
import { ERROR_MSG, REG_EXP } from '../utils/validationConst';
import Form from '../components/form';
import Button from '../components/button';
import Router from '../router';
import userApi from '../api/user-api';
import { saveUserDataToStore } from '../utils/HOC';
import Link from '../components/link';

const router = new Router('#root');
function updateChatList(){
	store.set('chatsLoading', true);
	chatApi.request()
		.then((chats)=>{
			if(chats && typeof chats === 'string'){
				chats = JSON.parse(chats);
				if(!Array.isArray(chats)) router.go(PATH.LOGIN);
				store.set('chats', chats);
				store.set('chatsLoading', false);
			}
		})
		.catch((e)=>{
			console.log(e);
			store.set('chatsLoading', false);
		})
}

export default class ChatPage extends List {

	constructor(){

		const linkProfile = new Link(
			undefined,
			{
				href: PATH.PROFILE,
				label: 'Профиль >',
				class1: 'nav__link_profile',
			},
			'nav__block nav__link_block'
		);

		const addChatForm = new AddChatForm(updateChatList);

		const searchInput = new Input(
			undefined,
			{
				attr: {
					type: 'text',
					placeholder: 'Поиск',
				},
			},
			'nav__search_input'
		);
	
		const navProfile = new List(
			'div',
			{
				profile: new List('div', {linkProfile}, 'nav__block nav__link_block'),
				addChat: addChatForm, // new List('form', {addChatInputBlock, addChatBtn}, 'nav__block nav__add_chat'),
				search: new List('div', {searchInput}, 'nav__block nav__search_block'),
			},
			'nav__upper'
		);
	
		const chatList = new ChatList(
			'div',
			{},
			'chat_list'
		);

		const nav = new List(
			'nav', 
			{
				navProfile,
				chatList
			}, 
			'nav'
		);
	
		const fieldLoginName = 'login';
		const loginAddInput = new InputBlock(
			undefined,
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				valid: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const loginDelInput = new InputBlock(
			undefined,
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				valid: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const addUserBtn = new Button(undefined,
			{
				label: 'Добавить',
				attr: {type: 'submit', id: 'addUserToChat'}
			});
		const addUserForm = new Form(undefined,
			{
				// formClass: 'form',
				title: 'Добавить пользователя',
				inputs: new List(undefined, {loginAddInput}),
				button: addUserBtn,
				request: {
					f_submit: userApi.searchUsersByLogin,
					resolve: (resp: string)=>{
						toggleAddUserModal(false);
						resp = JSON.parse(resp);
						if(Array.isArray(resp)){
							const users = resp.map(user=>user.id),
								chatId = this.children?.chatPage?.children?.main?.props?.chatInfo?.id;
							
							chatApi.addUser(users, chatId).catch(err=>{
								console.log('addUser: err='+typeof err, err);
							});
						}
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
						this.setProps({...this.props, errorMsg: 'Server error'});
					}
				}
			},
			'modal__dialog');
		const modalAddUser = new Modal(
			undefined,
			{
				form: addUserForm
			},
			'modal'
		);
		const deleteUserBtn = new Button(undefined,
			{
				label: 'Удалить',
				attr: {type: 'submit', id: 'deleteUserToChat'}
			});
		const deleteUserForm = new Form(undefined,
			{
				// formClass: 'form',
				title: 'Удалить пользователя',
				inputs: new List(undefined, {loginDelInput}),
				button: deleteUserBtn,
				request: {
					f_submit: userApi.searchUsersByLogin,
					resolve: (resp: string)=>{
						toggleDeleteUserModal(false);
						resp = JSON.parse(resp);
						if(Array.isArray(resp)){
							const users = resp.map(user=>user.id),
								chatId = this.children?.chatPage?.children?.main?.props?.chatInfo?.id;
							
							chatApi.deleteUser(users, chatId).catch(err=>{
								console.log('deleteUser: err='+typeof err, err);
							});
						}
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
						this.setProps({...this.props, errorMsg: 'Server error'});
					}
				}
			},
			'modal__dialog');
		const modalDeleteUser = new Modal(
			undefined,
			{
				form: deleteUserForm
			},
			'modal'
		);

		const toggleAddUserModal = (mode: boolean) =>{
			if(mode){
				modalAddUser.show();
			} else if(mode === false){
				modalAddUser.hide();
			} else {
				modalAddUser.isShow ? modalAddUser.hide() : modalAddUser.show();
			}
		}
	
		const toggleDeleteUserModal = (mode: boolean) =>{
			if(mode){
				modalDeleteUser.show();
			} else if(mode === false){
				modalDeleteUser.hide();
			} else {
				modalDeleteUser.isShow ? modalDeleteUser.hide() : modalDeleteUser.show();
			}
		}
	
		const main = new chatMainBlock(undefined, {toggleAddUserModal, toggleDeleteUserModal});

		const chatPage = new List(
			'div', 
			{
				nav,
				main
			},
			'container'
		);

		super(
			'main', 
			{
				chatPage,
				modalAddUser,
				modalDeleteUser
			},
			'body'
		)
	}

	componentDidMount(){
		saveUserDataToStore();
		updateChatList();
	}
	show(): void {
		saveUserDataToStore();
		updateChatList();
		this.getContent().style.display = "block";
		this.isShow = true;
	}
	hide(): void {
		this.getContent().style.display = "none";
		this.isShow = false;
		chatApi.closeSocket();
		store.set('selectedChat', null);
	}
	render(): DocumentFragment {
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}