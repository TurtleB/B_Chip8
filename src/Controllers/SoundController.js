// TODO - Set the frequency somewhere.
function SoundController() {
	this.osc = new p5.Oscillator('sine');
	this.isPlaying = false;
	
	this.chip = null;
	
	
	// Set the B_CPU that is controlling sound.
	this.setChip = function(chip) {
		this.chip = chip;
	}
	
	
	//
	this.updateSoundState = function() {
		var isPlaying = this.chip.st > 0;
		if(isPlaying) {
			if(!this.isPlaying) {
				this.osc.start();
			}
		} else {
			this.osc.stop();
		}
		
		this.isPlaying = isPlaying;
	};
}