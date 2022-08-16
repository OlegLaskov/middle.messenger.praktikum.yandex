import tmpl from './chatBody.hbs';
import Component, { TProps } from '../../utils/component';
import './chatBody.scss';
import { connect } from '../../utils/HOC';
import { TstoreMsgs } from '../../api/chat-api';

class ChatBody extends Component{
	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'chat__body'){
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}

		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		setTimeout(()=>{
			this.element.scrollHeight && this.element.scrollTo(0, (this.element.scrollHeight));
		}, 500);
		return this.compile(tmpl);
	}
}

type TchatBodyStore = {messages: TstoreMsgs|undefined, selectedChat: number|undefined};

function mapStateToProps(state: TchatBodyStore){
	const {messages, selectedChat}: TchatBodyStore = state;
	
	return {
		selectedChat,
		messages: messages && selectedChat && messages[selectedChat] 
			&& Object.values(messages[selectedChat]).sort((a,b)=>(a.timestamp-b.timestamp))
	}
}

export default connect(ChatBody, mapStateToProps);