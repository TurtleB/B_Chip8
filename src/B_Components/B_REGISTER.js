// Register file for 8-bit registers
function B_REGISTER() {
	this.registers = [];
	this.numRegisters = 16;
	
	// Initialize registers to 0
	for(var i = 0; i < this.numRegisters; i++) {
		this.registers.push(0);
	}
	
	
	// Returns the byte stored in V[registerNum]
	this.read = function(registerNum) {
		return this.registers[registerNum];
	};
	
	
	// Writes value of data to V[registerNum], truncating anything to the left of the least significant byte
	this.write = function(registerNum, data) {
		this.registers[registerNum] = data & 0xff;
	};
}