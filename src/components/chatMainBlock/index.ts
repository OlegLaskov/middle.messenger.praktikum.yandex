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
import chatApi from '../../api/chat-api';

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

		const chatBody = new ChatBody('div', {}, 'chat__body');

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
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const {chatInfo, attr, user} = newProps;
		console.log('ChatMainBlock:', oldProps, newProps, !isEqual(oldProps, newProps));

		if(chatInfo && (!oldProps.chatInfo || !isEqual(oldProps.chatInfo, chatInfo))){
			attr.class = 'chat';

			console.log('ChatMainBlock: chatInfo=', chatInfo, ', user=', user);
			if(user?.id && chatInfo.id){
				console.log('initSocket: user.id=', user.id);
				chatApi.initSocket(user.id, chatInfo.id);
			}

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
	const {chatLoading, chats, selectedChat, user} = state;
	const chatInfo = chats && Array.isArray(chats) && chats.find(chat=>(chat.id === selectedChat));
	return {
		loading: chatLoading,
		chatInfo,
		user
	}
}
export default connect(ChatMainBlock, mapStateToProps);