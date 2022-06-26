import Component from "./component";
import store, { Indexed, StoreEvents } from "./store";

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
					console.log('NOT mapStateToProps', state);
					
					this.setProps({...this.props, ...state});
				}
			});
		}
	}
}