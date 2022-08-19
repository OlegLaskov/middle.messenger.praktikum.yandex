import tmpl from './leftnav.hbs';
import Component, { TProps } from '../../utils/component';
import Router from '../../router';
import './leftnav.scss';

export default class LeftNav extends Component{
	router = new Router('#root');
	constructor(tagName = "nav", propsAndChildren:TProps = {}, defaultClass = 'leftnav'){
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
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}