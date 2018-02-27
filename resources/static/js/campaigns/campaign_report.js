var tableManagerPerformance;
var tableManagerGeo;
var tableManagerApp;
var tableManagerVideo;

function onLoadReporting(table, tableHTML) {
	let indices = [];
	for (let i=0; i<table.tableColumns.length; i++){
		let elem = table.tableColumns[i];
		if(elem.editable && elem.editable == true) {
			indices.push(i);
		}
	}
	let rows = table.tableRows;
	if(indices.length > 0) {
		$.map(indices, (index) => {
			$(tableHTML).find('tbody').find('tr').each((trIndex, tr) => {
				let td = $(tr).find('td').get(index);
				let value = rows[trIndex].cells[index].value;
				if(td && value) {
					$(td).html('<input value="' + value + '">');
				}
			})
		});
	}
}

function getTableInfo(tableManager){
	
	var tableColumns = tableManager.table.tableColumns;
	var tableRows = tableManager.table.tableRows;
	
	reportings = [];
	$(tableManager.table.root).find('tbody').find('tr').each((trIndex, tr) => {
		var objReporting = {};
		$(tr).find('td').each((tdIndex, td) => {
			
			if (tableColumns[tdIndex]){
				var key = tableColumns[tdIndex].value;
				var value = "";
				
				if (tableRows[trIndex].cells[tdIndex] && tableRows[trIndex].cells[tdIndex].idObj != null){
					value = tableRows[trIndex].cells[tdIndex].idObj
				}
				else {
					if ($(td).find('input').length) { 
						var input = $(td).find('input')[0];
						value = $(input).val();
					}
					else {
						value = $(td).text();
					}
				}
				objReporting[key] = value;
			}
		});
		reportings.push(objReporting);
	});
	return reportings;
}

window.addEventListener('WebComponentsReady',function() {
	
	
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN" && accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN_EDIT") {
  		$('#savePerformanceReportingContainer').hide();
  		$('#saveGeoReportingContainer').hide();
  		$('#saveAppReportingContainer').hide();
  		$('#saveVideoReportingContainer').hide();
  	}
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	
	$('#title').html(localizer.get('campaign_report'));
	
	/*$('infinia-select[name="period"]')[0].options = [
		{id:"day", value:"Hoy"}, 
		{id:"week", value:"Semana actual"}, 
		{id:"month", value:"Mes actual"}, 
		{id:"year", value:"Año actual"}, 
		{id:"yesterday", value:"Ayer"},
		{id:"last_7", value:"Ultimos 7 días"},
		{id:"last_30", value:"Ultimos 30 días"},
		{id:"prev_month", value:"Mes anterior"}
	]*/
	
	$('infinia-select[name="type"]').on('change', (e) => {
		
		var type = e.currentTarget.value;
		if (type === 'performance'){
			document.querySelector('list-accept-block[id="dimensions"]').setList(performanceDimensions);
		}
		if (type === 'geo' ){
			document.querySelector('list-accept-block[id="dimensions"]').setList(geoDimensions);
		}
		if (type == 'app_transparency'){
			document.querySelector('list-accept-block[id="dimensions"]').setList(appTransparencyDimensions);
		}
		if (type == 'video'){
			document.querySelector('list-accept-block[id="dimensions"]').setList(videoDimensions);
		}
		
		setTimeout(() => {
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'advertiser_name', value : 'Advertiser Name' });
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'advertiser_id', value : 'Advertiser ID' });
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'campaign_name', value : 'Campaign Name' });
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'campaign_id', value : 'Campaign ID' });
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'strategy_name', value : 'Strategy Name' });
			document.querySelector('list-accept-block[id="dimensions"]').accept({ id : 'strategy_id', value : 'Strategy ID' });
		}, 1000);
	});
	
	
	
		
	document.querySelector('list-accept-block[id="metrics"]').setList([
		{ id : 'impressions', value : 'Impressions' },
		{ id : 'clicks', value : 'Clicks' },
		{ id : 'total_conversions', value : 'Total Conversions' },
		{ id : 'total_spend', value : 'Total Spend' },
		{ id : 'total_spend_cpm', value : 'Total Spend eCPM' },
		{ id : 'total_spend_cpa', value : 'Total Spend eCPA' },
		{ id : 'total_spend_cpc', value : 'Total Spend eCPC' },
		{ id : 'ctc', value : 'CTC' },
		{ id : 'ctr', value : 'CTR' },
		{ id : 'rr_per_1k_imps', value : 'Response Rate/1K Imps' },
		{ id : 'media_cost', value : 'Media Cost' },
		{ id : 'media_cost_cpa', value : 'Media Cost eCPA' },
		{ id : 'media_cost_cpc', value : 'Media Cost eCPC' },
		{ id : 'media_cost_cpm', value : 'Media Cost eCPM' },
		{ id : 'media_cost_pc_cpa', value : 'Media Cost PC CPA' },
		{ id : 'media_cost_pv_cpa', value : 'Media Cost PV CPA' },
		{ id : 'media_cost_roi', value : 'Media Cost ROI' },
		{ id : 'post_click_aov', value : 'Post-Click AOV' },
		{ id : 'post_click_conversions', value : 'Post-Click Conversions' },
		{ id : 'post_click_media_cost_roi', value : 'Post-Click Media Cost ROI' },
		{ id : 'post_click_revenue', value : 'Post-Click Revenue' },
		{ id : 'post_click_total_ad_cost_roi', value : 'Post-Click Total Ad Cost ROI' },
		{ id : 'post_click_total_spend_roi', value : 'Post-Click Total Spend ROI' },
		{ id : 'post_view_aov', value : 'Post-View AOV' },
		{ id : 'post_view_conversions', value : 'Post-View Conversions' },
		{ id : 'post_view_conversions_raw', value : 'Post-View Conversions (Raw)' },
		{ id : 'post_view_media_cost_roi', value : 'Post-View Media Cost ROI' },
		{ id : 'post_view_revenue', value : 'Post-View Revenue' },
		{ id : 'post_view_revenue_raw', value : 'Post-View Revenue (Raw)' },
		{ id : 'post_view_total_ad_cost_roi', value : 'Post-View Total Ad Cost ROI' },
		{ id : 'post_view_total_spend_roi', value : 'Post-View Total Spend ROI' },
		{ id : 'revenue_raw', value : 'Revenue (Raw)' },
		{ id : 'total_ad_cost', value : 'Total Ad Cost' },
		{ id : 'total_ad_cost_cpa', value : 'Total Ad Cost eCPA' },
		{ id : 'total_ad_cost_cpc', value : 'Total Ad Cost eCPC' },
		{ id : 'total_ad_cost_cpm', value : 'Total Ad Cost eCPM' },
		{ id : 'total_ad_cost_pc_cpa', value : 'Total Ad Cost PC CPA' },
		{ id : 'total_ad_cost_pv_cpa', value : 'Total Ad Cost PV CPA' },
		{ id : 'total_ad_cost_roi', value : 'Total Ad Cost ROI' },
		{ id : 'total_aov', value : 'Total AOV' },
		{ id : 'total_revenue', value : 'Total Revenue' },
		{ id : 'total_spend_pc_cpa', value : 'Total Spend PC CPA' },
		{ id : 'total_spend_pv_cpa', value : 'Total Spend PV CPA' },
		{ id : 'total_spend_roi', value : 'Total Spend ROI' },
		{ id : 'video_close', value : 'Close' },
		{ id : 'video_collapse', value : 'Collapse' },
		{ id : 'video_companion_clicks', value : 'Companion Clicks' },
		{ id : 'video_companion_ctr', value : 'Companion CTR' },
		{ id : 'video_companion_impressions', value : 'Companion Impressions' },
		{ id : 'video_complete', value : '100% Completed Views' },
		{ id : 'video_complete_rate', value : '100% Completed Rate' },
		{ id : 'video_engaged_impressions', value : 'Engaged Impressions' },
		{ id : 'video_engaged_rate', value : 'Engaged Rate' },
		{ id : 'video_expand', value : 'Expand' },
		{ id : 'video_first_quartile', value : '25% Completed Views' },
		{ id : 'video_first_quartile_rate', value : '25% Completed Rate' },
		{ id : 'video_fullscreen', value : 'Fullscreen' },
		{ id : 'video_midpoint', value : '50% Completed Views' },
		{ id : 'video_midpoint_rate', value : '50% Completed Rate' },
		{ id : 'video_mute', value : 'Mute' },
		{ id : 'video_pause', value : 'Pause' },
		{ id : 'video_play_rate', value : 'Play Rate' },
		{ id : 'video_resume', value : 'Resume' },
		{ id : 'video_rewind', value : 'Rewind' },
		{ id : 'video_skip', value : 'Skip' },
		{ id : 'video_skippable_impressions', value : 'Skippable Impressions' },
		{ id : 'video_skipped_impressions', value : 'Skipped Impressions' },
		{ id : 'video_skipped_rate', value : 'Skipped Rate' },
		{ id : 'video_start', value : 'Start' },
		{ id : 'video_third_quartile', value : '75% Completed Views' },
		{ id : 'video_third_quartile_rate', value : '75% Completed Rate' },
		{ id : 'video_unmute', value : 'Unmute' }
	]);
	
	setTimeout(() => {
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'impressions', value : 'Impressions' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'clicks', value : 'Clicks' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'total_conversions', value : 'Total Conversions' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'total_spend', value : 'Total Spend' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'total_spend_cpm', value : 'Total Spend eCPM' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'total_spend_cpa', value : 'Total Spend eCPA' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'total_spend_cpc', value : 'Total Spend eCPC' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'ctc', value : 'CTC' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'ctr', value : 'CTR' });
		document.querySelector('list-accept-block[id="metrics"]').accept({ id : 'rr_per_1k_imps', value : 'Response Rate/1K Imps' });
	}, 1000);
	document.querySelector('infinia-select[name="type"]').setOptions([
		{ id : 'performance', value : "Performance" },
		{ id : 'geo', value : "Geo Performance" },
		{ id : 'app_transparency', value : "App Transparency" },
		{ id : 'pulse', value : "Pulse" },
		{ id : 'video', value : "Video" }
	]);
	
	document.querySelector('infinia-select[name="sendFrequency"]').setOptions([
		{ id : 'none', value : "Sin Repetición" },
		{ id : 'daily', value : "Diaria" },
		{ id : 'weekly', value : "Semanal" },
		{ id : 'monthly', value : "Menusual" }
	]);
	var hours = [];
	for(var i=0; i<24; i++){
		hours.push({ id : i, value : i + ':00'});
	}
	document.querySelector('infinia-select[name="sendHour"]').setOptions(hours);
	
	document.querySelector('infinia-select[name="sendDay"]').setOptions([
		{ id : '1', value : "Lunes" },
		{ id : '2', value : "Martes" },
		{ id : '3', value : "Miércoles" },
		{ id : '4', value : "Jueves" },
		{ id : '5', value : "Viernes" },
		{ id : '6', value : "Sábado" },
		{ id : '7', value : "Domingo" }
	]);
	
	$('infinia-select[name="sendFrequency"]').on('change', (e) => {
		var freq = e.currentTarget.value;
		$('#sendDayContainer').hide();
		$('#sendDateContainer').hide();
		$('#sendHourContainer').hide();
		(document.querySelector('infinia-select[name="sendDay"]').classList).remove('required');
		(document.querySelector('infinia-select[name="sendHour"]').classList).remove('required');
		(document.querySelector('date-picker[name="sendDate"]').classList).remove('required');
		
		if (freq == 'daily'){
			$('#sendHourContainer').show();
			(document.querySelector('infinia-select[name="sendHour"]').classList).add('required');
		}
		if (freq == 'weekly'){
			$('#sendDayContainer').show();
			$('#sendHourContainer').show();
			(document.querySelector('infinia-select[name="sendDay"]').classList).add('required');
			(document.querySelector('date-picker[name="sendHour"]').classList).add('required');
		}
		if (freq == 'monthly'){
			$('#sendDateContainer').show();
			$('#sendHourContainer').show();
			(document.querySelector('date-picker[name="sendDate"]').classList).add('required');
			(document.querySelector('date-picker[name="sendHour"]').classList).add('required');
		}
	});
	
	var minDate = new Date();
	minDate.setDate(minDate.getDate() + 1)
	var maxDate = new Date();
	maxDate.setMonth(minDate.getMonth() + 1);
	document.querySelector('date-picker[name="sendDate"]').setMinDate(minDate);
	document.querySelector('date-picker[name="sendDate"]').setMaxDate(maxDate);
	$('date-picker[name="sendDate"]')[0].setValue(new Date());
	
	/*
	document.querySelector('infinia-select[name="desglose"]').setOptions([
		{ id : 'day', value : 'Dia'}
	]);
	*/
	
	$('#send-report').on('click', function() {
		
		if(utils.validateRequired('reporting-form')){
			var formData = utils.getFormAsObject('reporting-form');
			
			formData.dimensions = $.map(document.querySelector('list-accept-block[id="dimensions"]').getData(), (d) => {
				return d.id;
			});
			formData.metrics = $.map(document.querySelector('list-accept-block[id="metrics"]').getData(), (d) => {
				return d.id;
			});
			
			if (formData.sendFrequency === 'daily'){
				var executionDate = new Date();
				executionDate.setHours(formData.sendHour);
				executionDate.setMinutes(0);
				executionDate.setSeconds(0);
				
				if (executionDate < new Date()){
					executionDate.setDate(executionDate.getDate() + 1);
				}
				formData.nextExecution = executionDate.getTime();
			}
			if (formData.sendFrequency ==='weekly'){
				var executionDate = new Date();
				executionDate.setHours(formData.sendHour);
				executionDate.setMinutes(0);
				executionDate.setSeconds(0);
				
				if (executionDate < new Date()){
					executionDate.setDate(executionDate.getDate() + 7);
				}
				formData.nextExecution = executionDate.getTime();
			}
			if (formData.sendFrequency ==='monthly'){
				var executionDate = new Date(document.querySelector('date-picker[name="sendDate"]').getValue());
				executionDate.setHours(formData.sendHour);
				executionDate.setMinutes(0);
				executionDate.setSeconds(0);
				
				formData.nextExecution = executionDate.getTime();
			}
			
			utils.lockScreen();
			utils.post('/api/saved_reports', JSON.stringify(formData), (response) => {
				utils.unlockScreen();
				utils.floatingSuccess('Guardado');
			}, (error) => {
				utils.unlockScreen();
				utils.floatingSuccess('Guardado');
			});
		}
	});
	
	$('#save-performance-reporting').on('click', function() {
		var updatedReporting = {
				idCampaignPlatform : id_campaign,
				reportings : []
		};
		
		utils.lockScreen();
		updatedReporting.reportings = getTableInfo(tableManagerPerformance)
		utils.post('/api/reporting/' + id_campaign + '/performance', JSON.stringify(updatedReporting), (response) => {
			utils.unlockScreen();
		}, (response) => {
			utils.unlockScreen();
		});
	});
	
	$('#save-geo-reporting').on('click', function() {
		var updatedReporting = {
				idCampaignPlatform : id_campaign,
				reportings : []
		};
		
		utils.lockScreen();
		updatedReporting.reportings = getTableInfo(tableManagerGeo)
		utils.post('/api/reporting/' + id_campaign + '/geo', JSON.stringify(updatedReporting), (response) => {
			utils.unlockScreen();
		}, (response) => {
			utils.unlockScreen();
		});
	});
	
	$('#save-app-reporting').on('click', function() {
		var updatedReporting = {
				idCampaignPlatform : id_campaign,
				reportings : []
		};
		
		utils.lockScreen();

		updatedReporting.reportings = getTableInfo(tableManagerApp)
		utils.post('/api/reporting/' + id_campaign + '/appTransparency', JSON.stringify(updatedReporting), (response) => {
			utils.unlockScreen();
		}, (response) => {
			utils.unlockScreen();
		});
	});
	
	$('#save-video-reporting').on('click', function() {
		var updatedReporting = {
				idCampaignPlatform : id_campaign,
				reportings : []
		};
		
		utils.lockScreen();
		updatedReporting.reportings = getTableInfo(tableManagerVideo)
		utils.post('/api/reporting/' + id_campaign + '/video', JSON.stringify(updatedReporting), (response) => {
			utils.unlockScreen();
		}, (response) => {
			utils.unlockScreen();
		});
	});

	$('#campaign-selector').on('change' , function (e) {
		utils.get('/api/campaigns/'+e.detail, {}, function(response) {
			$('date-picker[name="startDate"]')[0].setValue(response.startDate);
			$('date-picker[name="endDate"]')[0].setValue(response.endDate);
		}) 
	})

	$('#generate-report').on('click', function() {
		$('.has-error').removeClass('has-error');
		
		if(!$('#campaign-selector').val()) {
			$('#campaign-selector').addClass('has-error');
			return false;
		}
		
		id_campaign = $('#campaign-selector').val();
		
		tableManagerPerformance = new TableManager('/api/reporting/' + id_campaign + '/performance' , 'GET');
		tableManagerGeo = new TableManager('/api/reporting/' + id_campaign + '/geo' , 'GET');
		tableManagerApp = new TableManager('/api/reporting/' + id_campaign + '/app_transparency' , 'GET');
		tableManagerVideo = new TableManager('/api/reporting/' + id_campaign + '/video' , 'GET');

		tableManagerPerformance.onHTMLLoaded = onLoadReporting;
		tableManagerGeo.onHTMLLoaded = onLoadReporting;
		tableManagerApp.onHTMLLoaded = onLoadReporting;
		tableManagerVideo.onHTMLLoaded = onLoadReporting;
		
		
		if( ($('date-picker[name="startDate"]')[0].getValue() && $('date-picker[name="endDate"]')[0].getValue())) {
			$('#collapsible')[0].collapse();
			var formData = utils.getFormAsObject('reporting-form');
			generatePerformanceReport(tableManagerPerformance, formData);
			generateGeoReport(tableManagerGeo, formData);
			generateAppTransparencyReport(tableManagerApp, formData);
			generateVideoReport(tableManagerVideo, formData);
			
			
			tableManagerPerformance.hidePagination();
			tableManagerGeo.hidePagination();
			tableManagerApp.hidePagination();
			tableManagerVideo.hidePagination();
	
			
			$('#charts-container').removeClass('hidden');
			$('#representation-selector').removeClass('hidden');
			$('.showSelector').removeClass('active');
			$($('.showSelector')[0]).addClass('active');
		}
		else {
			
			$('date-picker[name="startDate"]').addClass('has-error');
			$('date-picker[name="endDate"]').addClass('has-error');
		}
	});

});

function generatePerformanceReport(tableManager, formData) {
	
	var formData = JSON.parse(JSON.stringify(formData));
	
	formData.dimensions = $.map(document.querySelector('list-accept-block[id="dimensions"]').getData(), (elem) => {
		return elem.id
	});
	formData.metrics = $.map(document.querySelector('list-accept-block[id="metrics"]').getData(), (elem) => {
		return elem.id
	});
	
	formData.metrics.unshift('ctr');
	formData.metrics.unshift('clicks');
	formData.metrics.unshift('impressions');
	formData.metrics.unshift('creativeName');
	formData.metrics.unshift('orderLineName');
	formData.metrics.unshift('campaignName');
	formData.metrics.unshift('startDate');
	
	formData.metrics = $.unique(formData.metrics).join();
	
	if(formData.filters) formData.filters = $.unique(formData.filters).join();
	
	tableManager.setBody(formData);
	tableManager.setDiv($('.table-container-performance'));
	
	tableManager.onTableLoaded = function(response) {
		drawTableCharts('performance-charts', response, 'creativeName');
	}
	tableManager.disableSorting();

	tableManager.init();
	tableManager.hidePagination();
	tableManager.disableRowClick();
	tableManager.disableHeadFixed();
}

function generateGeoReport(tableManager, formData) {
	
	var formData = JSON.parse(JSON.stringify(formData));

	formData.filters = $.map($('#filters').prop('selectedList'), (elem) => {
		return elem.id
	});
	formData.metrics = [];
	formData.metrics.push('startDate');
	formData.metrics.push('campaignName');
	formData.metrics.push('orderLineName');
	formData.metrics.push('country');
	formData.metrics.push('region');
	formData.metrics.push('impressions');
	formData.metrics.push('clicks');
	formData.metrics.push('ctr');
	
	formData.metrics = $.unique(formData.metrics).join();

	formData.filters = $.unique(formData.filters).join();
	tableManager.disableSorting();

	tableManager.setBody(formData);
	tableManager.setDiv($('.table-container-geo'));
	tableManager.init();
	tableManager.hidePagination();

	tableManager.disableRowClick();
	
	tableManager.onTableLoaded = function(response) {
		drawTableCharts('geo-charts', response, 'region');
	}

}

function generateAppTransparencyReport(tableManager, formData) {
	
	var formData = JSON.parse(JSON.stringify(formData));

	formData.filters = $.map($('#filters').prop('selectedList'), (elem) => {
		return elem.id
	});
	formData.metrics = [];
	formData.metrics.push('startDate');
	formData.metrics.push('campaignName');
	formData.metrics.push('orderLineName');
	formData.metrics.push('app');
	formData.metrics.push('impressions');
	formData.metrics.push('clicks');
	formData.metrics.push('ctr');
	
	formData.metrics = $.unique(formData.metrics).join();

	formData.filters = $.unique(formData.filters).join();
	tableManager.disableSorting();

	tableManager.setBody(formData);
	tableManager.setDiv($('.table-container-app'));
	tableManager.init();
	tableManager.hidePagination();
	tableManager.disableRowClick();

	tableManager.onTableLoaded = function(response) {
		drawTableCharts('app-charts', response, 'app')
	}
}

function generateVideoReport(tableManager, formData) {
	
	var formData = JSON.parse(JSON.stringify(formData));

	formData.filters = $.map($('#filters').prop('selectedList'), (elem) => {
		return elem.id
	});
	formData.metrics = [];
	formData.metrics.push('startDate');
	formData.metrics.push('campaignName');
	formData.metrics.push('orderLineName');
	formData.metrics.push('creativeName');
	formData.metrics.push('impressions');
	formData.metrics.push('clicks');
	formData.metrics.push('ctr');
	
	formData.metrics.push('videoCompleteRate');
	formData.metrics.push('videoThirdQuartileRate');
	formData.metrics.push('videoMidpointRate');
	formData.metrics.push('videoFirstQuartileRate');
	
	formData.metrics.push('videoComplete');
	formData.metrics.push('videoThirdQuartile');
	formData.metrics.push('videoMidpoint');
	formData.metrics.push('videoFirstQuartile');
	
	formData.metrics.push('videoMute');
	formData.metrics.push('videoUnmute');
	formData.metrics.push('videoPause');
	formData.metrics.push('videoPlayRate');
	formData.metrics.push('videoResume');
	formData.metrics.push('videoRewind');
	formData.metrics.push('videoSkip');
	formData.metrics.push('videoSkippableImpressions');
	formData.metrics.push('videoSkippedImpressions');
	formData.metrics.push('videoSkippedRate');
	formData.metrics.push('videoStart');
	formData.metrics.push('videoFullscreen');
	formData.metrics.push('videoClose');
	formData.metrics.push('videoCollapse');
	
	formData.metrics = $.unique(formData.metrics).join();

	formData.filters = $.unique(formData.filters).join();
	tableManager.disableSorting();

	tableManager.setBody(formData);
	tableManager.setDiv($('.table-container-video'));
	tableManager.init();
	tableManager.hidePagination();
	tableManager.disableRowClick();

	tableManager.onTableLoaded = function(response) {
		drawTableCharts('video-charts', response, 'video')
	}
}

function drawTableCharts(container, response, fieldToShow){


	var dateData = [];
	let tablesData = {};
	
	let i = 0;
	let indexes ={};
	let indexToShow = 0;
	response.tableColumns.forEach(function(column) {
		if(column.value == "ctr" ){
			indexes["ctr"] = i;
			tablesData["ctr"] = {}
		}
		else if(column.value == "clicks"){
			indexes["clicks"] = i;
			tablesData["clicks"] = {};
		}
		else if(column.value == "impressions") {
			indexes["impressions"] = i;
			tablesData["impressions"] = {};
		}
		
		if(column.value == fieldToShow) {
			indexToShow = i;
		}
		i++;
	})
	
	response.tableRows.forEach(function(row) {
		row = row.cells;
		
		Object.keys(indexes).forEach(function(key) {
			if(typeof tablesData[key][row[indexToShow].value] == "undefined")
				tablesData[key][row[indexToShow].value] = {};
			
			if(typeof tablesData[key][row[indexToShow].value][row[0].value] == 'undefined')
				tablesData[key][row[indexToShow].value][row[0].value] = row[indexes[key]].value.replace(',', '.');
			else 
				tablesData[key][row[indexToShow].value][row[0].value] = 
					Number(tablesData[key][row[indexToShow].value][row[0].value]) + Number(row[indexes[key]].value.replace(',', '.'));
		})
		
		if(typeof dateData[row[0].value] == "undefined")
			dateData[row[0].value] = {};
	});
	
	var chartsData = [];
	Object.keys(indexes).forEach(function(index) {
		chartsData[index] = [[""]];
	})
	
	
	Object.keys(dateData).forEach(function(key) {
		
		Object.keys(indexes).forEach(function(index) {
			let rowCTR = [key];
			Object.keys(tablesData[index]).forEach(function(elem) {	
				if(tablesData[index][elem][key])
					rowCTR.push(Number(tablesData[index][elem][key]));
				else(rowCTR.push(0));
			})
			chartsData[index].push(rowCTR);	
		})
	})
	
	Object.keys(tablesData).forEach(function(key) {
		Object.keys(tablesData[key]).forEach(function(elem) {
			chartsData[key][0].push(elem);
		})
	})
	
	$('#'+container).empty();
	Object.keys(chartsData).forEach(function(key) {
		
		if(chartsData[key].length > 1) {
			sortChartData(chartsData[key]);
			const lineChart = window.customElements.get('line-chart');
			let chart = new lineChart();
			chart.id = 'chart-'+key;
			chart.setData(chartsData[key]);
			chart.setTitle(key);
			
			let div = document.createElement('div');
			div.className="mt20";
			div.append(chart);
			$('#'+container).append(div);
			chart.drawChart();
		}
	})

	
}


function sortChartData(data) {
	data.sort(function(a, b) {
		let splitA = a[0].split('-');
		let splitB = b[0].split('-');
		
		if(splitA.length == 1) return -1;
		else if(splitB.length == -1) return 1;
		
		return Number(splitA[0]+splitA[1]+splitA[2]) - Number(splitB[0]+splitB[1]+splitB[2]) ;
	})
}

$(document).ready(function() {
	$('.showSelector').on('click', function() {
		$('.showSelector').removeClass('active');
		$(this).addClass('active');
		let container = $(this).data('section');
		$('div[id$="-container"]').addClass('hidden');
		$('#'+container+"-container").removeClass('hidden');
		
	})
})

function randomSeed(min, max, seed) {

       min = min || 0;
        max = max || 1;
        var rand;
        if (typeof seed === "number") {
            seed = (seed * 9301 + 49297) % 233280;
            var rnd = seed / 233280;
            var disp = Math.abs(Math.sin(seed));
            rnd = (rnd + disp) - Math.floor((rnd + disp));
            rand = min + rnd * (max - min + 1);
        } else {
            rand = Math.random() * (max - min + 1) + min;
        }
        return rand.toFixed(2).toLocaleString();
}

var performanceDimensions = [
	{ id : 'advertiser_name', value : 'Advertiser Name' },
	{ id : 'advertiser_id', value : 'Advertiser ID' },
	{ id : 'campaign_name', value : 'Campaign Name' },
	{ id : 'campaign_id', value : 'Campaign ID' },
	{ id : 'strategy_name', value : 'Strategy Name' },
	{ id : 'strategy_id', value : 'Strategy ID' },
	{ id : 'agency_id', value : 'Agency ID' },
	{ id : 'agency_name', value : 'Agency Name' },
	{ id : 'campaign_budget', value : 'Campaign Budget' },
	{ id : 'campaign_currency_code', value : 'Campaign Currency Code' },
	{ id : 'campaign_end_date', value : 'Campaign End Date' },
	{ id : 'campaign_goal_type', value : 'Campaign Goal Type' },
	{ id : 'campaign_goal_value', value : 'Campaign Goal Value' },
	{ id : 'campaign_initial_start_date', value : 'Campaign Initial Start Date' },
	{ id : 'campaign_start_date', value : 'Campaign Start Date' },
	{ id : 'campaign_timezone', value : 'Campaign Time Zone' },
	{ id : 'campaign_timezone_code', value : 'Campaign Time Zone Code' },
	{ id : 'organization_id', value : 'Organization ID' },
	{ id : 'organization_name', value : 'Organization Name' },
	{ id : 'strategy_budget', value : 'Strategy Budget' },
	{ id : 'strategy_channel', value : 'Strategy Channel' },
	{ id : 'strategy_end_date', value : 'Strategy End Date' },
	{ id : 'strategy_goal_type', value : 'Strategy Goal Type' },
	{ id : 'strategy_goal_value', value : 'Strategy Goal Value' },
	{ id : 'strategy_start_date', value : 'Strategy Start Date' },
	{ id : 'strategy_supply_type', value : 'Strategy Supply Type' },
	{ id : 'strategy_type', value : 'Strategy Type' }
]

var appTransparencyDimensions = [
	{ id : 'app_id', value : 'App ID' },
	{ id : 'app_name', value : 'App Name' },
	{ id : 'attribution_group', value : 'Attribution Group' },
	{ id : 'exchange_id', value : 'Exchange ID' },
	{ id : 'exchange_name', value : 'Exchange Name' }]
	.concat(performanceDimensions);

var geoDimensions = [
	{ id : 'country_name', value : 'Country Name' },
	{ id : 'country_code', value : 'Country Code' },
	{ id : 'region_name', value : 'Region Name' },
	{ id : 'region_code', value : 'Region Code' },
	{ id : 'region_id', value : 'Region ID' },
	{ id : 'metro_name', value : 'Metro Name' },
	{ id : 'attribution_group', value : 'Attribution Group' },
	{ id : 'exchange_id', value : 'Exchange ID' },
	{ id : 'exchange_name', value : 'Exchange Name' }]
	.concat(performanceDimensions);

var videoDimensions = [
	{ id : 'attribution_group', value : 'Attribution Group' },
	{ id : 'concept_id', value : 'Concept ID' },
	{ id : 'concept_name', value : 'Concept Name' },
	{ id : 'creative_id', value : 'Creative ID' },
	{ id : 'creative_name', value : 'Creative Name' },
	{ id : 'creative_size', value : 'Creative Size' },
	{ id : 'deal_external_id', value : 'Deal External ID' },
	{ id : 'deal_id', value : 'Deal ID' },
	{ id : 'deal_name', value : 'Deal Name' },
	{ id : 'exchange_id', value : 'Exchange ID' },
	{ id : 'exchange_name', value : 'Exchange Name' },
	{ id : '3PAS Placement ID', value : '3PAS Placement ID' },
	{ id : 'tpas_placement_name', value : '3PAS Placement Name' }]
	.concat(performanceDimensions);


