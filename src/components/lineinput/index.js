import Handlebars from 'handlebars';
import tmpl from './lineinput.hbs';
import './lineinput.scss';

Handlebars.registerPartial('lineinput', tmpl);

export default ({field, value, type, name, placeholder, class1, class2, class3}) => 
	{return tmpl({field, value, type, name, placeholder, class1, class2, class3})};