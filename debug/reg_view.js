
class RegisterViewer extends HTMLElement {
	constructor() {
		super();
		
		this.numRegisters = 16;
		
		this.observe = true;
		
		this.dataCells = [];
		
		// TODO - pass this in somewhere else.
		this.register = b_register;
		
		// Create shadow root
		var shadow = this.attachShadow({mode: 'open'});
		
		// Table, split into 2 rows for compact viewing
		var table = document.createElement('table');
		var headerRow1 = document.createElement('tr');
		var dataRow1 = document.createElement('tr');
		var dataCells1 = [];
		var headerRow2 = document.createElement('tr');
		var dataRow2 = document.createElement('tr');
		var dataCells2 = [];
		for(var i = 0; i < this.numRegisters / 2; i++) {
			let headerCell1 = document.createElement('th');
			headerCell1.innerHTML = 'V' + i.toString(16);
			headerRow1.appendChild(headerCell1);
			let headerCell2 = document.createElement('th');
			headerCell2.innerHTML = 'V' + (i + (this.numRegisters / 2)).toString(16);
			headerRow2.appendChild(headerCell2);
			let dataCell1 = document.createElement('td');
			dataCells1.push(dataCell1);
			dataRow1.appendChild(dataCell1);
			let dataCell2 = document.createElement('td');
			dataCells2.push(dataCell2);
			dataRow2.appendChild(dataCell2);
		}
		this.dataCells = dataCells1.concat(dataCells2);
		table.appendChild(headerRow1);
		table.appendChild(dataRow1);
		table.appendChild(headerRow2);
		table.appendChild(dataRow2);
		
		// TODO - Refresh function and onRegisterWrite function.
		
		// Refresh table to reflect current state of registers
		this.refreshTable = function() {
			for(var i = 0; i < this.numRegisters; i++) {
				this.dataCells[i].innerHTML = formatHex(this.register.read(i), 2);
			}
		};
		
		// Updates table when register is written to
		this.onRegisterWrite = function(registerNum) {
			if(this.observe) {
				this.dataCells[registerNum].innerHTML = formatHex(this.register.read(registerNum), 2);
			}
		};
		
		// Add CSS
		const styleLink = document.createElement('link');
		styleLink.setAttribute('rel', 'stylesheet');
		styleLink.setAttribute('href', 'debug/reg_view_style.css');
		
		// Link elements to shadow DOM
		shadow.appendChild(styleLink);
		shadow.appendChild(table);
		
		// Refresh table to initial state
		this.refreshTable();
		
		b_register.setObserver(this);
	}
}


// Define element
customElements.define('reg-view', RegisterViewer);