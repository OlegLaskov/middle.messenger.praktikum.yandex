import * as Handlebars from 'handlebars';
import { TProps } from '../../utils/component';
import List from '../list';

export default class Menu extends List{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'menu'){
		
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('Menu render=', this.props);
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}