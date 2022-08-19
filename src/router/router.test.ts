import { expect } from "chai";
import Router from ".";
import Component from "../utils/component";

describe('Проверяем переходы у Роута', () => {
	it('Переход на новую страницу должен менять состояние сущности history', () => {
		// window.history.pushState({page: 'login'}, 'Login', '/');
		// window.history.pushState({page: 'sign-up'}, 'Sign up', '/sign-up');
		// window.history.pushState({page: 'error404'}, 'Error 404', '/error404');
		const router = new Router('#root');
		class Home extends Component {
			constructor(){
				super('div', {attr:{id: 'home'}});
			}
		}
		router.use('/', Home);
		router.start();
	
		expect(window.history.length).to.eq(3);
	});
  }); 