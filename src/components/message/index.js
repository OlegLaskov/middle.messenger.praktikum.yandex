import tmpl from './message.hbs';
import Component from '../../utils/component';
import './message.scss';

export default class Message extends Component{

	render(){
		console.log('Message render');
		return this.compile(tmpl);
	}
}