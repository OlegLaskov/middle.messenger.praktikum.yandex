import * as Handlebars from 'handlebars';
import { TProps, TTag } from '../../core/types';
import List from '../list';

export default class Menu extends List{

	constructor(propsAndChildren: TProps = {}, tagName: TTag = "div", defaultClass = 'menu'){
		
		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}