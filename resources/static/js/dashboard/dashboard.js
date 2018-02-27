

window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	$('h3#title').html(localizer.get('dashboard'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('dashboard'),href: '/dashboard'}).appendTo('.breadcrumbs');

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"startDate", date:true}, {name:"endDate", date:true}, {name:"dspStatus", dropdown:true}];
	
	var tableManager = new TableManager('/api/dashboard/campaigns');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'dspStatus') {
			retValue = localizer.get('dspStatusValues.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.onHTMLLoaded = function(table, tableHTML) {
		let i=0;
		let index = -1;
		let indexTotal = -1;
		table.tableColumns.some((elem) =>{
			if(elem.value == 'progress') {
				index = i;
			}
			if(elem.value == 'totalProgress') {
				indexTotal = i;
			}
			if(index!=-1 && indexTotal != -1)
				return true;
				
			i++;
		})
		let rows = table.tableRows;
		if(index >= 0 || indexTotal >=0) {
			$(tableHTML).find('tbody').find('tr').each((trIndex, tr) => {
				
				if(index >=0){
					let td = $(tr).find('td').get(index);
					let value = rows[trIndex].cells[index].value;
					if(td && value) {
						$(td).html('<div style="height:24px;"><progress-bar progress="'+value+'"></progress-bar></div>');
					}
				}
				
				if(indexTotal >=0){
					let td = $(tr).find('td').get(indexTotal);
					let value = rows[trIndex].cells[indexTotal].value;
					if(td && value) {
						$(td).html('<div style="height:24px;"><progress-bar progress="'+value+'"></progress-bar></div>');
					}
				}
				
			})
		}
		
		
	}
	
	tableManager.setEditUrl(function(e){
		window.location = "/campaigns/"+e.detail+"/reporting";
	});
	tableManager.init('dashboard-actions',filter);
	tableManager.disableRowClick();
});