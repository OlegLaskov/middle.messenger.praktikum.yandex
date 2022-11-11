import {compile} from 'handlebars';
import Input from '../components/input';
import List from '../components/list';
import { PATH } from '../router/paths';
import ChatList from '../components/list/chat-list';
import store from '../core/store';
import chatApi from '../api/chat-api';
import AddChatForm from '../components/addChatForm';
import ChatMainBlock from '../components/chatMainBlock';
import Modal from '../components/modal';
import InputBlock from '../components/inputBlock';
import { ERROR_MSG, REG_EXP } from '../utils/validationConst';
import Form from '../components/form';
import Button from '../components/button';
import Router from '../router';
import userApi from '../api/user-api';
import { saveUserDataToStore } from '../core/HOC';
import Link from '../components/link';
import webSocketTransport from '../core/WebSocketTransport';

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
			{
				href: PATH.PROFILE,
				label: 'Профиль >',
				class1: 'nav__link_profile',
			},
			undefined,
			'nav__block nav__link_block'
		);

		const addChatForm = new AddChatForm(updateChatList);

		const searchInput = new Input(
			{
				attr: {
					type: 'text',
					placeholder: 'Поиск',
				},
			},
			undefined,
			'nav__search_input'
		);
	
		const navProfile = new List(
			{
				profile: new List({linkProfile}, 'div', 'nav__block nav__link_block'),
				addChat: addChatForm,
				search: new List({searchInput}, 'div', 'nav__block nav__search_block'),
			},
			'div',
			'nav__upper'
		);
	
		const chatList = new ChatList(
			{},
			'div',
			'chat-list'
		);

		const nav = new List(
			{
				navProfile,
				chatList
			}, 
			'nav', 
			'nav'
		);
	
		const fieldLoginName = 'login';
		const loginAddInput = new InputBlock(
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				validationRegexpOrFunc: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const loginDelInput = new InputBlock(
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				validationRegexpOrFunc: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const addUserBtn = new Button(
			{
				label: 'Добавить',
				attr: {type: 'submit', id: 'addUserToChat'}
			});
		const addUserForm = new Form(
			{
				title: 'Добавить пользователя',
				inputs: new List({loginAddInput}),
				button: addUserBtn,
				request: {
					f_submit: userApi.searchUsersByLogin,
					resolve: (resp: string)=>{
						toggleAddUserModal(false);
						resp = JSON.parse(resp);
						if(Array.isArray(resp)){
							const users = resp.map(user=>user.id),
								chatId = this.children?.chatPage?.children?.main?.props?.chatInfo?.id;
							console.log('users=', users, 'chatId=', chatId);
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
			undefined,
			'modal__dialog');
		const modalAddUser = new Modal({form: addUserForm});
		const deleteUserBtn = new Button(
			{
				label: 'Удалить',
				attr: {type: 'submit', id: 'deleteUserToChat'}
			});
		const deleteUserForm = new Form(
			{
				title: 'Удалить пользователя',
				inputs: new List({loginDelInput}),
				button: deleteUserBtn,
				request: {
					f_submit: userApi.searchUsersByLogin,
					resolve: (resp: string)=>{
						toggleDeleteUserModal(false);
						resp = JSON.parse(resp);
						if(Array.isArray(resp)){
							const users = resp.map(user=>user.id),
								chatId = this.children?.chatPage?.children?.main?.props?.chatInfo?.id;
								console.log('users=', users, 'chatId=', chatId);
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
			undefined,
			'modal__dialog');
		const modalDeleteUser = new Modal({form: deleteUserForm});

		const toggleAddUserModal = (mode: boolean) =>{
			if(mode){
				modalAddUser.show();
			} else {
				modalAddUser.hide();
			}
		}
	
		const toggleDeleteUserModal = (mode: boolean) =>{
			if(mode){
				modalDeleteUser.show();
			} else {
				modalDeleteUser.hide();
			}
		}
	
		const main = new ChatMainBlock({toggleAddUserModal, toggleDeleteUserModal});

		const chatPage = new List(
			{
				nav,
				main
			},
			'div', 
			'container'
		);

		super(
			{
				chatPage,
				modalAddUser,
				modalDeleteUser
			},
			'main', 
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
		webSocketTransport.closeSocket();
		store.set('selectedChat', null);
	}
	render(): DocumentFragment {
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(compile(tmpl), this.props);
	}
}