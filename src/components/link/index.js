import Handlebars from 'handlebars';
import tmpl from './link.hbs';
import './link.scss';

Handlebars.registerPartial('link', tmpl);

export default ({href, class1, label}) => {return tmpl({href, class1, label})};