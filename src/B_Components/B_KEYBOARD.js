function B_KEYBOARD() {
	this.keyState = [];
	this.numKeys = 0x10;
	
	for(var i = 0; i < this.numKeys; i++) {
		this.keyState.push(0x0);
	}
	
	
	//
	this.getKeyState = function(keyIndex) {
		return this.keyState[keyIndex];
	};
	
	
	//
	this.setKeyState = function(keyIndex, keyState) {
		this.keyState[keyIndex] = keyState;
	};
	
	
	//
	this.getCurrentKeyDown = function() {
		for(var i = 0; i < this.numKeys; i++) {
			if(this.keyState[i] == 1) {
				return i;
			}
		}
		return -1;
	};
}
