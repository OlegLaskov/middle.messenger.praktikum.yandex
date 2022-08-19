import tmpl from './link.hbs';
import Component, { TProps } from '../../utils/component';
import Router from '../../router';
import './link.scss';

export default class Link extends Component{
	router = new Router('#root');
	constructor(tagName = "div", propsAndChildren:TProps = {}, defaultClass = 'link__group'){
		
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