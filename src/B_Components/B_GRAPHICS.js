function B_GRAPHICS() {
	this.width = 64;
	this.height = 32;
	
	this.draw = false;
	
	// Initialize frame buffer
	this.buffer = [];
	for(var r = 0; r < this.height; r++) {
		var row = [];
		for(var c = 0; c < this.width; c++) {
			row.push(0);
		}
		this.buffer.push(row);
	}
	
	
	// Draws the spriteData to the buffer using XOR. Returns true if any 1's were flipped to 0's from the drawing
	this.drawSprite = function(x, y, spriteData) {
		var flag = false;
		// Each byte in spriteData is a row
		for(var spriteRow = 0; spriteRow < spriteData.length; spriteRow++) {
			let bufferRow = (y + spriteRow) % this.height;
			// Go through each bit in the row
			for(var b = 0; b < 8; b++) {
				// Read bits left to right, do something only if sprite bit is 1
				if((spriteData[spriteRow] >> (0x7 - b)) & 0x01 == 0x01) {
					let bufferCol = (x + b) % this.width;
					let currentBit = this.buffer[bufferRow][bufferCol];
					flag = flag || (currentBit == 1);
					this.buffer[bufferRow][bufferCol] = currentBit ^ 0x01;
				}
			}
		}
		this.draw = true;
		return flag;
	};
	
	
	//
	this.clear = function() {
		for(var r = 0; r < this.height; r++) {
			for(var c = 0; c < this.width; c++) {
				this.buffer[r][c] = 0;
			}
		}
		this.draw = true;
	}
	
	
	//
	this.resetDraw = function() {
		this.draw = false;
	}
}