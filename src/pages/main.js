import Input from '../components/input';
import List from '../components/list';
import Message from '../components/message';

export default function main(){

	const linkProfile = new Message(
		'a',
		{
			attr: {
				href: '/profile'
			},
			message: 'Профиль >',
		},
		'nav__link_profile'
	);

	const searchInput = new Input(
		'input',
		{
			attr: {
				type: 'text',
				placeholder: 'Поиск',
			},
			message: 'Поиск',
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
		chat1: new Message('li', {message: 'Andrey'}, 'chat_list__item'),
		chat2: new Message('li', {message: 'Sergey'}, 'chat_list__item'),
		chat3: new Message('li', {message: 'Pyotr'}, 'chat_list__item'),

	}

	const chatList = new List(
		'ul',
		chatObj,
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

	const selectedChat = null;

	const chatNav = new Message('div', {message: 'Chat Nav'});
	const chatBody = new Message('div', {message: 'Chat Nav'});
	const messageBlock = new Message('div', {message: 'Message Block'});

	const contentMain = selectedChat ? {
			chatNav,
			chatBody,
			messageBlock
		}
		: {message: new Message('p', {message: 'Выберите чат, чтобы отправить сообщение'}, 'main__select_chat_msg')};

	const main = new List(
		'main', 
		contentMain, 
		selectedChat ? 'column' : 'container-error'
	);

	return new List(
		'div', 
		{
			nav,
			main
		},
		'body'
	);
}