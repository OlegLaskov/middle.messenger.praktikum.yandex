import { expect } from "chai";
import { describe } from "mocha";

function hello(value){
	return `Hello ${value}`;
}
describe('Test TS+Babel', ()=>{
	it('Shold return string correctly', ()=>{
		expect(hello('mocha'), 'Hello mocha');
	});
});