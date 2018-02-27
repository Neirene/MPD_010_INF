
var dealsTableManager = new TableManager("/api/publishers/" + id_publisher + "/deals");
dealsTableManager.setDiv($('#deal-container'));
dealsTableManager.valueManager = function(item, elem) {
	var retValue = "";
	if(elem.value == 'status') {
			 retValue = localizer.get('statusType.'+item.value);
	}
	else
		retValue = item.value;
	
	return retValue;
}

var sitesTableManager = new TableManager("/api/publishers/" + id_publisher + "/sites");
sitesTableManager.setDiv($('#sites-container'));


window.addEventListener('WebComponentsReady',function() {
	

	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('publishers'),href: '/publishers'}).appendTo('.breadcrumbs');

	
	if (id_publisher){
		utils.get("/api/publishers/" + id_publisher,{}, function(response){
			$('h3#title').html(response.name);
			$('#file-loader').prop('imgUrl',response.logo);
			utils.loadFormData(response);			
		});
	}
	else {
		$('.hidden-create').hide();
		$('h3#title').html(localizer.get('publisherNew'));
	}
	
	dealsTableManager.init('deal-actions');
	dealsTableManager.disableRowClick();
	dealsTableManager.hidePagination();
	
	sitesTableManager.init('site-actions');
	sitesTableManager.disableRowClick();
	sitesTableManager.hidePagination();
	common.initSlider('slider');
	
	
	
	utils.get("/api/publishers/" + id_publisher + "/deals", {}, function(response) {
		$('infinia-table#publisher-deals').prop('tableColumns', response.tableColumns);
		$('infinia-table#publisher-deals').prop('tableRows', response.tableRows);
	});
	
	utils.get("/api/publishers/" + id_publisher + "/sites", {}, function(response) {
		
	});
	
	$('infinia-select[name="country"]')[0].options = [
		{id:'ES', value:'España'},
		{id:'MX', value:'Mexico'},
		{id:'CO', value:'Colombia'},
		{id:'CL', value:'Chile'},
		{id:'CR', value:'Costa Rica '},
		{id:'PE', value:'Perú '}
	];
	
	utils.initStatusSelect();
});


$('#file-loader').on('fileSelected', () => {
	$('#logo-container').empty();
})

$('#save-publisher').on('click', function() {

	utils.lockScreen();
	
	$('#file-loader')[0].uploadFiles('logos').then((response) => {
		if(utils.validateRequired('publisher-form')){
			var formData = utils.getFormAsObject('publisher-form');
			formData.id = parseFloat(id_publisher) || 0;
			formData.status = parseInt(formData.status);
			formData.logo = JSON.stringify(response);
			console.log(formData);
			utils.post('/api/publishers', JSON.stringify(formData), function(response) {			
				if(response.resultCode == 0) {
					utils.modal("Publisher creado",
						"El publisher se ha creado correctamente <br><br>"+
						"<p><a href='/publishers'>Volver a publishers</a><br><br></p>"+
						"<p><a href='/publishers/"+response.id+"'>Añadir deals / sites</a></p>"
					);
				}
				utils.unlockScreen();
			}, () => {utils.unlockScreen();});
		}
		else{
			utils.unlockScreen();
			utils.floatingError("Faltan campos obligatorios");
		}
	});	
});

$('#create-deal').on('click', function() {
	utils.get('/publishers/deals/template',{}, function(response) {
		utils.modal(localizer.get('deal.create'), response);
		publisherFunctions.setDealTemplateEvents();
	});
})

$('#create-site').on('click', function() {
	utils.get('/publishers/sites/template',{}, function(response) {
		utils.modal(localizer.get('site.create'), response);
		
		publisherFunctions.setSaveSite();
		
	});
})


PublisherFunctions = function() {}
publisherFunctions = new PublisherFunctions();

PublisherFunctions.prototype.setDealTemplateEvents = function(){
	
	utils.lockScreen();
	var sizesPromise = new Promise((resolve, reject) => {
		utils.get('/api/sizes/all', {}, function(sizes) {
			$.map(sizes, (size) => {
				$('#idSize').append("<option value="+size.id+">"+ (size.modifier ? size.width + 'x' + size.height + ' - (' + size.modifier.toUpperCase() + ')' : size.width + 'x' + size.height) +"</option>");
			});
			resolve();
		});
	});
	var suppliesPromise = new Promise((resolve, reject) => {
		utils.apiGet('/mediamath/supply_sources?sort_by=name', {}, function(response) {
			$.map(response, (elem) => {
				$('#idProvider').append("<option value="+elem.id+">"+elem.name+"</option>");
			});
			resolve();
		});
	});
	Promise.all([sizesPromise, suppliesPromise]).then(v => {
		utils.unlockScreen();
	});
	$('#save-deal').on('click', function() {
		var _button = this;
		if(utils.validateRequired('deal-form')){
			var formData = utils.getFormAsObject('deal-form');
			formData.idPublisher = parseFloat(id_publisher);
			formData.idProvider = $('#idProvider').val();
			
			if (formData.idOrderLines === ''){
				formData.idOrderLines = [];
			}
			else {
				formData.idOrderLines = formData.idOrderLines.split(",")
			}
			formData.status = $('#status').val();
			
			if($('#deal-form')[0].dealId)
				formData.id = $('#deal-form')[0].dealId;
			
			utils.lockScreen();
			utils.post('/api/deals', JSON.stringify(formData), function(response) {
					dealsTableManager.init('deal-actions');
					if(response.resultCode == 0) {
						utils.unlockScreen();
						$('.closePopup').trigger('click')
					}	
			});
		}
		else{
			utils.floatingError("Faltan campos obligatorios");
		}
	});
}

PublisherFunctions.prototype.editDeal = function(id){
	
	utils.get('/api/deals/'+id, {}, function(deal){
		utils.get('/publishers/deals/template',{}, function(response) {
			
			utils.apiGet('/mediamath/supply_sources?sort_by=name', {}, function(response) {
				var data = $.map(response, (elem) => {
					$('#idProvider').append("<option value="+elem.id+">"+elem.name+"</option>");
				});
				$('#idProvider').val(deal.idProvider);
			});
			
			utils.modal(localizer.get('deal.create'), response);
			utils.loadFormData(deal, 'deal-form');
			publisherFunctions.setDealTemplateEvents();
			$('#deal-form')[0].dealId = id;
		});
	});
}

PublisherFunctions.prototype.editSite = function(id){
	utils.get('/api/sites/'+id, {}, function(site){
		utils.get('/publishers/sites/template',{}, function(response) {
			utils.modal(localizer.get('site.create'), response);
			utils.loadFormData(site, 'site-form');
			$('#site-form')[0].siteId = id;
			publisherFunctions.setSaveSite();
		});
	});
}

PublisherFunctions.prototype.setSaveSite = function() {
	$('#save-site').on('click', function() {
		if(utils.validateRequired('site-form')){
			var formData = utils.getFormAsObject('site-form');
			formData.idPublisher = parseFloat(id_publisher);
			if($('#site-form')[0].siteId)
				formData.id = $('#site-form')[0].siteId;
			utils.post('/api/sites', JSON.stringify(formData), function(response) {
				sitesTableManager.init('site-actions');
				$('.closePopup').trigger('click')			
			});
		}
		else{
			utils.floatingError("Faltan campos obligatorios");
		}
	});
}