import { expect } from "chai";
import Router from ".";
import Component from "../utils/component";

describe('Router testing', () => {
	it('Тестим руты', () => {
		// window.history.pushState({page: 'login'}, 'Login', 'http://localhost');
		// window.history.pushState({page: 'login'}, 'Login', '/');
		// window.history.pushState({page: 'sign-up'}, 'Sign up', '/sign-up');
		// window.history.pushState({page: 'error404'}, 'Error 404', '/error404');
		const router = new Router('#root');
		class Home extends Component {
			constructor(){
				super('div', {attr:{id: 'home'}});
			}
		}
		class Login extends Component {
			constructor(){
				super('p', {attr:{id: 'login'}});
			}
		}
		class Signup extends Component {
			constructor(){
				super('span', {attr:{id: 'signup'}});
			}
		}
		router.use('/', Home);
		router.use('/login', Login);
		router.use('/signup', Signup);
		// router.start();
		// router.go('/login');
		// router.go('/signup');
		// router.back();
		// router.back();
	
		expect(router.getRoute('/')?.match('/')).to.eq(true);
		expect(router.getRoute('/login')?.match('/login')).to.eq(true);
		expect(router.getRoute('/signup')?.match('/signup')).to.eq(true);
	});
}); 