

window.addEventListener('WebComponentsReady', function() {
	
	//Setting breadcrumbs
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: 'Campañas',href: '/campaigns'}).appendTo('.breadcrumbs');
		
	utils.get('/api/campaigns/'+id_campaign, {}, function(response) {
		$('#title').html(response.name);
		$('infinia-tabs')[0].addTab(0,response.name, "", "/campaigns/"+id_campaign);
		$('infinia-tabs')[0].setActive(1);

		
		utils.addCampaignPaymentTabs(response, $('infinia-tabs')[0]);

		$('<a>',{text: response.name,href: '/campaigns/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Líneas de pedido",href: '/campaigns/'+response.id+'/order_lines'}).appendTo('.breadcrumbs');

	})
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"startDate", date:true}, {name:"endDate", date:true}];
	
	var tableManager = new TableManager('/api/campaigns/'+id_campaign+'/order_lines');
	
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
	
	tableManager.init('order_line-actions', filter);
	tableManager.editUrl = function(e){
		window.location = '/order_lines/'+e.detail+'?id_campaign='+id_campaign;
	}
})


