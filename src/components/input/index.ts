import tmpl from './input.hbs';
import Component from '../../core/component';
import './input.scss';
import { InputType, TTag } from '../../core/types';

export default class Input extends Component{
	constructor(propsAndChildren: InputType = {}, tagName: TTag = "input", defaultClass = 'form__input'){
		super(propsAndChildren, tagName, defaultClass);
	}

	validate(){
		return true;
	}
	render(){
		return this.compile(tmpl);
	}
}