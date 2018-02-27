window.addEventListener('WebComponentsReady',function() {
	utils.get('/api/pushwoosh_campaigns/' + idPushwooshCampaign, {}, function(pushwoosh_campaign) {
		$('#title').html(pushwoosh_campaign.name);
		$('infinia-tabs')[0].addTab(0,pushwoosh_campaign.name, "", '/pushwoosh_campaigns/'+pushwoosh_campaign.id);
		$('infinia-tabs')[0].setActive(2);
		$('<a>',{text: "Inicio", href: utils.getMainUrl()}).appendTo('.breadcrumbs');
	    $('<a>',{text: "Campañas pushwoosh", href: '/pushwoosh_campaigns'}).appendTo('.breadcrumbs');
	    $('<a>',{text: pushwoosh_campaign.name,href: '/pushwoosh_campaigns/'+pushwoosh_campaign.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Reporting", href: '/pushwoosh_campaigns/'+ pushwoosh_campaign.id + 
		'/reporting'}).appendTo('.breadcrumbs');
	});
	
	var tableManager = new TableManager('/api/pushwoosh_reporting/' + idPushwooshCampaign + '/campaign');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = '';
				
		retValue = item.value;
		
		return retValue;
	};
		
	tableManager.init();
	//tableManager.disableDownload();
	tableManager.disableRowClick();
	tableManager.disableSorting();
	tableManager.hidePagination();
	
	// Prueba de gráficas.
	var data = [
		[localizer.get('notifications'), localizer.get('sent'), localizer.get('delivery'), localizer.get('open')]
	];
	
	setTimeout(function() {
		var rows = tableManager.getTableData().rows;
		
		if(rows.length > 0) {
			rows.forEach(function(row) {
				data.push([
					row.cells[1].value,
					Number(row.cells[3].value),
					Number(row.cells[4].value),
					Number(row.cells[5].value)
				]);
			});
			
			const pushwooshChart = window.customElements.get('pushwoosh-chart');
			let chart = new pushwooshChart();
			chart.id = 'chart-pushwoosh';
			chart.setData(data);
			chart.setTitle('Reporting');
			chart.setSubtitle('Reporting de notificaciones');
			chart.setWidth('50%');
			chart.setHeight('300px');
			chart.setMargin('0 auto');
			chart.setColors(['#89764f', '#c4aa72', '#dbccaa']);

			$('#charts-container').append(chart);
			chart.drawChart();
			
			$('paper-spinner').hide();
		}
		else {
			tableManager.disableDownload();
			$('#charts-container').html('<span>No hay notificaciones para generar las gráficas.</span>');
		}
	}, 2000);	
});

$(document).ready(function() {
	$('.showSelector').on('click', function() {
		$('.showSelector').removeClass('active');
		$(this).addClass('active');
		let container = $(this).data('section');
		$('div[id$="-container"]').addClass('hidden');
		$('#' + container + '-container').removeClass('hidden');		
	});
});