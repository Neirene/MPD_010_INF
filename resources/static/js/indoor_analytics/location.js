

window.addEventListener('WebComponentsReady',function() {
	
	//Setting breadcrumbs
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('retailers'), href: '/retailers'}).appendTo('.breadcrumbs');

	utils.initStatusSelect();
	
	
	
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN") {
			$("#permissionManagement").hide();
	}

	utils.lockScreen();
	utils.get('/api/retailers/' + id_retailer, {}, function(response) {
		$('<a>',{text: response.name, href: '/retailers/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Ubicaciones",href: '/retailers/'+response.id+'/locations'}).appendTo('.breadcrumbs');
		if (id_location) {
			utils.get('/api/locations/' + id_location, {}, function(response) {
				$('#title,#location-name-breadcrumb').html(response.name);
				$('<a>',{text: response.name, href: '/locations/' + response.id + '?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
				utils.loadFormData(response);
				utils.unlockScreen();
			});
		}
		else {
			utils.unlockScreen();
		}
	});
	
	utils.get('/api/retailers/'+id_retailer+'/circuits', {}, function(response) {
		let list = [];
		response.tableRows.forEach(row => {
			list.push({id:row.id, value: row.cells[0].value});
		})
		$('#circuits')[0].setList(list);
	})
	
	$('#save-location').on('click', function() {
		if(utils.validateRequired('location-form')) {
			var formData = utils.getFormAsObject('location-form');
			formData.id = parseFloat(id_location) || 0;
			formData.idRetailer = id_retailer;
			
			if (formData.idTrackers && formData.idTrackers !== ""){
				formData.idTrackers = formData.idTrackers.split(",");
			}
			else {
				formData.idTrackers=[];
			}
			if (formData.idBeacons && formData.idBeacons !== ""){
				formData.idBeacons = formData.idBeacons.split(",");
			}
			else {
				formData.idBeacons=[];
			}
			if (formData.idPlayers && formData.idPlayers !== ""){
				formData.idPlayers = formData.idPlayers.split(",");
			}
			else {
				formData.idPlayers=[];
			}
			
			let circuits = [];
			if($('#circuits')[0].getData().accepted.length > 0) {
				$('#circuits')[0].getData().accepted.forEach( elem => {
					circuits.push(elem.id);
				})
			}
			
			formData.idCircuits = circuits;
			utils.post('/api/locations', JSON.stringify(formData), function(response) {
				if(response.resultCode == 0) {
					utils.floatingSuccess(localizer.get())
					utils.modal("Ubicación creada", "La ubicación se ha creado correctamente <br><br>"+
							"<a href='/locations/" + response.id + "?id_retailer=" + id_retailer + "'>Editar ubicación</a><br><br>" + 
							"<a href='/retailers/" + id_retailer + "/locations'>Volver a ubicaciones</a><br><br>" +
							"<a href='/retailers/" + id_retailer + "'>Volver al retailer</a><br><br>");
				}				
			});			
		}
	});
	

	
})