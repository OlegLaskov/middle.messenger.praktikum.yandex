/* eslint-disable @typescript-eslint/no-unused-vars */
export default interface BaseAPI {
	
	create(_data?: unknown): Promise<string|Error>;

	request(_data?: unknown): Promise<string|Error>;

	update(_data?: unknown): Promise<string|Error>;

	delete(_data?: unknown): Promise<string|Error>;
}