import tmpl from './modal.hbs';
import Component, { TProps } from '../../utils/component';
import './modal.scss';

export default class Modal extends Component{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'modal'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (event: PointerEvent)=>{
				console.log('Modal: click: event=', event, 'id=', (<HTMLBodyElement> event.target).id, 'props=', 
				JSON.stringify(this.props));
				if((<HTMLBodyElement> event.target).className === 'modal'){
					this.hide();
				}
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		console.log('Modal render=', this.props, 'children', this.children);
		return this.compile(tmpl, this.props);
	}
}