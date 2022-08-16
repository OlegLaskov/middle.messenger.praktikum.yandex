import tmpl from './input.hbs';
import Component from '../../utils/component';
import './input.scss';

export type InputAttributes = {
	type: string,
	id?: string,
	name?: string,
	placeholder?: string,
	autocomplete?: string|null,
	autofocus?: boolean,
	value?: string|number,
	readonly?: boolean
}
export type InputType = {
	attr?: InputAttributes
}

export default class Input extends Component{
	constructor(tagName = "input", propsAndChildren:InputType = {}, defaultClass = 'form__input'){
		super(tagName, propsAndChildren, defaultClass);
	}

	validate(){
		return true;
	}
	render(){
		return this.compile(tmpl);
	}
}