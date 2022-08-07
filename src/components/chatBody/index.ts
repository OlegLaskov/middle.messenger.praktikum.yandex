import tmpl from './chatBody.hbs';
import Component from '../../utils/component';
import './chatBody.scss';

export default class ChatBody extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'chat__body'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('ChatBody content=', this.props);
		return this.compile(tmpl);
	}
}