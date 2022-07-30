import tmpl from './modal.hbs';
import Component, { TProps } from '../../utils/component';
import './modal.scss';

export default class Modal extends Component{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'modal'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (event: unknown)=>{
				console.log('Modal: click: event=', event, 'id=', this.props.id, 'props=', JSON.stringify(this.props));
				
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		console.log('Modal render=', this.props);
		return this.compile(tmpl, this.props);
	}
}