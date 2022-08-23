import { expect } from "chai";
import Router from ".";
import Component from "../core/component";
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM(
	`<html>
	   <body>
		<div id="root"></div>
	   </body>
	 </html>`,
	{ url: 'https://localhost:3000' }
);

global.window = jsdom.window as unknown as Window & typeof globalThis;
global.document = jsdom.window.document;

describe('Router testing', () => {
	const router = new Router('#root');
	class Home extends Component {
		constructor(){
			super({attr:{id: 'home'}}, 'div');
		}
	}
	class Login extends Component {
		constructor(){
			super({attr:{id: 'login'}}, 'nav');
		}
	}
	class Signup extends Component {
		constructor(){
			super({attr:{id: 'signup'}}, 'main');
		}
	}
	class Error extends Component {
		constructor(){
			super({attr:{id: 'error'}}, 'form');
		}
	}

	router.setErrorRoute('/error');
	router.use('/', Home)
		.use('/login', Login)
		.use('/signup', Signup)
		.use('/error', Error)
		.start();

	it('Тестим руты', () => {

		expect(router.getRoute('/')?.match('/')).to.eq(true);
		expect(router.getRoute('/login')?.match('/login')).to.eq(true);
		expect(router.getRoute('/signup')?.match('/signup')).to.eq(true);
		expect(router.getRoute('/something')).to.equal(null);
	});

	it('Тестим переходы', () => {
		router.go('/login');
		router.go('/signup');
		router.go('/error');
		router.back();
		setTimeout(()=>{
			expect(document.getElementById('signup')?.style?.display).to.equal('block');
			router.back();
			setTimeout(()=>{
				expect(document.getElementById('login')?.style?.display).to.equal('block');
				router.forward();
				setTimeout(()=>{
					expect(document.getElementById('login')?.style?.display).to.equal('none');
					expect(document.getElementById('signup')?.style?.display).to.equal('block');
					router.go('/something');
					expect(document.getElementById('error')?.style?.display).to.equal('block');
				}, 50);
			}, 50);
		}, 50);
		

	});
}); 