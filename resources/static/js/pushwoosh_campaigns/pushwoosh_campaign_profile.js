window.addEventListener('WebComponentsReady',function() {
	
	common.initSlider('slider');
	$('.demographic-filter').remove();
	
	utils.get('/api/pushwoosh_campaigns/' + idPushwooshCampaign, {}, function(pushwoosh_campaign) {
		$('#title').html(pushwoosh_campaign.name);
		$('infinia-tabs')[0].addTab(0,pushwoosh_campaign.name, "", '/pushwoosh_campaigns/'+pushwoosh_campaign.id);
		$('infinia-tabs')[0].setActive(3);
		$('<a>',{text: "Inicio", href: utils.getMainUrl()}).appendTo('.breadcrumbs');
	    $('<a>',{text: "Campañas pushwoosh", href: '/pushwoosh_campaigns'}).appendTo('.breadcrumbs');
	    $('<a>',{text: pushwoosh_campaign.name,href: '/pushwoosh_campaigns/'+pushwoosh_campaign.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Perfilado", href: '/pushwoosh_campaigns/'+ pushwoosh_campaign.id + 
		'/profile'}).appendTo('.breadcrumbs');
	});
	
	utils.get('/api/pushwoosh_reporting/'+idPushwooshCampaign+'/profile' , {}, function(response) {
		
		properties = JSON.parse(response.valuesString);

		drawPies(properties, "main-pies-container");
	});
	
	
	
	utils.get('/api/pushwoosh_reporting/'+idPushwooshCampaign+'/psychographic', {}, (response) => {
		console.log(response)
		Object.keys(response).forEach((key) => {
			if(key = "propertiesAppCategories"){
				if(response.propertiesAppCategories)
					utils.drawTable('categories_app', response.propertiesAppCategories);
				else
					$('#psychographic-categories_app').remove();
			}
			if(key = "propertiesApps"){
				if(response.propertiesApps) 
					utils.drawTable('apps', response.propertiesApps);
				else
					$('#psychographic-apps').remove();
			}
			if(key = "propertiesIAB"){
				if(response.propertiesIAB)
					utils.drawTable('iab', response.propertiesIAB);
				else
					$('#psychographic-iab').remove();
			}
			if(key = "propertiesKeywords"){
				if(response.propertiesKeywords)
					utils.drawTable('interests', response.propertiesKeywords);
				else
					$('#psychographic-interests').remove();
			}
		})
	});
	
	
//	utils.get('/api/pushwoosh_reporting/'+idPushwooshCampaign+'/psychographic' , {}, function(response) {
//		
//		Object.keys(response).forEach((key) => {
//			if(key = "propertiesAppCategories")
//				drawTable('categories_app', response.propertiesAppCategories);
//			if(key = "propertiesApps")
//				drawTable('apps', response.propertiesApps);
//			if(key = "propertiesIAB")
//				drawTable('iab', response.propertiesIAB);
//			if(key = "propertiesKeywords")
//				drawTable('interests', response.propertiesKeywords);
//			
//		})
//	});
});

function drawPies(response, container, color) {
	let total = 0;
	let sum = 0;
	response.forEach((elem) => {
		let data = [["",""]];
		
		let fun = utils.getSortFunction(elem.name);
		if(typeof fun == "function") {
			elem.values.sort((a, b) => {
				return fun(a.value,b.value); 
			})
		};
		elem.values.forEach((el) => {
			if(el.value) {
				let str = el.value;
				if(el.value.startsWith("income"))
					str = "income."+el.value;
				data.push([localizer.get(str) + " ("+el.quantity.toLocaleString()+")", el.quantity]);
				sum+=el.quantity;
			}
		})
		
		if($('#'+container).find('#'+elem.name+'Card').length > 0) {
			let chart = new PieChart();
			chart.setData(data);
			$('#'+container).find('#'+elem.name+'Card').html(chart);
			if(color)
				chart.colorSelected = color;
			chart.drawChart();
		}
		if(total == 0) {
			total = sum;
			$('#'+container).find('.demographic-total').html("Total: " +total.toLocaleString());
		}
	})
}


function drawTable(div, data) {
	let InfiniaTable = customElements.get('infinia-table');
	let infiniaTable = new InfiniaTable();
	$('#psychographic-'+div).html(infiniaTable);
	
	let rows = [];
	JSON.parse(data).forEach((elem) => {
	 	Object.keys(elem).forEach((key) => {
	 		rows.push({
	 			id:key,
	 			cells:[
	 				{id:0, value:key},{id:1, value:elem[key]}
	 			]
	 		})
	 	})
	})
	
	infiniaTable.hidePagination();
	infiniaTable.disableSorting();
	infiniaTable.tableColumns = [{id:0, value:localizer.get(div)}, {id:1, value:localizer.get("total")}];
	
	infiniaTable.tableRows = rows;
	infiniaTable.disableDownload();
	
	if(rows.length > 0) {
		$('#summary-data').prop(div,rows[0].cells[0].value.replace('&amp;', '&'));	
	}
}