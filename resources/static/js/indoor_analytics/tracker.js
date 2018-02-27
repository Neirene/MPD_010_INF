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
			$('<a>',{text: localizer.get('trackers'), href: '/locations/' + id_location + '/trackers?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
			if (id_tracker){
				utils.get('/api/trackers/' + id_tracker, {}, function(response) {
					$('#title,#tracker-name-breadcrumb').html(response.name);
					$('<a>',{text: response.name, href: '/trackers/'+response.id + '?id_location=' + id_location + '&id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
					utils.loadFormData(response);
					utils.unlockScreen();
				});
			}
			else {
				utils.unlockScreen();
			}
		});
	});
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN") {
			$("#agencyManagement").hide();
	}
	
	utils.post("/api/components/selects", JSON.stringify({
		"fields":[
			{
				"id" : "0",
				"field" : "agencies"
			},
			{
				"id" : id_location,
				"field" : "sections"
			}
		]
	}), function(response) {
		document.querySelector('infinia-select[name="idAgency"]').setOptions(response[0].options);
		document.querySelector('infinia-select[name="idSection"]').setOptions(response[1].options);
	});
	
	$('#save-tracker').on('click', function() {
		if(utils.validateRequired('tracker-form')) {
			var formData = utils.getFormAsObject('tracker-form');
			formData.id = parseFloat(id_tracker) || 0;
			formData.idLocation = id_location;
			
			utils.post('/api/trackers', JSON.stringify(formData), function(response) {
				if(response.resultCode == 0) {
					utils.modal("Tracker creado", "El tracker se ha creado correctamente <br><br>"+
							"<a href='/trackers/" + response.id + "?id_location=" + id_location + "&id_retailer=" + id_retailer + "'>Editar tracker</a><br><br>" +
							"<a href='/locations/" + id_location + "/trackers?id_retailer=" + id_retailer +"'>Volver a trackers</a><br><br>" +
							"<a href='/locations/" + id_location + "?id_retailer=" + id_retailer + "'>Volver a la ubicación</a><br><br>");
				}
			});			
		}
	});
})