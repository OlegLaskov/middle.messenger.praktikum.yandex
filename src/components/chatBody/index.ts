import tmpl from './chatBody.hbs';
import Component, { TProps } from '../../utils/component';
import './chatBody.scss';
import store, { Indexed } from '../../utils/store';
import { connect } from '../../utils/HOC';
import { Tmsg, TstoreMsgs } from '../../api/chat-api';

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

type TchatBodyStore = {messages: TstoreMsgs|undefined, selectedChat: number|undefined};

function mapStateToProps(state: TchatBodyStore){
	const {messages, selectedChat}: TchatBodyStore = state;
	console.log('ChatBody: mapStateToProps: messages=', messages);
	return {
		selectedChat,
		messages: messages && selectedChat && messages[selectedChat] 
			&& Object.values(messages[selectedChat]).sort((a,b)=>(a.timestamp-b.timestamp))
	}
}

export default connect(ChatBody, mapStateToProps);