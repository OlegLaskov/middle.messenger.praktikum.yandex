import * as Handlebars from 'handlebars';
import ChatItem from '../chatItem';
import List from '../list';

export default class ChatList extends List{
	componentDidMount(){
		console.log('componentDidMount=', JSON.stringify(this.props), Object.keys(this.children));
		if(this.props.children && Object.keys(this.props.children).length){
			const newChildren: {[key:string|symbol]: any} = {};
			for (const chat in this.props.children) {
				if (Object.prototype.hasOwnProperty.call(this.props.children, chat)) {
					const element = this.props.children[chat];
					newChildren[chat] = new ChatItem(undefined, element);
				}
			}
			this.setProps({...this.props, ...newChildren});
			// this.render();
		}
	}

	componentDidUpdate(oldProps: {[key:string|symbol]: any}, newProps: {[key:string|symbol]: any}): boolean {
		let res = false;
		const oldChatList = oldProps.children;
		const newChatList = newProps.children;
		console.log('componentDidUpdate', oldChatList && JSON.stringify(Object.keys(oldChatList)), newChatList && 
			JSON.stringify(Object.keys(newChatList)));
		
		res = !this.compareProps(oldProps, newProps);
		!res && (res = !this.compareProps(oldChatList, newChatList));
		if(res){
			const newChildren: {[key:string|symbol]: any} = {};
			for (const key in newChatList) {
				if (Object.prototype.hasOwnProperty.call(newChatList, key)) {
					const chat = newChatList[key];
					if(!this.children[key] || chat !== oldChatList[key]){
						res = true;
						newChildren[key] = new ChatItem(undefined, chat);
					} else {
						newChildren[key] = this.children[key];
					}
				}
			}
			this.children = newChildren;
		}
		console.log('componentDidUpdate=', res);
		return res;
	}
	render(){
		console.log('ChatList render=', Object.keys(this.props), ', children=', Object.keys(this.children));
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}