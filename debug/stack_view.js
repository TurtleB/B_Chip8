class StackViewer extends HTMLElement {
	constructor() {
		super();
		
		// TODO - pass this as parameter
		this.stack = b_stack;
		this.spData = null;
		this.addrData = null;
		
		this.cpu = b_cpu;
		this.viData = null;
		
		this.observe = true;
		
		// Attach shadow root
		var shadow = this.attachShadow({mode: 'open'});
		
		// Create view components
		var table = document.createElement('table');
		// Headers
		let headerRow = document.createElement('tr');
		let spHeader = document.createElement('th');
		spHeader.innerHTML = 'SP';
		headerRow.appendChild(spHeader);
		let addrHeader = document.createElement('th');
		addrHeader.innerHTML = 'addr';
		headerRow.appendChild(addrHeader);
		let viHeader = document.createElement('th');
		viHeader.innerHTML = 'VI'
		headerRow.appendChild(viHeader);
		table.appendChild(headerRow);
		// Content
		let dataRow = document.createElement('tr');
		this.spData = document.createElement('td');
		this.spData.setAttribute('class', 'spValue');
		dataRow.appendChild(this.spData);
		this.addrData = document.createElement('td');
		dataRow.appendChild(this.addrData);
		this.viData = document.createElement('td');
		dataRow.appendChild(this.viData);
		table.appendChild(dataRow);
		
		// Refresh contents to show SP and addr
		this.refreshStackData = function() {
			this.spData.innerHTML = formatHex(this.stack.sp, 2);
			this.addrData.innerHTML = formatHex(this.stack.stack[this.stack.sp], 3);
		};
		
		//
		this.onStackUpdated = function() {
			if(this.observe) {
				this.refreshStackData();
			}
		};
		
		
		//
		this.refreshVIData = function() {
			this.viData.innerHTML = formatHex(this.cpu.vI, 3);
		};
		
		//
		this.onVIUpdated = function() {
			if(this.observe) {
				this.refreshVIData();
			}
		};
		
		
		
		
		
		// Add CSS
		const styleLink = document.createElement('link');
		styleLink.setAttribute('rel', 'stylesheet');
		styleLink.setAttribute('href', 'debug/stack_view_style.css');
		
		// Link elements to shadow DOM
		shadow.appendChild(styleLink);
		shadow.appendChild(table);
		
		this.stack.setObserver(this);
		this.cpu.setVIObserver(this);
		this.refreshStackData();
		this.refreshVIData();
	}

}

// Define element
customElements.define('stack-view', StackViewer);