function ChipController(cycleRatio) {
	this.cycleRatio = cycleRatio;
	
	// TODO - Have a current tick variable to maintain relative cpu clock speed to 60hz timers in debug mode
	
	this.cpu = null;
	
	
	//
	this.setCPU = function(cpu) {
		this.cpu = cpu;
	};
	
	
	// Performs this.cycleRatio number of clock cycles and one timer update.
	this.stepTimerCycle = function () {
		if(this.cpu != null) {
			for(var i = 0; i < this.cycleRatio; i++) {
				this.cpu.cycle();
			}
			this.cpu.updateTimers();
		}
	};

}