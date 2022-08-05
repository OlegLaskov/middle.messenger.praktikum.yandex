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

function updateChatList(){
	store.set('chatsLoading', true);
	chatApi.request()
		.then((chats)=>{
			if(chats && typeof chats === 'string'){
				chats = JSON.parse(chats);
				store.set('chats', chats);
				store.set('chatsLoading', false);
				console.log('chats=', chats);
			}
		})
		.catch((e)=>{
			console.log(e);
			store.set('chatsLoading', false);
		})
}

export default class ChatPage extends List {

	constructor(){

		const linkProfile = new Label(
			'a',
			{
				attr: {
					href: PATH.PROFILE
				},
				label: 'Профиль >',
			},
			'nav__link_profile'
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
		const loginInput1 = new InputBlock(
			undefined,
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				valid: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const loginInput2 = new InputBlock(
			undefined,
			{
				input: {attr: {type: 'text', name: fieldLoginName, value: '', placeholder: ' ', autofocus: true}},
				name: fieldLoginName,
				label: 'Логин',
				valid: REG_EXP.LOGIN, 
				fieldErrorMsg: ERROR_MSG.LOGIN
			}
		);
		const modalAddUser = new Modal(
			undefined,
			{
				header: 'Добавить пользователя',
				body: loginInput1,
				buttonId: 'addUserToChat',
				buttonLabel: 'Добавить'
			},
			'modal'
		);
		const modalDeleteUser = new Modal(
			undefined,
			{
				header: 'Удалить пользователя',
				body: loginInput2,
				buttonId: 'deleteUserFromChat',
				buttonLabel: 'Удалить'
			},
			'modal'
		);

		const toggleAddUserModal = (mode: boolean) =>{
			console.log('toggleAddUserModal=', mode);
			if(mode){
				modalAddUser.show();
			} else if(mode === false){
				modalAddUser.hide();
			} else {
				modalAddUser.isShow ? modalAddUser.hide() : modalAddUser.show();
			}
		}
	
		const toggleDeleteUserModal = (mode: boolean) =>{
			console.log('toggleDeleteUserModal=', mode);
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
			'body'
		);

		super(
			'div', 
			{
				chatPage,
				modalAddUser,
				modalDeleteUser
			},
			'body'
		)
	}

	componentDidMount(){
		updateChatList();
	}
	render(): DocumentFragment {
		console.log('ChatPage render=', this.props, 'children', this.children);
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}