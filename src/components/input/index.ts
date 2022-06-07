import tmpl from './input.hbs';
import Component from '../../utils/component';
import './input.scss';

export default class Input extends Component{
	constructor(tagName = "input", propsAndChildren = {}, defaultClass = 'form__input'){
		super(tagName, propsAndChildren, defaultClass);
	}

	componentDidMount(){
		console.log('Input DidMount=', JSON.stringify(this.props));

	}

	componentDidUpdate(oldProps: {[key:string|symbol]: any}, newProps: {[key:string|symbol]: any}): boolean {
		console.log('Input DidUpdate=', JSON.stringify(this.props));
		return !this.compareProps(oldProps, newProps);
	}

	validate(){
		return true;
	}
	render(){
		console.log('Input render=', this.props);
		return this.compile(tmpl);
	}
}