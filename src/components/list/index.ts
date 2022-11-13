import {compile} from 'handlebars';
import Component from '../../core/component';

export default class List extends Component{
	render(){
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(compile(tmpl), this.props);
	}
}
