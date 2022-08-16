import tmpl from './chatItem.hbs';
import Component, { TProps } from '../../utils/component';
import './chatItem.scss';
import store from '../../utils/store';

export default class ChatItem extends Component{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'chatItem'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = ()=>{
				const {id} = this.props;
				store.set('selectedChat', id);
			};
		}
		if(!propsAndChildren.attr){
			propsAndChildren.attr = {id: `chatItem${propsAndChildren.id}`};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		if(this.props.selected){
			this.props.attr.class = `chatItem ${this.props.selected}`;
		} else {
			this.props.attr.class = 'chatItem';
		}
		return this.compile(tmpl, this.props);
	}
}