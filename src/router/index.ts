import Component from "../core/component";
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
				route.render();
			} catch(e){
				console.log('Error:', e);
				
			}
		} else {
			console.log('Route not found');
			this.go(PATH.ERROR404);
		}
	}

	public go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	public back() {
		this.history.back();
	}

	public forward() {
		this.history.forward();
	}

	public getRoute(pathname: string) {
		return this.routes.find(route => route.match(pathname)) || null;
	}
}