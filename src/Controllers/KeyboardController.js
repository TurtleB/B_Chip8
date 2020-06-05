// Handles keyboard input using p5.js keyIsDown() function
function KeyboardController(keyMap) {
	this.keyMap = keyMap;
	
	this.keyboard = null;
	
	
	// Register the B_KEYBOARD for this controller
	this.setKeyboard = function(keyboard) {
		this.keyboard = keyboard;
	};
	
	
	// Updates B_KEYBOARD keyState basd on keyMap
	this.updateKeyState = function() {
		if(this.keyboard != null) {
			for(var k = 0; k < this.keyboard.numKeys; k++) {
				if(keyIsDown(this.keyMap[k])) {
					this.keyboard.setKeyState(k, 1);
				} else {
					this.keyboard.setKeyState(k, 0);
				}
			}
		}
	};
}