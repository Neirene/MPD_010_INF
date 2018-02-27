window.addEventListener('WebComponentsReady', function() {		
	
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('creatives'),href: '/creatives'}).appendTo('.breadcrumbs');
	
	$('file-loader[name="files"]').on('fileLoaded', function(event) {
		if(!id_creative) {
			this.hideThumbnails();			
		}
		var file = event.detail;
		$('#files-list').append(
				['<li class="list-group-item">',
					'<div class="row">',
						'<div class="col-sm-4 pt7 fileName">',
							file.name,
						'</div>',
						'<div class="col-sm-4">',
							'<input name="clickThroughUrl" class="required form-control" placeholder="Click through URL"/>',
						'</div>',
						'<div class="col-sm-4">',
							'<textarea name="creativeThirdPartyUrl" style="height:34px" class="form-control" placeholder="Third Party Pixel"/>',
						'</div>',
					'</div>',
				'</li>'].join(""));
	}) 
	
	loadSelects();
	
	$('#save').on('click', function(e) {
		
		if(utils.validateRequired('creative-form')) {
			utils.lockScreen();
				
			if(id_creative) {
				
				$('file-loader[name="files"]')[0].uploadFiles('creatives').then(function(files) {
					var fd = utils.getFormAsObject('creative-form');
					fd.creativeType = creativeType;
					fd.id = id_creative;
					fd.creativeThirdPartyUrl = $("textarea[name='creativeThirdPartyUrl']").val();
					fd.files = JSON.stringify(files);
					fd.filesVal = fd.files;
					if (fd.idOrderLines && fd.idOrderLines !== ""){
						fd.idOrderLines = fd.idOrderLines.split(",");
					}
					else {
						fd.idOrderLines=[];
					}
					
					var url = new URL(window.location.href );
					var duplicate = url.searchParams.get("duplicate");
					if(duplicate == "true") {
						fd.id = 0;
						fd.idOrderLines = [];
						fd.mediamathConceptId=0;
						fd.mediamathId = 0;
					}
					
					utils.post('/api/creatives', JSON.stringify(fd), 
						function(response) {
							utils.unlockScreen();
							utils.modal("Creatividad actualizada", "La creatividad se ha actualizado correctamente <br><br>"+
									"<a href='/creatives'>Volver a creatividades</a><br><br>");
						},
						function(error) {
							utils.unlockScreen();
						}
					)
					
				})
				
				
				
			}
			
			else {

				$('file-loader[name="files"]')[0].uploadFiles('creatives').then(function(response) {
					
					var images = true;
					
					if(response == ""){
						utils.modal("Error", "Debe adjuntar un contenido");
						utils.unlockScreen();
						return;
					}
					
					response.forEach(function(file) {
						if(file.fileType == 'other') {
							images = false;
						}
					})
					
					if(images) {
					
						$('#files-list li').each(function(index, li){
							let name = $(li).find('.fileName').html();
							
							response.forEach(function(file){
								if(file.name == name) {
									var fd = {};
									fd.files = JSON.stringify([file]);
									fd.name = file.name;
									fd.idAdvertiser = $('infinia-select[name="idAdvertiser"]').val();
									fd.creativeType = creativeType;
									fd.clickThroughUrl = $(li).find('input[name="clickThroughUrl"]').val();
									fd.idCreative = id_creative;
									fd.creativeThirdPartyUrl = $(li).find("textarea[name='creativeThirdPartyUrl']").val();
									console.log("sending: "+JSON.stringify(fd));
									
									var image = new Image();
			        				image.src = file.url;
			          				
									image.onload = function(e) {
										fd.height = image.height;
										fd.width = image.width;
										let split = file.name.split("\.");
										let extension = split[split.length-1];
										fd.fileType = extension;
										utils.post('/api/creatives', JSON.stringify(fd), 
												function(response) {
													id_creative = response.id;
													utils.unlockScreen();
													utils.modal("Creatividad creada", "La creatividad se ha creado correctamente <br><br>"+
															"<a href='/creatives'>Volver a creatividades</a><br><br>",false);
													},
												function() {utils.unlockScreen();}
										)
									}
								}
							})
						})
					}
					else {
						
					}
				})
			}//End new creative
		}
	})
})


function loadSelects ()  {
	var selectPromises = [];
	
	var selectsPromise = new Promise((resolve, reject) => {
		//Fill advertisers select
		utils.post("/api/components/selects", JSON.stringify({"fields":[{"id" : 0,"field" : "advertisers"}]}),
			function(advertisers) {
				document.querySelector('infinia-select[name="idAdvertiser"]').setOptions(advertisers[0].options);
				resolve();
			}
		);
	});

	selectPromises.push(selectsPromise);
	
	Promise.all(selectPromises).then((results) => {
		if(id_creative) {
			
			utils.get('/api/creatives/'+id_creative, {}, function(response) {
				utils.loadFormData(response);
				$("#filesVal").val(response.files);
				var title =localizer.get('creatives');
				$('#title, title').html(response.name);
			})
		}
		else {
			var pathname = window.location.pathname.split("/");
			var title =localizer.get('new_creative') + " (" + pathname[pathname.length-1] +")";
			$('#title, title').html(title);
			$('<a>',{text: localizer.get('new_creative'),href: ''}).appendTo('.breadcrumbs');
		}
	})
}