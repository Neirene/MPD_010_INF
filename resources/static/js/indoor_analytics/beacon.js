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
			$('<a>',{text: localizer.get('beacons'), href: '/locations/' + id_location + '/beacons?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
			if (id_beacon) {
				utils.get('/api/beacons/' + id_beacon, {}, function(response) {
					$('#title,#beacon-name-breadcrumb').html(response.name);
					$('<a>',{text: response.name, href: '/beacons/' + response.id + '?id_location=' + id_location + '&id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
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
	
	document.querySelector('infinia-select[name="idSection"]').setOptions([
		{id:"5", value:"Cajas"}, 
		{id:"6", value:"Cocinas"}, 
		{id:"7", value:"Decoración"}, 
		{id:"8", value:"Final linea cajas"}, 
		{id:"9", value:"Iluminación"}, 
		{id:"10", value:"Sanitarios"}
	]);
	
	$('#save-beacon').on('click', function() {
		if(utils.validateRequired('beacon-form')) {
			var formData = utils.getFormAsObject('beacon-form');
			formData.id = parseFloat(id_beacon) || 0;
			formData.idLocation = id_location;
			
			utils.post('/api/beacons', JSON.stringify(formData), function(response) {
				if(response.resultCode == 0) {
					utils.modal("Beacon creado", "El beacon se ha creado correctamente <br><br>"+
							"<a href='/beacons/" + response.id + "?id_location=" + id_location + "&id_retailer=" + id_retailer + "'>Editar beacon</a><br><br>" +
							"<a href='/locations/" + id_location + "/beacons?id_retailer=" + id_retailer +"'>Volver a beacons</a><br><br>" +
							"<a href='/locations/" + id_location + "?id_retailer=" + id_retailer + "'>Volver a la ubicación</a><br><br>");
				}				
			});			
		}
	});
})