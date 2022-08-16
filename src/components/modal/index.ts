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
				if((<HTMLBodyElement> event.target).className === 'modal'){
					this.hide();
				}
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}