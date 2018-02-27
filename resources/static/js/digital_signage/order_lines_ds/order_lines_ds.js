

window.addEventListener('WebComponentsReady', function() {
	
	//Setting breadcrumbs
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: 'Campañas',href: '/campaigns_ds'}).appendTo('.breadcrumbs');
		
	utils.get('/api/campaigns_ds/'+id_campaign_ds, {}, function(response) {
		$('#title,#campaign_ds-name-breadcrumb').html(response.name);
		$('<a>',{text: response.name,href: '/campaigns_ds/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Líneas de pedido",href: '/campaigns_ds/'+response.id+'/order_lines_ds'}).appendTo('.breadcrumbs');

	})
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"startDate", date:true}, {name:"endDate", date:true}];
	
	var tableManager = new TableManager('/api/campaigns_ds/'+id_campaign_ds+'/order_lines_ds');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			if(elem.value == 'dspStatus') {
				 retValue = localizer.get('dspStatusValues.'+item.value);
			}
			else
				retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('order_line_ds-actions', filter);
	tableManager.editUrl = function(e){
		window.location = '/order_lines_ds/'+e.detail+'?id_campaign_ds='+id_campaign_ds;
	}
})


