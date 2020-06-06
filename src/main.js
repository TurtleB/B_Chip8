/* Main file and entry point for B_CHIP8
 * Contains p5.js lifecycle methods, environment setup, and execution loop for B_CHIP8
 *
 */
 
var b_register = null;
var b_stack = null;
var b_ram = null;
var b_graphics = null;
var b_keyboard = null;
var b_cpu = null;

var chipController = null;
var graphicsController = null;
var keyboardController = null;

//
function setup() {
	initializeComponents();
	loadProgram();
	setupChip();
	setupGraphics();
	setupKeyboard();
	// TODO - Setup for debug views
	//noLoop();
};


//
function draw() {
	keyboardController.updateKeyState();
	chipController.stepTimerCycle();
	graphicsController.updateScreen();
}


//
function initializeComponents() {
	b_register = new B_REGISTER();
	b_stack = new B_STACK();
	b_ram = new B_RAM();
	b_graphics = new B_GRAPHICS();
	b_keyboard = new B_KEYBOARD();
	b_cpu = new B_CPU();
}


// TODO - Load in JSON or something
function loadProgram() {
	b_ram.write(0x000, MEM_DIGIT_SPRITES);
	b_ram.write(0x200, MEM_B_ADVENTURE_2_TEST_CODE);
	b_ram.write(0xf00, MEM_B_ADVENTURE_2_DRAW_FUNCTIONS);
	b_ram.write(0xff0, MEM_B_ADVENTURE_2_SPRITES);
}


// TODO - no magic numbers
function setupChip() {
	chipController = new ChipController(10);
	chipController.setCPU(b_cpu);
}


// TODO - No magic numbers pls
function setupGraphics() {
	var screenCanvas = createCanvas(64*8, 32*8);
	screenCanvas.parent("testcanv");
	graphicsController = new GraphicsController(64, 32, 8);
	graphicsController.setGraphics(b_graphics);
	frameRate(60);
}


// TODO - externalize key mapping.
function setupKeyboard() {
	var keyMap = [
		88, 49, 50, 51, //  X (0x0), 1 (0x1), 2 (0x2), 3 (0x3)
		81, 87, 69, 65, // Q (0x4), W (0x5), E (0x6), A (0x7)
		83, 68, 90, 67, // S (0x8), D (0x9), Z (0xa), C (0xb)
		52, 82, 70, 86  // 4 (oxc), R (0xd), F (0xe), V (0xf)
	];
	keyboardController = new KeyboardController(keyMap);
	keyboardController.setKeyboard(b_keyboard);
}


// TODO - Setup sound


// TODO - Setup debug