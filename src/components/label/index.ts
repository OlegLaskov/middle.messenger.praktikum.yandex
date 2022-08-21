import tmpl from './label.hbs';
import Component from '../../core/component';

export default class Label extends Component{

	render(){
		return this.compile(tmpl);
	}
}