import tmpl from './chatItem.hbs';
import Component from '../../utils/component';
import './chatItem.scss';

export default class ChatItem extends Component{

	constructor(tagName = "div", propsAndChildren: {[key:string|symbol]: any} = {}, defaultClass = 'chatItem'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (e: Event)=>{
				console.log('click', this.props.id);
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		console.log('ChatItem render=', this.props);
		return this.compile(tmpl, this.props);
	}
}