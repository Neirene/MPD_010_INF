$('h3#title').html(localizer.get('customer_journey_new'));
$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
$('<a>',{text: localizer.get('attribution_model'),href: '/attribution_model'}).appendTo('.breadcrumbs');


let customList = [{id:"59f1c026dfb13603fea1c5b9", value:"Clicks BMW Serie 3"},{ id:"59f1c049dfb13603fea1c5bc", value:"Impresiones Santander"}, {id:"59f1c05bdfb13603fea1c5bf", value:"Clicks Mini Clubman"}];

setTimeout(() => {
	let list = $('#origin')[0].$.clusters_list.list; 
	let l = customList.concat(list);
	$('#origin')[0].$.clusters_list.list = l; 
}, 1000)



/*$('selectable-list').each(function(index, elem) {
	doSearch(elem, "");
});

$('selectable-list').on('filterList', function(e) {
	doSearch(this, e.detail);
})*/
	

$('#origin').on('clusterSelected', function(e) {
	console.log(e.detail)
	$('#dates-container').removeClass('hidden')
	$('#kpi-container').removeClass('hidden')
	$('#button-container').removeClass('hidden')
	if(e.detail == "59f1c026dfb13603fea1c5b9"){
		let d = new Date(2017, 09, 01);
		$('#date_from')[0].setValue(d.getTime());
		$('#campaign_date_from').html(utils.formatDate(d, true))
		d = new Date(2017, 10, 01) ;
		$('#date_to')[0].setValue(d.getTime());
		$('#campaign_date_to').html(utils.formatDate(d, true))
	}
	else if(e.detail == "59f1c049dfb13603fea1c5bc"){
		let d = new Date(2017, 08, 07);
		$('#date_from')[0].setValue(d.getTime());
		$('#campaign_date_from').html(utils.formatDate(d, true))
		d = new Date(2017, 9, 01) ;
		$('#date_to')[0].setValue(d.getTime());
		$('#campaign_date_to').html(utils.formatDate(d, true))
	}
	else if(e.detail == "59f1c05bdfb13603fea1c5bf"){
		let d = new Date(2017, 09, 20);
		$('#date_from')[0].setValue(d.getTime());
		$('#campaign_date_from').html(utils.formatDate(d, true))
		d = new Date(2017, 10, 15) ;
		$('#date_to')[0].setValue(d.getTime());
		$('#campaign_date_to').html(utils.formatDate(d, true))
	}
})


$('#addPhysicalKPI').on('click', function() {
	let Map = customElements.get('infinia-map');
	let m = new Map();
	m.loadCsv = true;
	
	let p = document.createElement('p');
	p.className="mt10 col-sm-12";
	$('#kpi-list').append(p);
	p.append(m);
	m.init();
})

$('#addDigitalKPI').on('click', function() {
	let SL = customElements.get('selectable-list');
	let list = new SL();
	list.hideBlock = true;
	list.hideAccept = true;
	let p = document.createElement('p');
	p.className="mt10 col-sm-4";
	$('#kpi-list').append(p);
	p.append(list);
	list.removeLoader();
	$(list).on('filterList', (e) => {
		var val = e.detail;
		if (val.length >= 3){
			utils.get("/api/interests/leiki/" + val, {}, function(keywords) {
				var l = $.map(keywords, (keyword) => {
					return { id : keyword.id, value : keyword.name }
				});
				list.setList(l);
			});
		}
	});
})


$('#generate-attribution').on('click', function() {
	
	//$('collapsible-content')[0].collapse();	
	$('#attribution-content').removeClass('hidden');
	utils.modal("Nombre del modelo", "" +
			"<p>Nombre del modelo:</p>" +
			"<div class='row'><div class='col-sm-6'>" +
			"<input class='form-control' id='model-name' value='Modelo de Atribución - '/>" +
			"<button class='mt10 btn btn-primary' id='save-cluster'>Generar</button>" +
			"</div></div>");
	
	$('#save-cluster').on('click', function() {
		let attrModel = {};
		attrModel.name = $('#model-name').val();
		let models = [];
		if(localStorage.getItem('models')){
			models = JSON.parse(localStorage.getItem('models'));
		}
		attrModel.id = models.length +10;
		
		models.push(attrModel);
		localStorage.setItem('models',JSON.stringify(models));
		
		$('.closePopup').click();
		
		utils.modal("Solicitud enviada", "" +
				"<p>Solicitud de modelo enviada</p>" +
				"<a href='/attribution_model'>Volver</a>"+
				"</div></div>");
	})
})
	
window.addEventListener('WebComponentsReady', function() {
	$('.kpi').on('itemAccepted', function(e) {
		$('.kpi').each(function(index, list) {
			if(list != e.target) {
				list.removeAllAccepted();
			}
		})
	})
})



function doSearch(selList, filter) {
	utils.get('/api/clusters?filters=name|'+filter+'&numRecords=100',{}, function(response){
		let list = [];
		response.tableRows.forEach((row) => {
			let elem = {id:row.id, value:row.cells[0].value};
			list.push(elem);
		})
		selList.setList(list);
	})
}	
	
	
utils.datesDepending('date_from', 'date_to');