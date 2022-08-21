import * as Handlebars from 'handlebars';
import ChatItem from '../chatItem';
import List from '.';
import { connect } from '../../core/HOC';
import Spiner from '../spiner';
import { isEqual } from '../../utils/utils';
import { Indexed, TProps } from '../../core/types';

type TUser = {
	first_name: string,
	second_name: string,
	avatar: string,
	email: string,
	login: string,
	phone: string
}

type TLastMessage = {
	user: TUser,
	time: string,
	content: string
}

type TChat = {
	id: number,
	title: string,
	avatar: string,
	unread_count: number,
	last_message: TLastMessage
}

class ChatList extends List{

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		let res = false;
		const newChatArr = newProps.chats;
		
		res = newChatArr && (!isEqual(oldProps, newProps));

		if(res){
			const newPropsChildren: TProps = {};

			for (let i = 0; i < newChatArr.length; i++) {
				const chat = newChatArr[i],
					key = chat.id;
				newPropsChildren[key] = chat;
				if(!newPropsChildren[key].avatar){
					newPropsChildren[key].avatar = new URL('/resources/miniAvatar.jpg', import.meta.url);
				}
			}
			this.state = newPropsChildren;
			
			for (const key in newPropsChildren) {

				if(Object.prototype.hasOwnProperty.call(newPropsChildren, key)){
					if(!Object.prototype.hasOwnProperty.call(this.children, key)){
						this.children[key] = new ChatItem(newPropsChildren[key]);
					} else {
						this.children[key].setProps({...this.children[key].props, ...newPropsChildren[key]});
					}
				}
			}

			for (const key in this.children) {
				if (Object.prototype.hasOwnProperty.call(this.children, key)
					&& !Object.prototype.hasOwnProperty.call(newPropsChildren, key)) {
						delete this.children[key];
				}
			}
		}

		if((newProps?.selectedChat || oldProps?.selectedChat) && oldProps?.selectedChat !== newProps?.selectedChat){
			let key, chatProps;

			if(oldProps?.selectedChat){
				key = oldProps.selectedChat;
				
				chatProps = this.state[key];
				this.children[key].setProps({...chatProps, attr: {class: 'chat-item'}});
			}
			if(newProps?.selectedChat){
				key = newProps.selectedChat;
				chatProps = this.state[key];
				this.children[key].setProps({...chatProps, attr: {class: 'chat-item chat-item__selected'}});
			}
			res=true;
		}

		if(!res && oldProps.loading !== newProps.loading){
			res = true;
		}

		return res;
	}
	
	render(){
		if(this.props.loading){
			return (new Spiner()).render();
		}
		let tmpl = '';

		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}
function mapStateToProps(state: Indexed<unknown>){
	return {
		loading: <boolean|undefined> state.chatsLoading,
		chats: <TChat[]|undefined> state.chats,
		selectedChat: <number|null|undefined> state.selectedChat
	}
}
export default connect(ChatList, mapStateToProps);