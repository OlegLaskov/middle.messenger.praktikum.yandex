import Handlebars from 'handlebars';
import tmpl from './avatar.hbs';
import './avatar.scss';

Handlebars.registerPartial('avatar', tmpl);

export default ({avatarSrc, avatarAlt, avatarClass}) => {return tmpl({avatarSrc, avatarAlt, avatarClass})};