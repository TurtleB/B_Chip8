// Handles graphics output using p5.js canvas for drawing screen contents.
function GraphicsController(width, height, scale) {
	this.width = width;
	this.height = height;
	this.scale = scale;
	
	this.graphics = null;
	
	
	// Register the B_GRAPHICS for this controller
	this.setGraphics = function(graphics) {
		this.graphics = graphics;
	}
	
	
	//
	this.updateScreen = function() {
		if(this.graphics != null && this.graphics.draw) {
			noStroke();
			var buffer = this.graphics.buffer;
			for(var r = 0; r < this.height; r++) {
				for(var c = 0; c < this.width; c++) {
					if(buffer[r][c] == 0x0) {
						fill(0);
					} else {
						fill(0, 255, 0);
					}
					rect(c * this.scale, r * this.scale, this.scale, this.scale);
				}
			}
			this.graphics.resetDraw();
		}
	};
}