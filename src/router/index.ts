import Component from "../utils/component";
import { PATH } from "./paths";
import Route from "./route";

export default class Router {

	private static __instance: Router;
	private routes: Route[];
	private history: History;
	private _currentRoute: Route|null;
	private _rootQuery: string;

	constructor(rootQuery: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		this.routes = [];
		this.history = window.history;
		this._currentRoute = null;
		this._rootQuery = rootQuery;

		Router.__instance = this;
	}

	use(pathname: string, block: {new(): Component}, props?: object) {
		const route = new Route(pathname, block, {...props, rootQuery: this._rootQuery});
		this.routes.push(route);
		return this;
	}

	start() {
		window.onpopstate = event => {
			const doc = event?.currentTarget;
			if(doc){
				console.log('ONPOPSTATE: pathname', (<Document> doc).location?.pathname);
				alert('location');
				this._onRoute((<Document> doc).location?.pathname);
			}
		}
		this._onRoute(window.location.pathname);
	}

	_onRoute(pathname: string) {
		const route = this.getRoute(pathname);

		if (this._currentRoute && !this._currentRoute.match(pathname)) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		if(route){
			try{
				route.render(); //(route, pathname);
			} catch(e){
				console.log('Error:', e);
				setTimeout(()=>{this.go(PATH.ERROR500);}, 1000);
				
			}
		} else {
			console.log('Route not found');
			this.go(PATH.ERROR404);
		}
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	back() {
		this.history.back();
	}

	forward() {
		this.history.forward();
	}

	getRoute(pathname: string) {
		return this.routes.find(route => route.match(pathname)) || null;
	}
}