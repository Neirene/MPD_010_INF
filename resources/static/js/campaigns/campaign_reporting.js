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
	
	var tableManagerPerformance = new TableManager('/api/reporting/' + id_campaign + '/performance' , 'GET');
	tableManagerPerformance.onHTMLLoaded = onLoadReporting;
	
	utils.lockScreen();
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN_EDIT") {
  		$('#savePerformanceReportingContainer').hide();
  		$('#representation-selector').hide();
  		$('#tables-container').hide();
  	}
	
	$('#startDate').prop('placeholder', localizer.get('startDate'));
	$('#endDate').prop('placeholder', localizer.get('endDate'));
	utils.datesDepending('startDate', 'endDate');
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');
	
	let endCampaign = "";
	let startCampaign = "";
	
	
	utils.get('/api/campaigns/' + id_campaign, {}, function(campaign) {

		$('<a>',{text: campaign.name,href: '/campaigns/'+campaign.id}).appendTo('.breadcrumbs');
		$('#title').html(campaign.name);
		$('infinia-tabs')[0].addTab(0, campaign.name, "", "/campaigns/"+id_campaign);
		$('infinia-tabs')[0].setActive(2);
		utils.addCampaignPaymentTabs(campaign, $('infinia-tabs')[0]);
		
		$('#impressionsTotal').html(campaign.reportImpressions.toLocaleString());
		$('#clicksTotal').html(campaign.reportClicks.toLocaleString());
		$('#ctrTotal').html(campaign.reportCtr.toLocaleString());
		$('#viewability').html(campaign.reportViewability.toLocaleString() + '%')
		$('#vtr').html(campaign.reportVtr.toLocaleString() + '%')
		$('infinia-tabs')[0].addTab(4,localizer.get('attribution_model'),'','/campaigns/'+id_campaign+'/attribution_model');

		generatePerformanceReport(tableManagerPerformance, campaign.endDate, campaign.startDate);
		
	});
	
	$('#startDate, #endDate').on('dateSelected', function() {
		let endDate =  $('#endDate')[0].getValue();
		if(endDate) {
			let d = new Date(endDate);
			d.setDate(d.getDate() + 1);
			endDate = d.getTime();
		}
		else endDate = endCampaign;

		let startDate = $('#startDate')[0].getValue();
		if(startDate) {
			let d = new Date(startDate);
			d.setDate(d.getDate() - 1);
			startDate = d.getTime();
		}
		else startDate = startCampaign;
		utils.lockScreen();
		generatePerformanceReport(tableManagerPerformance, startDate, endDate);
	})
	
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
});	
	
function generatePerformanceReport(tableManager, startDate, endDate) {

	let formData ={desglose:"day",name:"",period:""};
	formData.metrics = [];
	formData.metrics.unshift('ctr');
	formData.metrics.unshift('clicks');
	formData.metrics.unshift('impressions');
	formData.metrics.unshift('creativeName');
	formData.metrics.unshift('orderLineName');
	formData.metrics.unshift('campaignName');
	formData.metrics.unshift('startDate');
	formData.metrics = $.unique(formData.metrics).join();
	formData.startDate = startDate;
	formData.endDate = endDate;
	
	tableManager.setBody(formData);
	tableManager.setDiv($('.table-container-performance'));
	
	tableManager.onTableLoaded = function(response) {
		drawTableCharts('performance-charts', response, 'creativeName');
		utils.unlockScreen();
	}
	tableManager.disableSorting();

	tableManager.init();
	tableManager.hidePagination();
	tableManager.disableRowClick();

	tableManager.onHTMLLoaded = onLoadReporting;
	
}


function drawTableCharts(container, response, fieldToShow){

	if(!response) {
		utils.unlockScreen();
		return;
	}
		

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