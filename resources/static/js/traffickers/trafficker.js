window.addEventListener('WebComponentsReady',function() {

	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('traffickers'),href: '/traffickers'}).appendTo('.breadcrumbs');

	new Promise((resolve, reject) => {

		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"offices"
				}
			]
		}), function(offices) {
			$('infinia-select[name="idOffice"]')[0].options = offices[0].options;
			resolve();
		});
	}).then(values => {
		
		if (traffickerId) {
			utils.get("/api/traffickers/" + traffickerId, {}, function(trafficker) {
				$('h3#title').html(trafficker.name);
				utils.loadFormData(trafficker);
			});
		}
		else {
			$('h3#title').html(localizer.get('trafficker_new'));
		}
	});
	
	
	$('#save-trafficker').on('click', function() {
		if(utils.validateRequired('trafficker-form')){
			var formData = utils.getFormAsObject('trafficker-form');
			formData.id = traffickerId || 0;
			
			utils.post('/api/traffickers', JSON.stringify(formData), function(response) {
				
				if(response.resultCode == 0) {
					utils.modal("Trafficker creado", "El trafficker se ha creado correctamente <br><br>"+
							"<a href='/traffickers'>Volver a traffickers</a><br><br>");
				}				
			});
		}
	});
});