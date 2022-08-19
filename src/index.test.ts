import { expect } from "chai";
import { describe } from "mocha";

function hello(value: string){
	return `Hello ${value}`;
}
describe('Test TS+Babel', ()=>{
	it('Shold return string correctly', ()=>{
		expect(hello('mocha'), 'Hello mocha');
	});
});