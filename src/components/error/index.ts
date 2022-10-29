import tmpl from './error.hbs';
import Component from '../../core/component';
import Link from '../link';
import { PATH } from '../../router/paths';
import { TProps, TTag } from '../../core/types';

export default class Error extends Component{

	constructor(propsAndChildren?: TProps, tagName: TTag = "div", defaultClass = 'container-error'){
		if(!propsAndChildren){
			propsAndChildren = {
				title: '404',
				content: 'Не туда попали',
				link: new Link({href: PATH.CHAT, class1: '', label: 'Назад к чатам'}, 'div')
			}
		}
		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		console.log('Error render');
		return this.compile(tmpl, this.props);
	}
}