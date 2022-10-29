import { expect } from "chai";
import Component from "./component";

describe('Component testing', () => {
	const div = new Component({test: 'test'}, 'div', 'div__test');
	const p = new Component({attr: {id: 'test'}}, 'p', 'p__test test1');
	const button = new Component({events: {click: ()=>{console.log('test')}}}, 'button', 'button__test t2 t3');
	const a = new Component({attr: {href: '/login'}}, 'a', 't1 t2 t3 a__test');
	it('Tag test', () => {
		expect(div.element.tagName.toUpperCase()).to.eq('DIV');
		expect(p.element.tagName.toUpperCase()).to.eq('P');
		expect(button.element.tagName.toUpperCase()).to.eq('BUTTON');
		expect(a.element.tagName.toUpperCase()).to.eq('A');
	});
	it('Class test', () => {
		{
			const {classList} = div.element;
			expect(classList?.length).to.eq(1);
			expect(classList?.[0]).to.eq('div__test');
		}
		{
			const {classList} = p.element;
			expect(classList?.length).to.eq(2);
			expect(classList?.[0]).to.eq('p__test');
		}
		{
			const {classList} = button.element;
			expect(classList?.length).to.eq(3);
			expect(classList?.[0]).to.eq('button__test');
		}
		{
			const {classList} = a.element;
			expect(classList?.length).to.eq(4);
			expect(classList?.[3]).to.eq('a__test');
		}
	});
	it('Props test', () => {
		expect(div.props.test).to.eq('test');
		expect(p.element.id).to.eq('test');
		expect((<HTMLAnchorElement> a.element).href).to.eq('/login');
	});
}); 