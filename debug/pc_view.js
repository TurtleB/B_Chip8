class PCViewer extends HTMLElement {
	constructor() {
		super();
		
		// TODO - Pass this in as a parameter.
		this.cpu = b_cpu;
		this.pcData = null;
		this.opData = null;
		
		this.observe = true;
		
		// Attach shadow root
		var shadow = this.attachShadow({mode: 'open'});
		
		// Create view components
		var table = document.createElement('table');
		// Headers
		let headerRow = document.createElement('tr');
		let pcHeader = document.createElement('th');
		pcHeader.innerHTML = 'PC';
		let opHeader = document.createElement('th');
		opHeader.innerHTML = 'OP';
		headerRow.appendChild(pcHeader);
		headerRow.appendChild(opHeader);
		table.appendChild(headerRow);
		// Content
		let dataRow = document.createElement('tr');
		this.pcData = document.createElement('td');
		this.pcData.setAttribute('class', 'pcValue');
		this.opData = document.createElement('td');
		dataRow.appendChild(this.pcData);
		dataRow.appendChild(this.opData);
		table.appendChild(dataRow);
		
		// Refresh contents to show current PC and op
		this.refreshTable = function() {
			this.pcData.innerHTML = formatHex(this.cpu.pc, 3);
			this.opData.innerHTML = formatHex(this.cpu.getOp(), 4);
		}
		
		//
		this.onPCUpdated = function() {
			if(this.observe) {
				this.refreshTable();
			}
		}
		
		// Add CSS
		const styleLink = document.createElement('link');
		styleLink.setAttribute('rel', 'stylesheet');
		styleLink.setAttribute('href', 'debug/pc_view_style.css');
		
		// Link elements to shadow DOM
		shadow.appendChild(styleLink);
		shadow.appendChild(table);
		
		this.cpu.setPCObserver(this);
		this.refreshTable();
	}	
}


// Define element
customElements.define('pc-view', PCViewer);