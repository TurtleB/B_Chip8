function B_CPU() {
	// TODO - Rearrange functions so that "public" ones will be at the top.
	
	// TODO - Pass these in as parameters.
	this.memory = b_ram;
	this.register = b_register;
	this.stack = b_stack;
	this.graphics = b_graphics;
	this.keyboard = b_keyboard;
	
	this.pc = 0x200;
	this.vI = 0;
	this.dt = 0;
	this.st = 0;
	
	this.pcObserver = null;
	this.vIObserver = null;
	this.graphicsOut = null;
	
	
	// Gets the opcode by reading 2 bytes from memory at the PC address
	this.getOp = function() {
		let opBytes = this.memory.read(this.pc, 2);
		return (opBytes[0] << 8) + opBytes[1];
	}
	
	
	// Sets the PC register to the given value and alerts the PC observer
	this.setPC = function(nextPC) {
		this.pc = nextPC;
		if(this.pcObserver != null) {
			this.pcObserver.onPCUpdated();
		}
	}
	
	
	// Sets the I register to the given value and alerts the VI observer
	this.setVI = function(vI) {
		this.vI = vI;
		if(this.vIObserver != null) {
			this.vIObserver.onVIUpdated();
		}
	}
	
	
	// Decode and execute opcode
	this.executeOpCode = function(opCode) {
		let x = 0;
		let result = 0;
		let registerContents = [];
		
		// Decode first nibble, then other bits as necessary to determine operation
		switch(opCode & 0xf000) {
			
			case 0x0000:
				switch(opCode & 0x00ff) {
					
					// 00E0 = CLS
					case 0x00e0:
						this.graphics.clear();
						this.setPC(this.pc + 2);
					break;
					
					// 00EE = RET
					case 0x00ee:
						this.setPC(this.stack.pop());
					break;
					
					// TODO - default case for unknown 0x0000 op.
				}
			break;
			
			// 1nnn = JP addr
			case 0x1000:
				this.setPC(opCode & 0x0fff);
			break;
			
			// 2kkk = CALL addr
			case 0x2000:
				this.stack.push(this.pc + 2);
				this.setPC(opCode & 0x0fff);
			break;
			
			// 3xkk = SE Vx, byte
			case 0x3000:
				if(this.register.read((opCode & 0x0f00) >> 8) == (opCode & 0x00ff)) {
					this.setPC(this.pc + 4);
				} else {
					this.setPC(this.pc + 2);
				}
			break;
			
			// 4xkk = SNE Vx, byte
			case 0x4000:
				if(this.register.read((opCode & 0x0f00) >> 8) != (opCode & 0x00ff)) {
					this.setPC(this.pc + 4);
				} else {
					this.setPC(this.pc + 2);
				}
			break;
			
			// 5xy0 = SE Vx, Vy
			case 0x5000: // TODO - if opCode & 0x000f != 0, throw unknown opcode exception
				if(this.register.read((opCode & 0x0f00) >> 8) == this.register.read((opCode & 0x00f0) >> 4)) {
					this.setPC(this.pc + 4);
				} else {
					this.setPC(this.pc + 2);
				}
			break;
			
			// 6xkk = LD Vx, byte
			case 0x6000:
				this.register.write((opCode & 0x0f00) >> 8, opCode & 0x00ff);
				this.setPC(this.pc + 2);
			break;
			
			// 7xkk = ADD Vx, byte
			case 0x7000:
				x = (opCode & 0x0f00) >> 8;
				this.register.write(x, this.register.read(x) + (opCode & 0x00ff));
				this.setPC(this.pc + 2);
			break;
			
			case 0x8000:
				switch(opCode & 0x000f) {
					
					// 8xy0 = LD Vx, Vy
					case 0x0000:
						this.register.write((opCode & 0x0f00) >> 8, this.register.read((opCode & 0x00f0) >> 4));
						this.setPC(this.pc + 2);
					break;
					
					// 8xy1 = OR Vx, Vy
					case 0x0001:
						x = (opCode & 0x0f00) >> 8;
						this.register.write(x, this.register.read(x) | this.register.read(opCode & 0x00f0 >> 4));
						this.setPC(this.pc + 2);
					break;
					
					// 8xy2 = AND Vx, Vy
					case 0x0002:
						x = (opCode & 0x0f00) >> 8;
						this.register.write(x, this.register.read(x) & this.register.read(opCode & 0x00f0 >> 4));
						this.setPC(this.pc + 2);
					break;
					
					// 8xy3 = XOR Vx, Vy
					case 0x0003:
						x = (opCode & 0x0f00) >> 8;
						this.register.write(x, this.register.read(x) ^ this.register.read(opCode & 0x00f0 >> 4));
						this.setPC(this.pc + 2);
					break;
					
					// 8xy4 = ADD Vx, Vy
					case 0x0004:
						x = (opCode & 0x0f00) >> 8;
						result = this.register.read(x) + this.register.read(opCode & 0x00f0 >> 4);
						if(result > 0xff) {
							this.register.write(0xf, 1);
						} else {
							this.register.write(0xf, 0);
						}
						this.register.write(x, result);
						this.setPC(this.pc + 2);
					break;
					
					// 8xy5 = SUB Vx, Vy
					case 0x0005:
						x = (opCode & 0x0f00) >> 8;
						result = this.register.read(x) - this.register.read(opCode & 0x00f0 >> 4);
						if(result >= 0) {
							this.register.write(0xf, 1);
						} else {
							result = 0xff + result;
							this.register.write(0xf, 0);
						}
						this.register.write(x, result);
						this.setPC(this.pc + 2);
					break;
					
					// 8xy6 = SHR Vx {, Vy}
					case 0x0006:
						x = (opCode & 0x0f00) >> 8;
						this.register.write(0xf, this.register.read(x) & 0x0001);
						this.register.write(x, this.register.read(x) >>> 1);
						this.setPC(this.pc + 2);
					break;
					
					// 8xy7 = SUBN Vx, Vy
					case 0x0007:
					x = (opCode & 0x0f00) >> 8;
						result = this.register.read(opCode & 0x00f0 >> 4) - this.register.read(x);
						if(result >= 0) {
							this.register.write(0xf, 1);
						} else {
							result = 0xff + result;
							this.register.write(0xf, 0);
						}
						this.register.write(x, result);
						this.setPC(this.pc + 2);
					break;
					
					// 8xyE = SHL Vx {, Vy}
					case 0x000e:
						x = (opCode & 0x0f00) >> 8;
						this.register.write(0xf, this.register.read(x) & 0x8000);
						this.register.write(x, this.register.read(x) << 1);
						this.setPC(this.pc + 2);
					break;
					
					// TODO - Default case for unknown 0x8000 opcode.
				}
			break;
			
			// 9xy0 = SNE, Vx, Vy
			case 0x9000:
				if(this.register.read((opCode & 0x0f00) >> 8) != this.register.read((opCode & 0x00f0) >> 4)) {
					this.setPC(this.pc + 4);
				} else {
					this.setPC(this.pc + 2);
				}
			break;
			
			// Annn = LD I, addr
			case 0xa000:
				this.setVI(opCode & 0x0fff);
				this.setPC(this.pc + 2);
			break;
			
			// Bnnn = JP V0, addr
			case 0xb000:
				this.setPC((opCode & 0x0fff) + this.register.read(0x0));
			break;
			
			// Cxkk = RND Vx, byte
			case 0xc000:
				this.register.write((opCode & 0x0f00) >> 8, Math.floor(Math.random * 0x100) & (opCode & 0x00ff));
				this.setPC(this.pc + 2);
			break;
			
			// Dxyn = DRAW Vx, Vy, nibble
			case 0xd000:
				let spriteData = this.memory.read(this.vI, opCode & 0x000f);
				result = this.graphics.drawSprite(this.register.read((opCode & 0x0f00) >> 8), this.register.read((opCode & 0x00f0) >> 4), spriteData);
				if(result) {
					this.register.write(0xf, 0x01);
				} else {
					this.register.write(0xf, 0x00);
				}
				this.setPC(this.pc + 2);
			break;
			
			case 0xe000:
				switch(opCode & 0x00ff) {
					
					// Ex9E = SKP Vx
					case 0x009e:
						if(this.keyboard.getKeyState(this.register.read((opCode & 0x0f00) >> 8)) == 0x1) {
							this.setPC(this.pc + 4);
						} else {
							this.setPC(this.pc + 2);
						}
					break;
					
					// ExA1 = SKNP Vx
					case 0x00a1:
						if(this.keyboard.getKeyState(this.register.read((opCode & 0x0f00) >> 8)) == 0x0) {
							this.setPC(this.pc + 4);
						} else {
							this.setPC(this.pc + 2);
						}
					break;
					
					// TODO - Default case for unknown 0xe000 opcode.
				}
			break;
			
			case 0xf000:
				switch(opCode & 0x00ff) {
					
					// Fx07 = LD Vx, DT
					case 0x0007:
						this.register.write((opCode & 0x0f00) >> 8, this.dt);
						this.setPC(this.pc + 2);
					break;
					
					// Fx0A = LD Vx, K
					case 0x000a:
						if(this.keyboard.getCurrentKeyDown() >= 0x0) {
							this.register.write((opCode & 0x0f00) >> 8, this.keyboard.getCurrentKeyDown());
							this.setPC(this.pc + 2);
						}
					break;
					
					// Fx15 = LD DT, Vx
					case 0x0015:
						this.dt = this.register.read((opCode & 0x0f00) >> 8);
						this.setPC(this.pc + 2);
					break;
					
					// Fx18 = LD ST, Vx
					case 0x0015:
						this.st = this.register.read((opCode & 0x0f00) >> 8);
						this.setPC(this.pc + 2);
					break;
					
					// Fx1E = ADD I, Vx
					case 0x001e:
						this.setvI(this.vI + this.register.read((opCode & 0x0f00) >> 8));
						this.setPC(this.pc + 2);
					break;
					
					// Fx29 = LD F, Vx
					case 0x0029:
						this.setVI(this.register.read((opCode & 0x0f00) >> 8) * 0x5);
						this.setPC(this.pc + 2);
					break;
					
					// Fx33 = LD B, Vx
					case 0x0033:
						x = this.register.read((opCode & 0x0f00) >> 8);
						this.memory.write(this.vI, [(x - (x % 100)) / 100, ((x % 100) - (x % 10)) / 10, x % 10]);
					break;
					
					// Fx55 = LD [I], Vx
					case 0x0055:
						for(var i = 0; i < (opCode & 0x0f00) >> 8; i++) {
							registerContents.push(this.register.read(i));
						}
						this.memory.write(this.vI, registerContents);
						this.setPC(this.pc + 2);
					break;
					
					// Fx65 = LD Vx, [I]
					case 0x0065:
						x = (opCode & 0x0f00);
						registerContents = this.memory.read(this.vI, x);
						for(var i = 0; i < x; i++) {
							this.reigster.write(i, registerContents[i]);
						}
						this.setPc(this.pc + 2);
					break;
					
					// TODO - Default case for unknown opcode
				}
			break;
		}
	}
	
	
	// TODO - alert observers
	//
	this.updateTimers = function() {
		if(this.dt > 0) {
			this.dt--;
		}
		if(this.st > 0) {
			this.st--;
		}
	};
	
	
	// Simulate a single cycle of the CHIP-8 CPU
	this.cycle = function() {
		var op = this.getOp();
		this.executeOpCode(op);
	};
	
	
	//
	this.setGraphicsOut = function(graphicsOut) {
		this.graphicsOut = graphicsOut;
	};
	
	
	//
	this.setPCObserver = function(pcObserver) {
		this.pcObserver = pcObserver;
	};
	
	
	//
	this.setVIObserver = function(vIObserver) {
		this.vIObserver = vIObserver;
	};
	
}