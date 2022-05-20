import tmpl from './leftnav.hbs';
import Component from '../../utils/component';
import './leftnav.scss';

export default class LeftNav extends Component{
	constructor(tagName = "nav", propsAndChildren = {}, defaultClass = 'leftnav'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('LeftNav render');
		return this.compile(tmpl);
	}
}