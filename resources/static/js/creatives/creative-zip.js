window.addEventListener('WebComponentsReady', function() {		
	
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('creatives'),href: '/creatives'}).appendTo('.breadcrumbs');
	
	
	
	loadSelects();
	
	$('#save').on('click', function(e) {
		$('file-loader').removeClass('has-error');		
		if(utils.validateRequired('creative-form')) {
			
			let filesAdded = true;
			$('file-loader').each(function(index, elem) {
				if(elem.getFiles().length == 0) {
					$(elem).addClass('has-error');
					filesAdded = false;
				}
			})
			
			if(!filesAdded)
				return;
			
			utils.lockScreen();
				
		
				let promises = [];
				promises.push($('file-loader[name="image-file"]')[0].uploadFiles('creatives'));
				promises.push($('file-loader[name="zip-file"]')[0].uploadFiles('creatives'));
				
				Promise.all(promises).then(values => {
					
					var files=[];
					values.forEach(function(file){
						files.push(file[0]);
					})
					var fd={};
					fd.files = JSON.stringify(files);
					fd.name = $('input[name="name"]').val();
					fd.idAdvertiser = $('infinia-select[name="idAdvertiser"]').val();
					fd.creativeType = creativeType;
					fd.clickThroughUrl = $('input[name="clickThroughUrl"]').val();
					fd.id = id_creative;
					fd.creativeThirdPartyUrl = $('input[name="creativeThirdPartyUrl"]').val();
					if ($('input[name=idOrderLines]')[0].value !== ""){
						fd.idOrderLines = $('input[name=idOrderLines]')[0].value.split(',');
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
							id_creative = response.id;
							utils.unlockScreen();
							utils.modal("Creatividad creada", "La creatividad se ha creado correctamente <br><br>"+
									"<a href='/creatives'>Volver a creatividades</a><br><br>",false);
							},
						function(response) {console.log(response);utils.unlockScreen();}
					)
				})
			
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
				$('file-loader[name="image-file"]')[0].setFiles(JSON.stringify([JSON.parse(response.files)[0]]))
				$('file-loader[name="zip-file"]')[0].setFiles(JSON.stringify([JSON.parse(response.files)[1]]));
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