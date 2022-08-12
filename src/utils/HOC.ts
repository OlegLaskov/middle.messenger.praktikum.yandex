import userApi from "../api/user-api";
import { User } from "../pages/ProfilePage";
import Router from '../router';
import { PATH } from "../router/paths";
import Component from "./component";
import store, { Indexed, StoreEvents } from "./store";

const router = new Router('#root');

export function connect(ExtComponent: typeof Component, mapStateToProps?: (state: Indexed)=>Indexed) {
	
	return class extends ExtComponent {
		constructor(...args: any){
			super(...args);
			store.on(StoreEvents.Updated, ()=>{
				const state = store.getState();
				if(mapStateToProps){
					console.log('mapStateToProps', state);
					this.setProps({...this.props, ...mapStateToProps(state)});
				} else {
					this.setProps({...this.props, ...state});
				}
			});
		}
	}
}

export function saveUserDataToStore(){
	store.set('userLoading', true);
		userApi.getUser()
			.then((data)=>{
				if(data && typeof data === 'string'){
					const user: User = JSON.parse(data);
					if(!user.id) router.go(PATH.LOGIN);
					store.set('user', user);
					store.set('userLoading', false);
					console.log('user=', user);
				}
			})
			.catch((e)=>{
				console.log(e);
				store.set('userLoading', false);
			});
}