import tmpl from './button.hbs';
import Component from '../../core/component';
import './button.scss';
import { TTag } from '../../core/types';

export default class Button extends Component{
	constructor(propsAndChildren = {}, tagName: TTag = 'button', defaultClass = 'form__button'){
		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}