import tmpl from './menuItem.hbs';
import Component from '../../core/component';
import { TProps, TTag } from '../../core/types';
import './menuItem.scss';

export default class MenuItem extends Component{

	constructor(propsAndChildren: TProps = {}, tagName: TTag = "div", defaultClass = 'menu-item'){

		super(propsAndChildren, tagName, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}