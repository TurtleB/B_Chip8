// RAM module with  basic read/write functions.
function B_RAM() {
	// Addressable bytes of memory.
	this.capacity = 4096;
	// Memory data.
	this.memory = [];
	// Observer to notify of write operations.
	this.observer = null;
	
	// Initialize memory to 0.
	for(var i = 0; i < this.capacity; i++) {
		this.memory.push(0);
	}
	
	
	// Returns an array of bytes stored in memory starting from address up to address + size - 1 inclusive.
	this.read = function(address, size) {
		this.assertAddressIsValid(address, size);
		var data = [];
		for(var i = address; i < address + size; i++) {
			data.push(this.memory[i]);
		}
		return data;
	};
	
	
	// Sets byte stored at address to data.
	this.write = function(address, data) {
		var size = data.length;
		this.assertAddressIsValid(address, size);
		for(var i = 0; i < size; i++) {
			this.memory[address + i] = data[i];
		}
		if(this.observer != null) {
			this.observer.onMemoryWrite(address, size);
		}
	};
	
	
	//
	this.setObserver = function(observer) {
		this.observer = observer;
	};
	
	
	// Throws an exception if memory address and size parameters are not valid or will go out of bounds.
	this.assertAddressIsValid = function(address, size) {
		if(address < 0 || address + size > this.capacity) {
			throw "MEMORY_ACCESS_EXCEPTION: requested memory address is out of bounds";
		}
	};
}