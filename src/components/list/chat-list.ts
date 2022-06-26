import * as Handlebars from 'handlebars';
import ChatItem from '../chatItem';
import List from '.';
import { connect } from '../../utils/HOC';
import { Indexed } from '../../utils/store';
import Spiner from '../spiner';
import { isEqual } from '../../utils/utils';
import { TProps } from '../../utils/component';

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

function getChatPropsById(chats: TChat[], id: number): TChat|null {
	for (let i = 0; i < chats.length; i++) {
		const chat = chats[i];
		if(chat.id === id) return chat;
	}
	return null;
}
class ChatList extends List{

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		let res = false;
		const oldChatList = oldProps.chats || [];
		const newChatList = newProps.chats;
		console.log('ChatList DidUpdate: isEqual:', oldProps.selectedChat, oldProps, newProps);
		
		res = newChatList && (!isEqual(oldChatList, newChatList) || 
			(newProps?.children && newChatList?.length !== Object.keys(newProps.children).length));
		console.log('ChatList: DidUpdate: res=', res, oldProps.loading !== newProps.loading);
		if(res){
			const newPropsChildren: TProps = {};

			for (let i = 0; i < newChatList.length; i++) {
				const chat = newChatList[i],
					key = chat.id;
				newPropsChildren[key] = chat;
				if(!newPropsChildren[key].avatar){
					newPropsChildren[key].avatar = new URL('/resources/miniAvatar.jpg', import.meta.url);
				}
			}
			console.log('ChatList: newPropsChildren=', newPropsChildren);
			newProps.children = newPropsChildren;
			const newChildren: TProps = {};
			for (const key in newPropsChildren) {
				if(oldProps.children && newProps.children && oldProps.children[key] 
					&& isEqual(oldProps.children[key], newProps.children[key]) 
					&& Object.prototype.hasOwnProperty.call(this.children, key)){
						newChildren[key] = this.children[key];
				} else {
					newChildren[key] = new ChatItem(undefined, newPropsChildren[key]);
				}
			}
			// this.setProps({...this.props, ...newChildren});
			this.children = newChildren;

			
		}
		console.log('ChatList: selectedChat=', oldProps?.selectedChat, newProps?.selectedChat);
		if(oldProps?.selectedChat !== newProps?.selectedChat){
			let key, chatProps;
			if(oldProps?.selectedChat){
				key = oldProps.selectedChat;
				chatProps = getChatPropsById(newChatList, key);
				chatProps && (this.children[key] = new ChatItem(undefined, {...chatProps, selected: null}));
			}
			key = newProps.selectedChat;
			chatProps = getChatPropsById(newChatList, key);
			this.children[key] = new ChatItem(undefined, {...chatProps, selected: 'chatItem__selected'});
			res=true;
		}


		if(!res && oldProps.loading !== newProps.loading){
			res = true;
		}
		return res;
	}
	render(){
		console.log('ChatList render=', this.props, ', children=', this.children);
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
		loading: state.chatsLoading,
		chats: state.chats,
		selectedChat: state.selectedChat
	}
}
export default connect(ChatList, mapStateToProps);