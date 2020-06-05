// TODO - rename stuff from cell_ to _cell

// TODO - Add ability to modify memory values by clicking on them.

// TODO - When jumping to an address, highlight the cell.

//
class MemoryViewer extends HTMLElement {
	
	// TODO - observed attributes.
	// TODO - change properties.
	
	constructor() {
		super();
		// Properties
		this.rowWidth = 4;
		this.numRows = 4;
		this.currentAddress = 0;
		// TODO - Pass B_RAM from elsewhere.
		this.memory = b_ram;
		this.observe = true;
		
		// Interactive elements
		this.btnScrollUp = document.createElement('button');
		this.btnScrollUp.innerHTML = '&#x2B06';
		
		this.btnScrollDown = document.createElement('button');
		this.btnScrollDown.innerHTML = '&#x2B07';
		
		this.btnJump = document.createElement('button');
		this.btnJump.innerHTML = 'GO';
		this.btnJump.setAttribute('style', 'width:auto;margin-left: 5px;'); // TODO - Add this to its own CSS class
				
		this.fieldJumpAddr = document.createElement('input');
		this.fieldJumpAddr.setAttribute('maxlength', 3);
		this.fieldJumpAddr.setAttribute('size', 3);
		
		this.cellsAddress = [];
		this.cellsData = [];
		
		// Create shadow root
		var shadow = this.attachShadow({mode: 'open'});
		
		// TODO - wrapper element?
		
		// Table
		var table = document.createElement('table');
		// Header row
		var headerRow = document.createElement('tr');
		headerRow.appendChild(document.createElement('th'));
		headerRow.querySelector('th').appendChild(this.btnScrollUp);
		for(var i = 0; i < this.rowWidth; i++) {
			let headerCell = document.createElement('th');
			headerCell.innerHTML = '[' + i + ']';
			headerRow.appendChild(headerCell);
		}
		table.appendChild(headerRow);
		
		// Data rows
		for(var i = 0; i < this.numRows; i++) {
			let row = document.createElement('tr');
			let cellAddr = document.createElement('td');
			cellAddr.setAttribute('class', 'cell_address');
			this.cellsAddress.push(cellAddr);
			row.appendChild(cellAddr);
			this.cellsData.push([]);
			for(var j = 0; j < this.rowWidth; j++) {
				let cellData = document.createElement('td');
				cellData.setAttribute('class', 'cell_data');
				this.cellsData[i].push(cellData);
				row.appendChild(cellData);
			}
			table.append(row);
		}
		
		// Footer row
		var footerRow = document.createElement('tr');
		footerRow.appendChild(document.createElement('th'));
		footerRow.querySelector('th').appendChild(this.btnScrollDown);
		var footerCell = document.createElement('th');
		footerCell.setAttribute('colspan', this.rowWidth);
		footerCell.setAttribute('class', 'footer_cell');
		footerCell.innerHTML = '0x';
		footerCell.appendChild(this.fieldJumpAddr);
		footerCell.appendChild(this.btnJump);
		footerRow.appendChild(footerCell);
		table.appendChild(footerRow);
		
		// Add CSS
		const styleLink = document.createElement('link');
		styleLink.setAttribute('rel', 'stylesheet');
		styleLink.setAttribute('href', 'debug/mem_view_style.css');
		
		// Link elements to shadow DOM
		shadow.appendChild(styleLink);
		shadow.appendChild(table);
		
		// Function to populate table with data starting at current address and toggle buttons appropriately
		this.refreshTable = function() {
			// Update data
			var memArray = this.memory.read(this.currentAddress, (this.numRows * this.rowWidth));
			for(var r = 0; r < this.numRows; r++) {
				let addr = this.currentAddress + (r * this.rowWidth);
				this.cellsAddress[r].innerHTML = formatHex(addr, 3);
				for(var c = 0; c < this.rowWidth; c++) {
					this.cellsData[r][c].innerHTML = formatHex(memArray[(r * this.rowWidth) + c], 2);
				}
			}
			// Update buttons
			if(this.currentAddress == 0) {
				this.btnScrollUp.disabled = true;
			} else {
				this.btnScrollUp.disabled = false;
			}
			if(this.currentAddress + memArray.length >= this.memory.capacity) {
				this.btnScrollDown.disabled = true;
			} else {
				this.btnScrollDown.disabled = false;
			}
		};
		
		// Button events
		var memView = this;
		this.scrollUp = function() {
			memView.currentAddress -= memView.rowWidth;
			memView.refreshTable();
		};
		this.btnScrollUp.onclick = this.scrollUp;
		this.scrollDown = function() {
			memView.currentAddress += memView.rowWidth;
			memView.refreshTable();
		};
		this.btnScrollDown.onclick = this.scrollDown;
		this.jumpToAddress = function() {
			let jumpAddr = hexToNumber(memView.fieldJumpAddr.value);
			if(isValidAddress(jumpAddr, memView.memory.capacity)) {
				var viewAddress = jumpAddr - (jumpAddr % memView.rowWidth);
				if(viewAddress + (memView.numRows * memView.rowWidth) >= memView.memory.capacity) {
					viewAddress = memView.memory.capacity - (memView.numRows * memView.rowWidth);
				}
				memView.currentAddress = viewAddress;
				memView.refreshTable();
				// TODO - use CSS class to do this.
				memView.fieldJumpAddr.style.border = "2px solid transparent";
			} else {
				// TODO - Use CSS class to do this.
				memView.fieldJumpAddr.style.border = "2px solid red";
			}
		};
		this.btnJump.onclick = this.jumpToAddress;
		
		// Updates table when memory that is currently being viewed is updated
		this.onMemoryWrite = function(address, length) {
			if(this.observe) {
				if((address + length) > this.currentAddress && address < (this.currentAddress + (this.numRows * this.rowWidth))) {
					this.refreshTable();
				}
			}
		};
		
		// Refresh table to initial state once everything is in place
		this.refreshTable();
		
		// Register memView as observer of b_ram
		b_ram.setObserver(this);
	}
	
	// TODO - Callbacks
}

// TODO - Move these to global functions

//
function formatHex(num, digits) {
	var hexString = num.toString(16);
	var formatted = '0x';
	for(var i = 0; i < digits - hexString.length; i++) {
		formatted = formatted + '0';
	}
	formatted = formatted + hexString;
	return formatted;
}

// Returns true if address is a valid integer between 0 (inclusive) and capacity (exclusive)
function isValidAddress(address, capacity) {
	return !isNaN(address) && address >= 0 && address < capacity;
}

// Copied from SO. Parses a hex string and doesn't stop at invalid characters like Number.parseInt does
function hexToNumber(string) {
	if(!/^(0x)?[0-9a-f]+$/i.test(string)) {
		return Number.NaN;
	} else {
		return parseInt(string, 16);
	}
}

// Define element
customElements.define('mem-view', MemoryViewer);