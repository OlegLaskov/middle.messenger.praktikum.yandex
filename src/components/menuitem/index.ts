import tmpl from './menuItem.hbs';
import Component, { TProps } from '../../utils/component';
import './menuItem.scss';

export default class MenuItem extends Component{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'menuItem'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (event)=>{
				console.log('MenuItem: click', event.target.textContent, JSON.stringify(this.props));
				
			};
		}
		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		console.log('MenuItem render=', this.props);
		return this.compile(tmpl, this.props);
	}
}