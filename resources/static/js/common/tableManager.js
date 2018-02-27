
var TableManager = function(endpoint, method, body){
	this.endpoint = endpoint;
	this.method = method || 'GET';
	this.body = body || {};
	this.sortingDisabled = false;
};

TableManager.prototype.setBody = function(body){
	this.body = body;
};

TableManager.prototype.setDiv = function(div){
	this.div = div;
};

TableManager.prototype.disableSorting = function() {
	if(this.table)
		this.table.disableSorting();
	else this.sortingDisabled = true;
}

TableManager.prototype.setTitle = function(title){
	this.table.setTitle(title)
};

TableManager.prototype.setDefaultFilter = function(filter){
	this.defaultFilter = filter;
};

TableManager.prototype.disableHeadFixed = function() {
	this.table.disableHeadFixed = true;
}

TableManager.prototype.init = function(act, fil) {
	if (!this.table){
		let element = customElements.get('infinia-table');
		this.table = new element;
	}
	
	if(this.errorColumn)
		this.table.errorColumn = this.errorColumn;
	

	if(this.sortingDisabled)
		this.table.disableSorting();
		
	this.actions = act;
	this.filter = fil;
	this.filterApplied = "";
	this.sort = "";
	if (!this.div){
		this.div = $('.table-container');
	}
	this.div.html(this.table);
	$(this.table).on('pageClick',(e) => {
		if (this.method == 'GET'){
			this.get(e.detail.page);
		}
		else {
			this.post(e.detail.page);
		}
	})
	
	if(this.filter)
		this.table.addFilter(this.filter);
	this.table.valueManager = this.valueManager;
	this.table.onHTMLLoaded = this.onHTMLLoaded;
	
	
	if(typeof this.onHTMLLoaded == "function") {
		this.table.onHTMLLoaded = this.onHTMLLoaded;
	}
	
	$(this.table).on('applyFilter', (e) => {
		this.filterApplied = e.detail;
		if (this.method == 'GET'){
			this.get();
		}
		else {
			this.post();
		}
	})
	
	$(this.table).on('sortClick', (e) => {
		this.sort = e.detail;
		if (this.method === 'GET'){
			this.get();
		}
		else {
			this.post();
		}
	});
	
	$(this.table).on('exportCSV', (e) => {
		this.getCSV(0,-1, "csv");
	});
	
	$(this.table).on('exportXLS', (e) => {
		this.getCSV(0,-1, "xls");
	});
	
	 
	$(this.table).on('rowClick', (e) => {
		if(typeof this.editUrl == "function") {
			this.editUrl(e);
		}
		else {
			window.location = window.location+"/"+e.detail;
		}
	});
	
	if (this.method === 'GET'){
		this.get();
	}
	else {
		this.post();
	}
	
	if (typeof this.onRowDelete == "function") {
		$(this.table).on('rowDelete', (e) => {
			this.onRowDelete();
		});
	}
}

TableManager.prototype.getCSV = function(numPage, rows, type) {
	
	numPage = numPage ? numPage-1 : 0;
	numRecords = rows || 15;
	
	window.location.href = this.endpoint + '/file.' + type + '?numPage='+numPage+'&numRecords='+numRecords+"&fileName="+this.endpoint;
	
	utils.modal("Descargando achivo", "En breves momentos se procesará la petición, no abandone la página por favor.");
}



TableManager.prototype.get = function(numPage, rows) {
	
	var _this = this;
	
	numPage = numPage ? numPage-1 : 0;
	numRecords = rows || 15;
	
	var subUrl = '?numPage='+numPage+'&numRecords='+numRecords;
	if(this.filterApplied) {
		Object.keys(this.filterApplied).forEach((key) => {
			subUrl+='&filters='+key+"|"+this.filterApplied[key];
		})		
	}
	if(this.defaultFilter) {
		Object.keys(this.defaultFilter).forEach((key) => {
			subUrl+='&filters='+key+"|"+this.defaultFilter[key];
		})	
	}
	
	if(this.sort && this.sort.sort) {
		subUrl+='&sortBy='+this.sort.id+"|"+this.sort.sort;
	}
	
	utils.get(this.endpoint+subUrl,this.body, function(response){

		_this.table.update(response);

		var event = new CustomEvent('tableLoad');
    	this.dispatchEvent(event);
    	
    	if(typeof _this.onTableLoaded == "function") {
			_this.onTableLoaded(response);
		}
    	
		setTimeout(() => {
			_this.table.addAction(_this.actions);
		},200);
	})
}

TableManager.prototype.post = function(numPage, rows) {
	
	var _this = this;
	
	numPage = numPage ? numPage-1 : 0;
	numRecords = rows || 15;
	
	var subUrl = '?numPage='+numPage+'&numRecords='+numRecords;
	if(this.filterApplied) {
		Object.keys(this.filterApplied).forEach((key) => {
			subUrl+='&filters='+key+"|"+this.filterApplied[key];
		})		
	}
	
	if(this.sort && this.sort.sort) {
		subUrl+='&sortBy='+this.sort.id+"|"+this.sort.sort;
	}
	
	utils.post(this.endpoint+subUrl,this.body, function(response){

		_this.table.update(response);

		if(typeof _this.onTableLoaded == "function") {
			_this.onTableLoaded(response);
		}
		
		setTimeout(() => {
			_this.table.addAction(_this.actions);
		},200);
	})
}

TableManager.prototype.disableDownload = function() {
	this.table.disableDownload();
}

TableManager.prototype.disableRowClick = function() {
	this.table.disableRowClick = "true";
}



TableManager.prototype.setEditUrl = function(url) {
	this.editUrl = url;
}

TableManager.prototype.hidePagination = function() {
	this.table.hidePagination();
}

TableManager.prototype.getTableData = function() {
	return {columns:this.table.tableColumns, rows:this.table.tableRows};
}

TableManager.prototype.setErrorColumn = function(col) {
	this.errorColumn = col;
}




