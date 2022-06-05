// import * as Handlebars from 'handlebars';
import tmpl from './error.hbs';
import Component from '../../utils/component';
import Link from '../link';
import { PATH } from '../../router/paths';
// import link from '../link';

// Handlebars.registerPartial('error', link);

export default class Error extends Component{

	constructor(tagName = "div", propsAndChildren?: {[key:string|symbol]: any}, defaultClass = 'container-error'){
		if(!propsAndChildren){
			propsAndChildren = {
				title: '404',
				content: 'Не туда попали',
				link: new Link('div', {href: PATH.CHAT, class1: '', label: 'Назад к чатам'})
			}
		}
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('Error render');
		return this.compile(tmpl, this.props);
	}
}
/* export default ({title, content, links}: 
	{title: string, content: string, links: object[]}) => {return tmpl({title, content, links})}; */