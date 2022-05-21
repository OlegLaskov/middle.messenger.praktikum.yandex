import * as Handlebars from 'handlebars';
import tmpl from './error.hbs';
import link from '../../components/link';

Handlebars.registerPartial('error', link);

export default ({title, content, links}: 
	{title: string, content: string, links: object[]}) => {return tmpl({title, content, links})};