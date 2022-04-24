import Handlebars from 'handlebars';
import tmpl from './button.hbs';
import './button.scss';

Handlebars.registerPartial('button', tmpl);

export default ({type, name, class1, label}) => {return tmpl({type, name, class1, label})};