// import * as Handlebars from 'handlebars';
import tmpl from './spiner.hbs';
import Component from '../../core/component';
import './spiner.scss';
import { TProps, TTag } from '../../core/types';

export default class Spiner extends Component{

	constructor(propsAndChildren?: TProps, tagName: TTag = "div", defaultClass = 'spiner'){
		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}
