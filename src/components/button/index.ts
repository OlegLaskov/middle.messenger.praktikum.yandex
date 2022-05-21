import tmpl from './button.hbs';
import Component from '../../utils/component';
import './button.scss';

export default class Button extends Component{
	constructor(tagName = "button", propsAndChildren = {}, defaultClass = 'form__button'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('Button render');
		return this.compile(tmpl);
	}
}