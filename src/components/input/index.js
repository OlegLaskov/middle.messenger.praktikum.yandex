import tmpl from './input.hbs';
import Component from '../../utils/component';
import './input.scss';

export default class Input extends Component{
	constructor(tagName = "input", propsAndChildren = {}, defaultClass = 'form__input'){
		super(tagName, propsAndChildren, defaultClass);
	}
	validation(){
		return true;
	}
	render(){
		console.log('Input render');
		return this.compile(tmpl);
	}
}