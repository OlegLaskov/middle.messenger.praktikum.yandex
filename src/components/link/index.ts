// import * as Handlebars from 'handlebars';
import tmpl from './link.hbs';
import Component from '../../utils/component';
import './link.scss';

// Handlebars.registerPartial('link', tmpl);

export default class Link extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'link__group'){
		super(tagName, propsAndChildren, defaultClass);
	}
	
	render(){
		console.log('Link render');
		return this.compile(tmpl);
	}
}

/* export default ({href, class1, label}: 
	{href: string, class1: string, label: string}) => {return tmpl({href, class1, label})}; */