import tmpl from './chatBody.hbs';
import Component, { TProps } from '../../utils/component';
import './chatBody.scss';
import store, { Indexed } from '../../utils/store';
import { connect } from '../../utils/HOC';
import { Tmsg } from '../../api/chat-api';

class ChatBody extends Component{
	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'chat__body'){
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}

		super(tagName, propsAndChildren, defaultClass);
	}

	/* componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		console.log('ChatBody: componentDidUpdate', oldProps, newProps, !this.compareProps(oldProps, newProps));
		if(oldProps.selectedChat && oldProps.selectedChat !== newProps.selectedChat){
			console.log('Clear Store');
			store.set('messages', null);
		}
		return !this.compareProps(oldProps, newProps);
	} */

	render(){
		console.log('ChatBody content=', this.props, 'scrollHeight=', this.element.scrollHeight);
		this.element.scrollHeight && this.element.scrollTo(0, (this.element.scrollHeight+50));
		return this.compile(tmpl);
	}
}

function mapStateToProps(state: Indexed<unknown>){
	const {messages, selectedChat} = state;
	console.log('ChatBody: mapStateToProps: messages=', messages);
	return {
		selectedChat,
		messages: messages && (<Tmsg[]> messages).filter((msg:Tmsg)=>(msg.chat_id === selectedChat))
	}
}

export default connect(ChatBody, mapStateToProps);