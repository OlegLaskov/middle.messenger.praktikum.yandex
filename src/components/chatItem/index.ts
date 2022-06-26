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
				console.log('click', this.props.id, JSON.stringify(this.props));
				const {id} = this.props;
				store.set('selectedChat', id);
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		// console.log('ChatItem render=', this.props);
		return this.compile(tmpl, this.props);
	}
}