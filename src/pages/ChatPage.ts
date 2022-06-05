import Input from '../components/input';
import List from '../components/list';
import Label from '../components/label';
import { PATH } from '../router/paths';
import ChatList from '../components/chatList';
import ChatItem from '../components/chatItem';
// import Component from '../utils/component';

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

			
		const searchInput = new Input(
			undefined,
			{
				attr: {
					type: 'text',
					placeholder: 'Поиск',
				},
			},
			'nav__search_input'
		)
	
		const navProfile = new List(
			'div',
			{
				profile: new List('div', {linkProfile}, 'nav__block nav__link_block'),
				search: new List('div', {searchInput}, 'nav__block nav__search_block'),
			},
			'nav__upper'
		);
	
		const chatObj = {
			chat1: {id: 1, title: 'Andrey', avatar: new URL('/resources/miniAvatar.jpg', import.meta.url), 
				unread_count: 5, time: '10:49', content: 'Test message', selected: ''},
			chat2: {id: 2, title: 'Sergey', avatar: new URL('/resources/miniAvatar.jpg', import.meta.url), 
				unread_count: 6, time: '15:12', content: 'Test001 message', selected: ''},
			chat3: {id: 3, title: 'Pyotr', avatar: new URL('/resources/miniAvatar.jpg', import.meta.url), 
				unread_count: 79, time: 'Пт', content: 'Test002 message', selected: 'chatItem__selected'}
		};
	
		const chatList = new ChatList(
			'div',
			{children: chatObj},
			'chat_list'
		);

		// window.chatList= chatList; // for TEST
	
		const nav = new List(
			'nav', 
			{
				navProfile,
				chatList
			}, 
			'nav'
		);
	
		const selectedChat = null;
	
		const chatNav = new Label('div', {label: 'Chat Nav'});
		const chatBody = new Label('div', {label: 'Chat Nav'});
		const paper_clip = '<i class="fa-solid fa-paperclip"></i>';
		const messageBlock = new Input(undefined, {attr: {
			type: 'text',
			placeholder: 'Введите сообщение',
		},});
	
		const contentMain = selectedChat ? {
				chatNav,
				chatBody,
				messageBlock
			}
			: {message: new Label('p', {label: 'Выберите чат, чтобы отправить сообщение'}, 
				'main__select_chat_msg')};
	
		const main = new List(
			'main', 
			contentMain, 
			selectedChat ? 'column' : 'container-error'
		);
	
		super(
			'div', 
			{
				nav,
				main
			},
			'body'
		)
	}
}