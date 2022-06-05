import tmpl from './label.hbs';
import Component from '../../utils/component';
import './label.scss';

export default class Label extends Component{

	render(){
		console.log('Label render');
		return this.compile(tmpl);
	}
}