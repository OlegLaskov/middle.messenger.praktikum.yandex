import tmpl from './label.hbs';
import Component from '../../utils/component';
import './label.scss';

export default class Label extends Component{

	render(){
		return this.compile(tmpl);
	}
}