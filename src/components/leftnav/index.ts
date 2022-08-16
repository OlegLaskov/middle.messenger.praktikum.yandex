import tmpl from './leftnav.hbs';
import Component from '../../utils/component';
import './leftnav.scss';

export default class LeftNav extends Component{
	constructor(tagName = "nav", propsAndChildren = {}, defaultClass = 'leftnav'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}