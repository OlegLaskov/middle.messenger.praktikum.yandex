import { expect } from "chai";
import Router from ".";
import Component from "../core/component";

describe('Router testing', () => {
	it('Тестим руты', () => {
		const router = new Router('#root');
		class Home extends Component {
			constructor(){
				super({attr:{id: 'home'}}, 'div');
			}
		}
		class Login extends Component {
			constructor(){
				super({attr:{id: 'login'}}, 'p');
			}
		}
		class Signup extends Component {
			constructor(){
				super({attr:{id: 'signup'}}, 'main');
			}
		}
		router.use('/', Home);
		router.use('/login', Login);
		router.use('/signup', Signup);
	
		expect(router.getRoute('/')?.match('/')).to.eq(true);
		expect(router.getRoute('/login')?.match('/login')).to.eq(true);
		expect(router.getRoute('/signup')?.match('/signup')).to.eq(true);
	});
}); 