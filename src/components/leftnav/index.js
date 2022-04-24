import Handlebars from 'handlebars';
import tmpl from './leftnav.hbs';
import './leftnav.scss';

Handlebars.registerPartial('leftnav', tmpl);

export default ({onClickLeftNav}) => {return tmpl({onClickLeftNav})};