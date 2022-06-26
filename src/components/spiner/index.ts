// import * as Handlebars from 'handlebars';
import tmpl from './spiner.hbs';
import Component, { TProps } from '../../utils/component';
import './spiner.scss';

export default class Spiner extends Component{

	constructor(tagName = "div", propsAndChildren?: TProps, defaultClass = 'spiner'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}
