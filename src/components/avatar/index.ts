import tmpl from './avatar.hbs';
import Component, { TProps } from '../../utils/component';
import './avatar.scss';

export default class Avatar extends Component{
	constructor(tagName = "div", propsAndChildren:TProps = {}, defaultClass = 'avatar'){
		if(!propsAndChildren.size){
			propsAndChildren.size = 130;
		}
		if(!propsAndChildren.photo){
			propsAndChildren.imgClass = 'avatar__noPhoto';
		}
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}