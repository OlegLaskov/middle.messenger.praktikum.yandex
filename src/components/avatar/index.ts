import tmpl from './avatar.hbs';
import Component from '../../utils/component';
import './avatar.scss';

export default class Avatar extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'avatar'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}