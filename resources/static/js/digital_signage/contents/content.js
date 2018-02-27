window.addEventListener('WebComponentsReady',function() {
	
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('contents'),href: '/contents'}).appendTo('.breadcrumbs');
	
	utils.datesDepending('startDate', 'endDate');
	
	var minDate = new Date();
	minDate.setDate(minDate.getDate());
	document.querySelector('date-picker[name="startDate"]').setMinDate(minDate);
	$('date-picker[name="startDate"]').on('dateSelected', (d) => {
		document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
	});
	
	if (id_content){
		utils.lockScreen();
		utils.get("/api/contents/" + id_content, {}, function(response) {

			$('#title,#content-name-breadcrumb').html(response.name);
			$('<a>',{text: response.name, href: '/contents/'+response.id}).appendTo('.breadcrumbs');
			
			if(response.fileUrl != null) {
				document.querySelector('file-loader').setFiles(response.fileUrl);		
				$("#filesVal").val(response.fileUrl);
		    }
			
			utils.loadFormData(response);
			utils.unlockScreen();
			
		});
	}
	else {
		$('#title').html("Nuevo contenido");
	}

	$('#save-content').on('click', function(e) {
	
		if(utils.validateRequired('content-form')) {
				
			var fd = utils.getFormAsObject('content-form');
			fd.id = id_content || 0;
			
			var contentName = fd.name;
			utils.lockScreen();
			
			$('file-loader')[0].uploadFiles('admira_contents').then(function(files) {
				try {
					var promiseArray = [];
					
					for (var i=0; i<files.length; i++){
						
						var promise = new Promise((resolve, reject) => {
							if(files[i] == null){
								throw new MissingImageException();	
							}
							
							fd.fileUrl = JSON.stringify(files[i]);
							fd.name = contentName + '_' + (i+1);
							
							utils.post('/api/contents', JSON.stringify(fd), 
								function(response) {
									resolve(response);
								},	
								function(error) {
									reject(error);
								}
							);
						});
						promiseArray.push(promise);
					}
					
					Promise.all(promiseArray).then(values => {
						utils.unlockScreen();
						utils.modal("Contenido creado", "Contenido/s creado/s correctamente <br><br>" + 
									"<a href='/contents'>Volver a contenidos</a><br><br>", { disableCloseButton : true } );
					}).catch(error => {
						utils.unlockScreen();
						alert(error);
					});
				} catch (MissingImageException){
					utils.modal("Error", "Debe adjuntar un archivo");
					utils.unlockScreen();
					return;
				}
			});
		}
	})
});