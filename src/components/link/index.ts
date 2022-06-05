import tmpl from './link.hbs';
import Component from '../../utils/component';
import './link.scss';

export default class Link extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'link__group'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('Link render');
		return this.compile(tmpl);
	}
}