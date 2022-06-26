// import * as Handlebars from 'handlebars';
import tmpl from './error.hbs';
import Component, { TProps } from '../../utils/component';
import Link from '../link';
import { PATH } from '../../router/paths';

export default class Error extends Component{

	constructor(tagName = "div", propsAndChildren?: TProps, defaultClass = 'container-error'){
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