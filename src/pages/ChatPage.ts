import Input from '../components/input';
import List from '../components/list';
import Label from '../components/label';
import { PATH } from '../router/paths';
import ChatList from '../components/list/chat-list';
import store from '../utils/store';
import chatApi from '../api/chat-api';
import AddChatForm from '../components/addChatForm';
import chatMainBlock from '../components/list/chat-main-block';

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
	
		const main = new chatMainBlock();
	
		super(
			'div', 
			{
				nav,
				main
			},
			'body'
		)
	}

	componentDidMount(){
		updateChatList();
	}
}