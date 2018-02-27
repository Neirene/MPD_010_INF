window.addEventListener('WebComponentsReady',function() {
	
	common.initSlider('slider-content', 'slider-br')
	
	var idApp = 0;
	var idDays;
	var soTotals;
	var deviceTotals;
	var idPublisher = 0;
	
	if(utils.getNameRole() == "ROLE_ADMIN" || utils.getNameRole() == "ROLE_ADMIN_EDIT")
		idPublisher = 0;
	else
		idPublisher = utils.getUserIdEntity();
	
	$('h3#title').html(localizer.get('publisher_report'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('publisher_report'),href: '/publisher_report'}).appendTo('.breadcrumbs');
	
	$('infinia-select[name="days"]')[0].options = [
		//{id:'0', value:localizer.get('all')},
		{id:'1', value:localizer.get('last30days')},
		{id:'2', value:localizer.get('last90days')}
	];

	
	
	utils.apiGet('/users/_active', {}, function(response) {
		if(response)
			$('#totalUsers').html(Number(response).toLocaleString());
	});
	
	utils.post("/api/components/selects", JSON.stringify({
		"fields":[
			{
				"id" : idPublisher,
				"field" : 'publisher_apps'
			}
		]
	}), function(publishers) {
		var options = [{id:'0', value: 'Todas'}];		
		
		publishers[0].options.forEach(function(obj) {
			options.push(obj);
		});
		document.querySelector('infinia-select[name="apps"]').setOptions(options);		
	});
	
	setTimeout(function() {		
		$('infinia-select[name="days"]')[0].setValue('2');
		$('infinia-select[name="apps"]')[0].setValue('0');
	}, 200);
	
	if(utils.getNameEntity())
		
		$('#publisherName').html(utils.getNameEntity());
	else
		$('#publisherName').html("");	
		
});



$('infinia-select[name="days"]').on('change', function() {
	if(this.value) {
		if(this.value == '0') {
			idDays = 'all';
		}
		else if(this.value == '1') {
			idDays = '1';
		}
		else {
			idDays = '2';
		}
	}		
	
	let idApp = $('infinia-select[name="apps"]').val();
	
	if(!idApp) idApp = 0;
	
	reloadData(idDays, idApp);	
	updateDemographic();
});

$('infinia-select[name="apps"]').on('change', function() {
	let idDays = $('infinia-select[name="days"]').val();
	if(!idDays) idDays = 'all';
	
	if(this.value) {
		idApp = this.value;
		reloadData(idDays, idApp);
		updateDemographic();
	}
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
    });
};

function reloadData(idDay, idApp) {	
	

	soTotals = new TableManager('/api/publishers/report/'+idApp+'/'+idDay+'/os');
	
	soTotals.valueManager = function(item, elem) {
		var retValue = "";
		
		retValue = item.value;
		
		return retValue;
	};
	
	soTotals.setDiv($('.table-container-so'));
	soTotals.init();
	soTotals.disableDownload();
	soTotals.disableRowClick();
	soTotals.hidePagination();
	soTotals.disableHeadFixed();
	
	deviceTotals = new TableManager('/api/publishers/report/'+idApp+'/'+idDay+'/device');
	
	deviceTotals.valueManager = function(item, elem) {
		var retValue = "";
		retValue = item.value;
		return retValue;
	};
	
		
	deviceTotals.setDiv($('.table-container-apps'));
	deviceTotals.init();	
	deviceTotals.disableHeadFixed();
	deviceTotals.disableDownload();
	deviceTotals.disableRowClick();
	deviceTotals.hidePagination();
	
}

$('#demographic-selector').on('click', function(e) {
	updateDemogrpahic
})
	
function updateDemographic() {
	let idDay = $('infinia-select[name="days"]').val();
	if(!idDays) idDay = 'all';
	

	let idApp = $('infinia-select[name="apps"]').val();
	
	utils.get("/api/publishers/report/"+idApp+"/"+idDay+"/pies", {}, 
		(response) => {
			utils.unlockScreen();
			var pies = response.pies;
			drawPies(pies, "main-pies-analytics");
		}, 
		(error) => {
			utils.unlockScreen();
			
		});
}