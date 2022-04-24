import Handlebars from 'handlebars';
import tmpl from './input.hbs';
import './input.scss';

Handlebars.registerPartial('input', tmpl);

export default ({type, name, placeholder, class1, label}) => {return tmpl({type, name, placeholder, class1, label})};