import Component from '../../core/component';
import './chatNav.scss';
import tmpl from './chatNav.hbs';
import { TProps, TTag } from '../../core/types';

export default class ChatNav extends Component{

	constructor(propsAndChildren: TProps = {}, tagName: TTag = 'div', defaultClass = 'chat__nav'){

		super(propsAndChildren, tagName, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}