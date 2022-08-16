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

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'container-error'){

		const chatNav = new ChatNav('div', {
			avatar: '',
			title: '',
			icon: 'fa-solid fa-ellipsis-vertical',
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
				const id = (<HTMLBodyElement> event.target).id;
				if(id==='addUserItemMenu'){
					// open Add User Modal
					propsAndChildren.toggleAddUserModal(true);
				} else if(id==='deleteUserItemMenu'){
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

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const {chatInfo, attr, user} = newProps;

		if(chatInfo && (!oldProps.chatInfo || !isEqual(oldProps.chatInfo, chatInfo))){
			attr.class = 'chat';

			if(user?.id && chatInfo.id){
				chatApi.initSocket(user.id, chatInfo.id);
			}

			const {avatar, title} = chatInfo;

			const chatNavProps = this.children?.chatNav?.props;
			if(chatNavProps){
				this.children.chatNav.setProps({...chatNavProps, avatar, title});
			}
		}
		return !chatInfo || !isEqual(oldProps, newProps);
	}

	render(){

		const {loading, chatInfo} = this.props;

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