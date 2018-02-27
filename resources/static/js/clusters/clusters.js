$('h3#title').html(localizer.get('Clusters'));
$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
$('<a>',{text: localizer.get('Clusters'),href: '/clusters'}).appendTo('.breadcrumbs');



function ClusterController(){
	this.clusterData = {};
}
var clusterController = new ClusterController();


ClusterController.prototype.getData = function(endpoint) {

	let _this = this;
	$('infinia-card').each(function(index, card) {
		$(card).html('<div class="center-content"><paper-spinner active="active"></paper-spinner></div>');
	})
	
	
	let prom = new Promise((resolve, reject) => {
		if((!endpoint && (!_this.clusterData['all'] || Object.keys(_this.clusterData['all']).length == 0))
				|| (endpoint && !_this.clusterData[endpoint])) {
			
			let ep = {};
			if(endpoint)
				ep[endpoint.split("=")[0]] = endpoint.split("=")[1];
			
			var country = utils.getUserCountry();
			
			let apiEndpoint = "/stats";
			if(utils.getUserIdEntity() == 32)
				apiEndpoint+="/naranya";
			else
				apiEndpoint+="?country="+utils.getUserCountry().toLowerCase();
			
			utils.apiGet(apiEndpoint , ep, function(response){
				
				if(!endpoint)
					_this.clusterData['all'] = response;
				else 
					_this.clusterData[endpoint] = response;
				
				
				resolve(response);
			})
		}
		else {
			if(!endpoint)
				endpoint = "all";
			resolve(_this.clusterData[endpoint]);
		}
	})
	
	
	prom.then((response) => {
		let PieChart = customElements.get('pie-chart');

		//Gender data
		let genderChart = new PieChart();
		let data = [];
		
		let fun = utils.getSortFunction('gender');		
		Object.keys(response.gender).sort((a, b) => {
			return fun(a,b); 
		}).forEach(function(key){
			data.push([localizer.get(key)+" ("+Number(response.gender[key]).toLocaleString()+")", response.gender[key]])
		})
		
		_this.drawPieChart('genderCard', genderChart, data);

		//Age data
		let ageChart = new PieChart();
		data = [];
		
		fun = utils.getSortFunction('age');
		Object.keys(response.age).sort((a, b) => {
			return fun(a,b); 
		}).forEach(function(key){
			data.push([localizer.get(key)+" ("+Number(response.age[key]).toLocaleString()+")", response.age[key]])
		})
		_this.drawPieChart('ageCard', ageChart, data);

		//Income data
		let incomeChart = new PieChart();
		data = [];
		fun = utils.getSortFunction('income_level');
		Object.keys(response.income_level).sort((a, b) => {
			return fun(a,b); 
		}).forEach(function(key){
			data.push([localizer.get('income.'+key)+" ("+Number(response.income_level[key]).toLocaleString()+")", response.income_level[key]])
		})
		_this.drawPieChart('income_levelCard', incomeChart, data);
	})
	
	
	
	
	
	
}

ClusterController.prototype.drawPieChart = function(container, chart, data) {
	data.unshift(["", ""]);
	$('#'+container).html(chart);
	chart.setData(data);
	chart.colorSelected = utils.getPieColors();
	chart.graphTitle = container.replace("Card","");
	chart.drawChart();
}


window.addEventListener('WebComponentsReady',function() {
	
	common.initSlider('slider', 'main-slider-controller');
	
	$('.map-container').on('click', function(){
		$('#map')[0].init();
	})
	
	$('.options > div').on('click', function() {
		let container = $(this).closest('.row');
		let isActive = $(this).hasClass('active');
		$(container).find('.active').removeClass('active');

		if(!isActive)
			$(this).addClass('active');

		
		let endpoint = $(this).data('endpoint');
		if(!$(this).hasClass('active')){	
			endpoint="";
		}	
		clusterController.getData(endpoint);
	})
	
	
	clusterController.getData();
	setTimeout(function() {
		$('.options > div').each(function(index, elem) {
			let endpoint = $(this).data('endpoint');
			let ep = {};
			ep[endpoint.split("=")[0]] = endpoint.split("=")[1];
			ep.country = utils.getUserCountry().toLowerCase();
			utils.apiGet('/stats', ep, function(response){
				clusterController.clusterData[endpoint] = response;
			})
		})
		
	}, 200)
	
	//Clusters list table
	var tableManager = new TableManager('/api/clusters');
	
	tableManager.onRowDelete = function() {
		tableManager.get();
	}
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(item.value.startsWith('date_')) {
				 retValue  = 'date_'+ (Number(item.value.replace('date_', "")));
		}
		else retValue = item.value;
		
		return retValue;
	}
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	
	tableManager.setDefaultFilter({clusterType:"CLUSTER"});
	let accountData = JSON.parse(localStorage.accountData);
  	if(accountData.userHeader.roleEntity.role.role == "ROLE_ADMIN" || accountData.userHeader.roleEntity.role.role == "ROLE_ADMIN_EDIT") {
  		filter.fields = [{name:"name"},{name:"clusterStatus"},{name:"owner"} ];
  	} else {
  		filter.fields = [{name:"name"},{name:"clusterStatus"} ];
  	}

  	tableManager.onHTMLLoaded = function(table, html) {
  		
  		setTimeout(() => {
  			let statusIndex = 0;
  		  	let totalIndex = 0;
  	  		table.tableColumns.forEach((elem) => {
  	  			if(elem.value == 'clusterStatus')
  	  				statusIndex = elem.id;
  	  			if(elem.value == 'total')
  	  				totalIndex = elem.id;
  	  		})
  	  		$(html).find('tbody').find('tr').each(function(index, row) {
  	  			
	  	  		let accountData = JSON.parse(localStorage.accountData);
	  	    	if(accountData.userHeader.roleEntity.role.role != "ROLE_VALIDATOR") {
	  	    	
	  	    		if($($(row).children()).get(statusIndex).innerHTML == "processed") {
		  				$(row).find('cluster-actions').remove();
		  			}
	  	    	}
  	    	
  	    	
  	  			if($($(row).children()).get(statusIndex).innerHTML == "running") {
  	  				$($(row).find('cluster-actions')[0].root).find('#calculate_cluster').remove();
  	  			}
  	  			
  	  			if(Number(utils.replaceAll($($(row).children()).get(totalIndex).innerHTML,"\\.", "")) > 2000000) {
  	  				if($(row).find('cluster-actions')[0])
  	  					$($(row).find('cluster-actions')[0].root).find('#downloadCSV').remove();
  	  			}
  	  		})
  		}, 200);
  		
  	}
  	
	tableManager.init('cluster-actions',filter);
	tableManager.disableRowClick();
	
	
})