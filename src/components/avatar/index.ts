import tmpl from './avatar.hbs';
import Component from '../../core/component';
import './avatar.scss';
import { TProps, TTag } from '../../core/types';

export default class Avatar extends Component{
	constructor(propsAndChildren:TProps = {}, tagName: TTag = "div", defaultClass = 'avatar'){
		if(!propsAndChildren.size){
			propsAndChildren.size = 130;
		}
		if(!propsAndChildren.photo){
			propsAndChildren.imgClass = 'avatar__noPhoto';
		}
		super(propsAndChildren, tagName, defaultClass);
	}

	render(){
		return this.compile(tmpl);
	}
}