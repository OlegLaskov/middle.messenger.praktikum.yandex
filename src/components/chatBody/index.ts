import tmpl from './chatBody.hbs';
import Component from '../../core/component';
import './chatBody.scss';
import { connect } from '../../core/HOC';
import { TProps, TstoreMsgs, TTag } from '../../core/types';

class ChatBody extends Component{
	constructor(propsAndChildren: TProps = {}, tagName: TTag = 'div', defaultClass = 'chat__body'){
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}

		super(propsAndChildren, tagName, defaultClass);
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