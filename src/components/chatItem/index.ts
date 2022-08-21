import tmpl from './chatItem.hbs';
import Component from '../../core/component';
import './chatItem.scss';
import store from '../../core/store';
import { TProps, TTag } from '../../core/types';

export default class ChatItem extends Component{

	constructor(propsAndChildren: TProps = {}, tagName: TTag = 'div', defaultClass = 'chat-item'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = ()=>{
				const {id} = this.props;
				store.set('selectedChat', id);
			};
		}
		super(propsAndChildren, tagName, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}