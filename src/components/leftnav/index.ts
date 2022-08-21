import tmpl from './leftnav.hbs';
import Component from '../../core/component';
import Router from '../../router';
import './leftnav.scss';
import { TProps, TTag } from '../../core/types';

export default class LeftNav extends Component{
	router = new Router('#root');
	constructor(propsAndChildren: TProps = {}, tagName: TTag = "nav", defaultClass = 'leftnav'){
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