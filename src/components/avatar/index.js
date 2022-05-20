/* import Handlebars from 'handlebars';
import tmpl from './avatar.hbs';
import './avatar.scss';

Handlebars.registerPartial('avatar', tmpl);

export default ({avatarSrc, avatarAlt, avatarClass}) => {return tmpl({avatarSrc, avatarAlt, avatarClass})}; */

import tmpl from './avatar.hbs';
import Component from '../../utils/component';
import './avatar.scss';

export default class Avatar extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'avatar'){
		super(tagName, propsAndChildren, defaultClass);
	}

	render(){
		console.log('Avatar render');
		return this.compile(tmpl);
	}
}