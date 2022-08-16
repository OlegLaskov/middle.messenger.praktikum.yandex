import Component, { TProps } from "../../utils/component";
import './chatNav.scss';
import tmpl from './chatNav.hbs';

export default class ChatNav extends Component{

	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'chat__nav'){

		super(tagName, propsAndChildren, defaultClass);
		
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}