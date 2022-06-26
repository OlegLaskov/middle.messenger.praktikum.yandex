import * as Handlebars from 'handlebars';
import List from '.';
import { TProps } from '../../utils/component';
import { connect } from '../../utils/HOC';
import { Indexed } from '../../utils/store';
import { isEqual } from '../../utils/utils';
import ChatNav from '../chatNav';
import Label from '../label';
import SendMessageForm from '../sendMessageForm';
import Spiner from '../spiner';

class ChatMainBlock extends List{
	startPage: TProps;
	mainPage: TProps;

	constructor(tagName = "main", propsAndChildren: TProps = {}, defaultClass = 'container-error'){

		const {chats} = propsAndChildren;
		console.log({chats});
		const chatNav = new ChatNav('div', {
			avatar: '',
			title: '',
			icon: 'fa-solid fa-ellipsis-vertical'
		}, 'chat__nav');
		const chatBody = new Label('div', {label: 'Chat Body'}, 'chat__body');
		const messageBlock = new SendMessageForm();

		const startPage = {
			message: new Label('p', {label: 'Выберите чат, чтобы отправить сообщение'}, 'main__select_chat_msg')
		};
		const mainPage = {
			chatNav,
			chatBody,
			messageBlock
		};
	
		propsAndChildren = {...propsAndChildren, ...startPage, ...mainPage}
		super(tagName, propsAndChildren, defaultClass);
		this.startPage = startPage;
		this.mainPage = mainPage;
	}
	componentDidMount(): void {
		console.log('ChatMainBlock: Mount:', this.startPage);
		this.render();
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const {chatInfo, attr} = newProps;
		console.log('ChatMainBlock:', oldProps, newProps, !isEqual(oldProps, newProps));

		if(chatInfo && (!oldProps.chatInfo || oldProps.chatInfo !== chatInfo)){
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

		console.log('ChatMainBlock render=', this.props, ', children=', this.children, ', attr=', attr);
		if(loading){
			return (new Spiner()).render();
		}

		let tmpl = '';
		const content = !chatInfo ? this.startPage : this.mainPage;

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