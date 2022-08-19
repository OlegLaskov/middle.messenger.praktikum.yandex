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
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}