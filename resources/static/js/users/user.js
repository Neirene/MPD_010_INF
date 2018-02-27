
window.addEventListener('WebComponentsReady',function() {
	
	var user;
	
	$('h3#title').html(localizer.get('users'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('users'),href: '/users'}).appendTo('.breadcrumbs');
	
	var agenciesPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"agencies"
				}
			]
		}), function(agencies) {
			var properties = [];

			for (var i=0; i<agencies[0].options.length; i++){
				properties.push({id:agencies[0].options[i].id, value:agencies[0].options[i].value});
			}
			$('#agencies')[0].setList(properties);
			
			resolve();
		});
	});
	
	var retailersPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"retailers"
				}
			]
		}), function(retailers) {
			var properties = [];

			for (var i=0; i<retailers[0].options.length; i++){
				properties.push({id:retailers[0].options[i].id, value:retailers[0].options[i].value});
			}
			$('#retailers')[0].setList(properties);
			
			resolve();
		});
	});
	
	// Roles.	
	var rolesPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"roles"
				}
			]
		}), function(roles) {
			var properties = [];

			for (var i=0; i<roles[0].options.length; i++){
				properties.push({id:roles[0].options[i].id, value:roles[0].options[i].value});
			}
			$('#roles')[0].setList(properties);
			
			resolve();
		});
	});
	
	var advertisersPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"advertisers"
				}
			]
		}), function(advertisers) {
			var properties = [];

			for (var i=0; i<advertisers[0].options.length; i++){
				properties.push({id:advertisers[0].options[i].id, value:advertisers[0].options[i].value});
			}
			$('#advertisers')[0].setList(properties);
			
			resolve();
		});
	});
	
	var publishersPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"publishers"
				}
			]
		}), function(publishers) {
			var properties = [];

			for (var i=0; i<publishers[0].options.length; i++){
				properties.push({id:publishers[0].options[i].id, value:publishers[0].options[i].value});
			}
			$('#publishers')[0].setList(properties);
			
			resolve();
		});
	});
	
	var resellersPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"resellers"
				}
			]
		}), function(resellers) {
			var properties = [];

			for (var i=0; i<resellers[0].options.length; i++){
				properties.push({id:resellers[0].options[i].id, value:resellers[0].options[i].value});
			}
			$('#resellers')[0].setList(properties);
			
			resolve();
		});
	});
	
	$('infinia-select[name="country"]')[0].options = [
		{id:"ES", value:"ES"}, 
		{id:"MX", value:"MX"},
		{id:"CR", value:"CR"},
		{id:"CO", value:"CO"},
		{id:"CL", value:"CL"},
		{id:"PE", value:"PE"}
	];
	
	if(id_user) {
		utils.get('/api/users/'+id_user, {}, function(user) {

			$('h3#title').html(user.username);
			$("a.user_name").text(user.username);
			
			utils.loadFormData(user);
			
			var properties = [];
			
			agenciesPromise.then(
				function(){
					var agencies = [];
					for (var i=0; i<user.agencies.length; i++){
						agencies.push({id:user.agencies[i].id, value:user.agencies[i].name});				
					}
					document.querySelector('selectable-list[name="agencies"]').setAccepted(agencies);
				}
			);
			
			advertisersPromise.then(
				function(){
					var advertisers = [];
					for (var i=0; i<user.advertisers.length; i++){
						advertisers.push({id:user.advertisers[i].id, value:user.advertisers[i].name});				
					}
					document.querySelector('selectable-list[name="advertisers"]').setAccepted(advertisers);
				}
			);
			
			publishersPromise.then(
				function(){
					var publishers = [];
					for (var i=0; i<user.publishers.length; i++){
						publishers.push({id:user.publishers[i].id, value:user.publishers[i].name});				
					}
					document.querySelector('selectable-list[name="publishers"]').setAccepted(publishers);
				}
			);
			
			resellersPromise.then(
				function(){
					var resellers = [];
					for (var i=0; i<user.agencies.length; i++){
						resellers.push({id:user.agencies[i].id, value:user.agencies[i].name});				
					}
					document.querySelector('selectable-list[name="resellers"]').setAccepted(resellers);
				}
			);
			
			retailersPromise.then(
				function(){
					var retailers = [];
					for (var i=0; i<user.retailers.length; i++){
						retailers.push({id:user.retailers[i].id, value:user.retailers[i].name});				
					}
					document.querySelector('selectable-list[name="retailers"]').setAccepted(retailers);
				}
			);
			
			var roles = [];
			for (var i=0; i<user.roles.length; i++){
				roles.push({id:user.roles[i].id, value:user.roles[i].name});				
			}
			document.querySelector('selectable-list[name="roles"]').setAccepted(roles);

		});
		
		// Hide password.
		$('#passwordDiv').addClass('hidden');
	}
	else {
		$('h3#title').html(localizer.get('newUser'));
	}
});

$('#save-user').on('click', function() {
	if(utils.validateRequired('user-form')){
		var formData = utils.getFormAsObject('user-form');
		
		if(id_user) {
			formData.id = id_user;
			delete formData['password'];
		}
		
		var roles = [];		
		var props_roles = $('#roles')[0].getData();
		for (i = 0; i < props_roles.accepted.length; i++){
			roles.push(props_roles.accepted[i].id);
		}
		/*var exists_roles = $.grep(props_roles, function(elem){ 
			roles.push(elem.id);
		});*/
		formData.idRoles = roles;
		
		var advertisers = [];		
		var props_advertisers = $('#advertisers')[0].getData();
		for (i = 0; i < props_advertisers.accepted.length; i++){
			advertisers.push(props_advertisers.accepted[i].id);
		}
		/*var exists_advertisers = $.grep(props_advertisers, function(elem){ 
			advertisers.push(elem.id);
		});*/
		formData.idAdvertisers = advertisers;
		
		var publishers = [];		
		var props_publishers = $('#publishers')[0].getData();
		for (i = 0; i < props_publishers.accepted.length; i++){
			publishers.push(props_publishers.accepted[i].id);
		}
		/*var exists_publishers = $.grep(props_publishers, function(elem){ 
			publishers.push(elem.id);
		});*/
		formData.idPublishers = publishers;
		
		var agencies = [];		
		var props_agencies = $('#agencies')[0].getData();
		for (i = 0; i < props_agencies.accepted.length; i++){
			agencies.push(props_agencies.accepted[i].id);
		}
		/*var exists_agencies = $.grep(props_agencies, function(elem){ 
			agencies.push(elem.id);
		});*/
		formData.idAgencies = agencies;
		
		var resellers = [];		
		var props_resellers = $('#resellers')[0].getData();
		for (i = 0; i < props_resellers.accepted.length; i++){
			resellers.push(props_resellers.accepted[i].id);
		}
		/*var exists_resellers = $.grep(props_resellers, function(elem){ 
			resellers.push(elem.id);
		});*/
		formData.idResellers = resellers;
		
		var retailers = [];		
		var props_retailers = $('#retailers')[0].getData();
		for (i = 0; i < props_retailers.accepted.length; i++){
			retailers.push(props_retailers.accepted[i].id);
		}
		/*var exists_resellers = $.grep(props_resellers, function(elem){ 
			resellers.push(elem.id);
		});*/
		formData.idRetailers = retailers;
		
		utils.post('/api/users', JSON.stringify(formData), function(response) {
			
			if(response.resultCode == 0) {
				utils.modal('Campaña creada', 'El usuario se ha creado correctamente <br><br>'+
				'<a href="/users/'+response.id+ '">Editar usuario</a><br><br>'+				
				'<a href="/users">Volver a usuarios</a><br><br>', {disableCloseButton:true});
			}
			else {
				switch(response.resultCode) {
					case -4:
						utils.modal('Usuario', 'El nombre de usuario ya existe.<br><br>');
						break;
					
					case -5:
						utils.modal('Usuario', 'El email de usuario ya existe.<br><br>');
						break;
				}
			}
		})
	}
});
