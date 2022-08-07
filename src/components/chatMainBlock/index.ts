import * as Handlebars from 'handlebars';
import List from '../list';
import { TProps } from '../../utils/component';
import { connect } from '../../utils/HOC';
import { Indexed } from '../../utils/store';
import { isEqual } from '../../utils/utils';
import ChatNav from '../chatNav';
import Label from '../label';
import Menu from '../menu';
import MenuItem from '../menuitem';
import SendMessageForm from '../sendMessageForm';
import Spiner from '../spiner';
import './chatMainBlock.scss';
import ChatBody from '../chatBody';

class ChatMainBlock extends List{
	startPage: TProps;
	mainPage: TProps;

	constructor(tagName = "main", propsAndChildren: TProps = {}, defaultClass = 'container-error'){

		const {chats} = propsAndChildren;
		console.log({chats});
		const chatNav = new ChatNav('div', {
			avatar: '',
			title: '',
			icon: 'fa-solid fa-ellipsis-vertical',
			// toggleOpenChatMenu: this.toggleOpenChatMenu
		}, 'chat__nav');

		const chatBody = new ChatBody('div', {
			message: [
				{msgClass: 'message__left', 
					content: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории \
— НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас \
мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще \
находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. \n\nХассельблад \
в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. \
Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.', time: '11:56'},
				{msgClass: 'message__right', content: 'Test Message 001', time: '12:00'},
				{msgClass: 'message__left', 
					content: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории \
— НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас \
мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще \
находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. \n\nХассельблад \
в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. \
Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.', time: '11:56'},
				{msgClass: 'message__right', content: 'Test Message 001', time: '12:00'},
			]
		}, 'chat__body');

		const messageBlock = new SendMessageForm();

		const chatMenuItems = [
			{label: 'Добавить пользователя', id: 'addUserItemMenu'}, 
			{label: 'Удалить пользователя', id: 'deleteUserItemMenu'}
		].map(item=>(new MenuItem(
			undefined,
			{label: item.label, attr: {id: item.id}}
		)));
		const chatMenu = new Menu(
			undefined,
			chatMenuItems.reduce((acc:TProps, item, i)=>{
				acc[i] = item;
				return acc;
			},{}),
			'chatMenu'
		);

		const startPage = {
			message: new Label('p', {label: 'Выберите чат, чтобы отправить сообщение'}, 'main__select_chat_msg')
		};
		const mainPage = {
			chatNav,
			chatBody,
			messageBlock,
			chatMenu
		};
	
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (event: PointerEvent)=>{
				console.log('ChatMainBlock: click', event, 'target=', (<HTMLBodyElement> event.target).id, 
					JSON.stringify(this.props.chatInfo), !!this.props.toggleOpenChatMenu);
				const id = (<HTMLBodyElement> event.target).id;
				if(id==='addUserItemMenu'){
					console.log('addUserItemMenu', this.props.chatInfo);
					// open Add User Modal
					propsAndChildren.toggleAddUserModal(true);
				} else if(id==='deleteUserItemMenu'){
					console.log('deleteUserItemMenu', this.props.chatInfo);
					// open Delete User Modal
					propsAndChildren.toggleDeleteUserModal(true);
				}
				this.toggleOpenChatMenu(id === 'chatMenuToggle' 
					|| id === 'chatMenuToggleIcon');
			};
		}
		propsAndChildren = {...propsAndChildren, ...startPage, ...mainPage, isOpenChatMenu: false}
		super(tagName, propsAndChildren, defaultClass);
		this.startPage = startPage;
		this.mainPage = mainPage;
	}

	toggleOpenChatMenu = (toggle: boolean) => {
		const value = toggle ? !this.props.isOpenChatMenu : false;
		this.setProps({...this.props, isOpenChatMenu: value});
	}

	componentDidMount(): void {
		console.log('ChatMainBlock: Mount:', this.startPage);
	// this.children.chatNav.setProps({...this.children.chatNav.props, toggleOpenChatMenu: this.toggleOpenChatMenu});
		
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const {chatInfo, attr} = newProps;
		console.log('ChatMainBlock:', oldProps, newProps, !isEqual(oldProps, newProps));

		if(chatInfo && (!oldProps.chatInfo || !isEqual(oldProps.chatInfo, chatInfo))){
			attr.class = 'chat';

			console.log('ChatMainBlock: chatInfo=', chatInfo);
			

			const {avatar, title} = chatInfo;

			const chatNavProps = this.children?.chatNav?.props;
			console.log('chatNavProps', chatNavProps);
			if(chatNavProps){
				console.log('!!! ChatMainBlock: Update chatNav !!!');
				this.children.chatNav.setProps({...chatNavProps, avatar, title});
			}
		}
		return !chatInfo || !isEqual(oldProps, newProps);
	}

	render(){

		const {loading, chatInfo, attr} = this.props;

		console.log('ChatMainBlock render=', this.props, ', children=', this.children, ', attr=', attr, 
		', tAUM', !!this.props.toggleAddUserModal);
		if(loading){
			return (new Spiner()).render();
		}

		let tmpl = '';
		const content = !chatInfo ? this.startPage : this.mainPage;

		if(this.children.chatMenu){
			this.props.isOpenChatMenu ? this.children.chatMenu.show() : this.children.chatMenu.hide();
		}

		if(content && Object.keys(content).length){
			Object.keys(content).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		console.log('ChatMainBlock content=', content);
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}
function mapStateToProps(state: Indexed<unknown>){
	const {chatLoading, chats, selectedChat} = state;
	const chatInfo = chats && Array.isArray(chats) && chats.find(chat=>(chat.id === selectedChat));
	return {
		loading: chatLoading,
		chatInfo
	}
}
export default connect(ChatMainBlock, mapStateToProps);