import Component from "../../utils/component";
import './chatNav.scss';
import tmpl from './chatNav.hbs';

export default class ChatNav extends Component{
	render(){
		console.log('ChatNav render=', this.props);
		return this.compile(tmpl, this.props);
	}
}