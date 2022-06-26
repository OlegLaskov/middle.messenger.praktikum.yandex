import tmpl from './input.hbs';
import Component, { TProps } from '../../utils/component';
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

	componentDidMount(){
		// console.log('Input DidMount=', JSON.stringify(this.props));

	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		// console.log('Input DidUpdate=', JSON.stringify(this.props));
		return !this.compareProps(oldProps, newProps);
	}

	validate(){
		return true;
	}
	render(){
		// console.log('Input render=', this.props);
		return this.compile(tmpl);
	}
}