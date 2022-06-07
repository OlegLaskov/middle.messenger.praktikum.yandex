import InputBlock from '../inputBlock';
import tmpl from './lineinput.hbs';
import './lineinput.scss';

export default class LineInput extends InputBlock{
	render(){
		console.log('InputBlock render=', this.props);
		return this.compile(tmpl, this.props);
	}
}