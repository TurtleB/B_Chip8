//
function B_STACK() {
	this.sp = 0;
	this.stack = [];
	this.size = 16;
	
	for(var i = 0; i < this.size; i++) {
		this.stack.push(0);
	}
	
	this.stack[0x0] = 0x200;
	
	
	// Increment stack pointer and push address to the top of the stack
	this.push = function(address) {
		this.sp++;
		if(this.sp >= this.stack.length) {
			throw "STACK_OVERFLOW_EXCEPTION: address pushed to stack, but stack is full!";
		} else {
			this.stack[this.sp] = address;
		}
	};
	
	
	// Return the value currently on top of the stack and decrement the stack pointer
	this.pop = function() {
		if(this.sp > 0) {
			let address = this.stack[this.sp];
			this.sp--;
			return address;
		} else {
			throw "STACK_UNDERFLOW_EXCEPTION: stack pointer is < 0!";
		}
	};
}