window.addEventListener('WebComponentsReady',function() {
	
	
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('offices'),href: '/offices'}).appendTo('.breadcrumbs');

	


	var componentsPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"resellers"
				}
			]
		}), function(agencies) {
			$('infinia-select[id="idAgency"]')[0].options = agencies[0].options;
			resolve();
		});
	}).then(values => {
		
		if (officeId) {
			utils.get("/api/offices/" + officeId, {}, function(office) {
				$('h3#title').html(office.name);
				utils.loadFormData(office);
			});
		}
		else {
			$('h3#title').html(localizer.get('offices'));
		}
		
		
		
	});
	
	
	
	utils.getCountryList(function(response) {
		var countries = $.map(response, function(country, pos){
			return { id : country.numericCode, value : country.translations.es };
		});
		$('infinia-select[name="country"]')[0].options = countries;
	});
	
	$('#save-office').on('click', function() {
		if(utils.validateRequired('office-form')){
			var formData = utils.getFormAsObject('office-form');
			
			formData.id = officeId || 0;
			console.log(formData);
			utils.post('/api/offices', JSON.stringify(formData), function(response) {
				
				console.log(response);
				if(response.resultCode == 0) {
					utils.modal("Oficina creada", "La oficina se ha creado correctamente <br><br>"+
							"<a href='/offices'>Volver a oficinas</a><br><br>");
				}				
			});
		}
	});
});
