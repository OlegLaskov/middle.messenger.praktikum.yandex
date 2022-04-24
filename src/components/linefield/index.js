import Handlebars from 'handlebars';
import tmpl from './linefield.hbs';
import './linefield.scss';

Handlebars.registerPartial('linefield', tmpl);

export default ({field, value, class1, class2, class3}) => {return tmpl({field, value, class1, class2, class3})};