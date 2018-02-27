window.addEventListener('WebComponentsReady',function() {
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: "Retailers", href: '/retailers'}).appendTo('.breadcrumbs');

	utils.initStatusSelect();
	
	utils.lockScreen();
	utils.get('/api/retailers/' + id_retailer, {}, function(response) {
		$('<a>',{text: response.name, href: '/retailers/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Ubicaciones",href: '/retailers/'+response.id+'/locations'}).appendTo('.breadcrumbs');
		utils.get('/api/locations/' + id_location, {}, function(response) {
			$('<a>',{text: response.name, href: '/locations/' + response.id + '?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
			$('<a>',{text: localizer.get('sections'), href: '/locations/' + id_location + '/sections?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
			if (id_section){
				utils.get('/api/sections/' + id_section, {}, function(response) {
					$('#title,#section-name-breadcrumb').html(response.name);
					$('<a>',{text: response.name, href: '/sections/'+response.id + '?id_location=' + id_location + '&id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
					utils.loadFormData(response);
					utils.unlockScreen();
				});
			}
			else {
				utils.unlockScreen();
			}
		});
	});
	
	$('#save-section').on('click', function() {
		if(utils.validateRequired('section-form')) {
			var formData = utils.getFormAsObject('section-form');
			formData.id = parseFloat(id_section) || 0;
			formData.idLocation = id_location;
			
			utils.post('/api/sections', JSON.stringify(formData), function(response) {
				if(response.resultCode == 0) {
					utils.modal("Sección creada", "La sección se ha creado correctamente <br><br>"+
							"<a href='/sections/" + response.id + "?id_location=" + id_location + "&id_retailer=" + id_retailer + "'>Editar sección</a><br><br>" +
							"<a href='/locations/" + id_location + "/sections?id_retailer=" + id_retailer +"'>Volver a secciones</a><br><br>" +
							"<a href='/locations/" + id_location + "?id_retailer=" + id_retailer + "'>Volver a la ubicación</a><br><br>");
				}
			});			
		}
	});
})