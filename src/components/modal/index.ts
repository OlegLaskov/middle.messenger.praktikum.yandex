import tmpl from './modal.hbs';
import Component from '../../core/component';
import { TProps, TTag } from '../../core/types';
import './modal.scss';

export default class Modal extends Component{

	constructor(propsAndChildren: TProps = {}, tagName: TTag = "div", defaultClass = 'modal'){

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
		super(propsAndChildren, tagName, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}