import * as Handlebars from 'handlebars';
import Component from '../../utils/component';

export default class List extends Component{
	render(){
		console.log('List render=');
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}