import tmpl from './link.hbs';
import Component from '../../core/component';
import Router from '../../router';
import './link.scss';
import { TProps, TTag } from '../../core/types';

export default class Link extends Component{
	router = new Router('#root');
	constructor(propsAndChildren: TProps = {}, tagName: TTag = "div", defaultClass = 'link__group'){
		
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (event: PointerEvent)=>{
				event.preventDefault();
				if(propsAndChildren.href){
					
					this.router.go(propsAndChildren.href);
				}
			};
		}

		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}