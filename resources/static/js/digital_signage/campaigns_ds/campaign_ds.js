
window.addEventListener('WebComponentsReady',function() {
	initComponents();	
	setEvents();	
})
var campaignType = "OUTDOOR";

function initComponents() {

	$('h3#title').html(localizer.get('campaign'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns_ds'}).appendTo('.breadcrumbs');

		
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_DIGITAL_SIGNAGE" && accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN") {
		$('#add-ds').hide();
	}

	
	$("#waypointMap")[0].init();

	
	$('#cluster-list')[0].doSearch();
	
	$('#publisher-list')[0].setList([
		{id:10, value:"014"},
		{id:12, value:"Impact Media"},
		{id:13, value:"Exterion Media"},
		{id:14, value:"Clear Channel"}
	])
	
	let promises = [];
	promises.push( new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"resellers"
				},
				{
					"id":"1",
					"field":"advertisers"
				},
				{
					"id":"2",
					"field":"category_tags"
				},
				{
					"id":"3",
					"field":"retailers"
				},
			]
		}), function(data) {
			document.querySelector('paper-typeahead[name="idReseller"]').options = data[0].options;
			document.querySelector('paper-typeahead[name="idAdvertiser"]').options = data[1].options;
			document.querySelector('paper-typeahead[name="idCategoryTag"]').options = data[2].options;
			$('#publisher-list')[0].setList(data[3].options);
			resolve();
		});
	}))

	utils.datesDepending('startDate', 'endDate');

	if(id_campaign_ds) {
		utils.lockScreen();
		utils.get('/api/campaigns_ds/'+id_campaign_ds, {}, function(response) {
			campaign = response;
			$('#title,#campaign_ds-name-breadcrumb').html(response.name);
			$('<a>',{text: response.name, href: '/campaigns_ds/' + response.id }).appendTo('.breadcrumbs');
			
			Promise.all(promises).then(() => {
				utils.loadFormData(response);
				utils.unlockScreen();
			})
		});
	}
	else {
		let dat = new Date();
		utils.resetDate(dat);
		
		document.getElementById('startDate').setValue(dat.getTime());
		document.querySelector('date-picker[name="startDate"]').setMinDate(dat);
		dat.setMonth(dat.getMonth()+1);
		document.getElementById('endDate').setValue(dat.getTime());
	}
}

function setEvents() {
	$('.next-step').on('click', function() {
		$('infinia-tabs')[0].next();
	})
	
	$('infinia-tabs').on('tabSelected', function(e) {
		if(e.detail == 1) {
			addDateDayPicker();
		}
	})
	
	
	
	$('#add-datedaypicker').on('click', function(e) {
		addDateDayPicker(true);
	})
	
	$('paper-radio-button[name="unlimited"]').on('click', () => {
		$('#hour-pass-count').val('');
		$('#hour-pass-count').prop('disabled', 'true');
	})
	
	$('paper-radio-button[name="emission"]').on('click', () => {
		$('#hour-pass-count').prop('disabled', '');
		$('#hour-pass-count').focus();
	})
	
	$('#add-content').on('click', () => {

		utils.get("/api/contents/all", {}, function(contents) {
			
			var modalHtml = '<div id="contents-list" style="min-width:600px;">';
			for (var co=0; co<contents.length; co++){
				
				let exists = false; 
				$('#contents-container').children().each((index, elem)=> {
					if($(elem).attr('idcontent') == contents[co].id) { 
						exists = true;
						return false;
					}
				})
				if(!exists){
					var content = contents[co];
					modalHtml += '<campaign-content-card hidden-rules="hidden" hidden-delete="hidden" idcontent=' + content.id + ' file-type="'+JSON.parse(content.fileUrl).fileType+'" file-url="' + JSON.parse(content.fileUrl).url+ '" title="' + content.name 
					+ '" duration=' + content.duration + ' start-date="'+utils.formatDate(new Date(content.startDate), true)+'" end-date="'+utils.formatDate(new Date(content.endDate), true)+'"></campaign-content-card>';
				}
			}
			modalHtml += '</div>';
			modalHtml += '<div class="text-center" style="margin-bottom:100px;"><button class="btn btn-primary" id="add-contents" type="button">Añadir</button></div>';
			utils.modal('Añadir contenido', modalHtml);
			
			$('#add-contents').on('click', function() {
				$('#contents-list').children().each(function(index, elem) {
					if(elem.$.selected.checked) {
						elem.hiddenDelete = "";
						elem.hiddenRules = "";
						elem.hiddenCheckbox = "hidden";
						$('#contents-container').append(elem);
					}
				})
				setTimeout(function(){
					$("#modal")[0].close();
					addContentsTimetables();
				}, 100)
			})
		});
	})
	
	$('.save-ds-campaign').on('click', function() {
		
		if (utils.validateRequired('campaign_ds-form')){
			utils.lockScreen();
			var formData = utils.getFormAsObject('campaign_ds-form');
			if (id_campaign_ds) {
				formData.id = id_campaign_ds
			}
			
			if (formData.emissionType == 0){
				formData.emissionType = 2;
			}
			
			formData.targeting = { dateRangesString : [], contentDateRangesString : [] };
			$('date-day-picker').map((index, elem) => { 
				var data = elem.getData();
				formData.targeting.dateRangesString.push(JSON.stringify(data));
			});
			
			locationData = {
				cluster: $('#cluster-list')[0].getData().accepted,
				vendor: $('#publisher-list')[0].getData().accepted,
				players:$('#count-list')[0].getData().accepted
			}
			
			let conf = {
				location:locationData
			}
			formData.configuration = JSON.stringify(conf);
			
			formData.idContents = [];
			$('campaign-content-card').map((index, elem) => { 
				var data = elem.getData();
				formData.idContents.push(data.idcontent);
				formData.targeting.contentDateRangesString.push(JSON.stringify(data));
			});
			
			formData.type = campaignType;
			
			utils.post('/api/campaigns_ds', JSON.stringify(formData), function(response) {
				
				utils.unlockScreen();
				if(response.resultCode == 0) {
					utils.modal("Campaña guardada", "La campaña se ha guardado correctamente <br><br>"+
							"<a href='/campaigns_ds/" + response.id + "'>Editar campaña</a><br><br>"+
							"<a href='/campaigns_ds'>Volver a campañas</a><br><br>", { disableCloseButton:true });
				}				
			}, function(error) {
				utils.unlockScreen();
				console.log(error);
			});
		}
		
	});
	
	
	$('#add-ds').on('click', function() {
		if($('infinia-tabs')[0].numTabs() < 3) {
			$('infinia-tabs')[0].addTab(2,localizer.get('Contenido y horario'));
		}
		$('infinia-tabs')[0].active = 2;
		campaignType = "DIGITAL_SIGNAGE";
	})
	
	$('#publisher-list').on('itemAccepted', function(e) {
		$('#circuits-list')[0].removeAllAccepted();
		$('#circuits-list')[0].setList([
			{id:1, value:"Noche"},
			{id:2, value:"Bares"},
		])
	})
	
	$('#circuits-list').on('itemAccepted', function(e) {
		
		if($('#map-container').children().length == 0)
			$('#map-container').html('');
		//$("#waypointMap")[0].mapId = $('#cluster-list')[0].$.clusters_list.accepted[0].id;
		
		if($("#waypointMap")[0].mapId = $('#cluster-list')[0].$.clusters_list.accepted.length > 0) {
			$("#waypointMap")[0].mapId =  '5a81567046e0fb0005701061';
		}
		
		setTimeout(() => {
			
			$("#waypointMap").on('zoom_changed', function(e) {
				drawPlayersData();
			})
			
			$("#waypointMap").on('filter_applied', function(e) {
				drawPlayersData(e.detail);
				addPlayersClusterCount(e.detail);
			})
			
			drawPlayersData();
			addPlayersClusterCount();
		}, 200)
	})
	
	$('#cluster-list').on('clusterSelected', function(e) {
		
		$('#waypointMap')[0].mapId = "5a81567046e0fb0005701061";
		$('#waypointMap')[0].updateMap();
		if($('#circuits-list')[0].accepted.length > 0)
			drawPlayersData();
	})
}

		
function addDateDayPicker(showAlert) {
	
	let ddp  = new(customElements.get('date-day-picker'));
	let campaignInit = $('#startDate')[0].getValue();
	let campaignEnd = $('#endDate')[0].getValue();
	
	$(ddp).on('elem-changed', () => {
		addContentsTimetables(true);
	})
	
	if($('#date-day-picker-container').children().length == 0) {
		$('#date-day-picker-container').append(ddp);
		setTimeout(() =>{
			ddp.setStartDate(document.getElementById('startDate').getValue());
			ddp.setMinStartDate(new Date(document.getElementById('startDate').getValue()));
			ddp.setEndDate(document.getElementById('endDate').getValue());
			ddp.setMaxEndDate(new Date(document.getElementById('endDate').getValue()));
		}, 200);
		return;
	}
	else {
		$('#date-day-picker-container').children().each((index, elem) => {
			let data = elem.getData();
			
			//If the first element doesnt start on campaign init, then add at the begin of the list
			if(index == 0 && data.startDate > campaignInit) {
				$(ddp).insertBefore(elem);
				setTimeout(()=> {
					ddp.setStartDate(campaignInit);
					let elemEnd = new Date(data.startDate);
					elemEnd.setDate(elemEnd.getDate() -1);
					ddp.setEndDate(elemEnd.getTime());
					updateMaxMinDatesRanges();
				}, 200);
				
				return false;
			}
			//If the last element doesn´t finish on campaign end, then add at the end of the list
			else if(index == $('#date-day-picker-container').children().length -1 && data.endDate < campaignEnd) {
				$(ddp).insertAfter(elem);
				setTimeout(()=> {
					let elemEnd = new Date(data.endDate);
					elemEnd.setDate(elemEnd.getDate() + 1);
					ddp.setStartDate(elemEnd);
					ddp.setEndDate(campaignEnd);
					updateMaxMinDatesRanges();
				}, 200);
				
				return false;
			}
			else if(index < $('#date-day-picker-container').children().length -1) {
				let nextElement = $('#date-day-picker-container').children().get(index+1);
				if(utils.daysBetween(new Date(elem.$.endDate.getValue()), new Date(nextElement.$.startDate.getValue())) > 1) {
					$(ddp).insertAfter(elem);
					setTimeout(()=> {
						let elemInit = new Date(data.endDate);
						elemInit.setDate(elemInit.getDate() + 1);
						ddp.setStartDate(elemInit.getTime());
						let elemEnd = new Date(nextElement.$.startDate.getValue());
						elemEnd.setDate(elemEnd.getDate() - 1);
						ddp.setEndDate(elemEnd.getTime());
						updateMaxMinDatesRanges();
					}, 200);
					return false;
				}
			}
			else if(showAlert && $('#date-day-picker-container').children().length - 1 == index) {
				alert("El rango de fechas está completo")
			}
		})
	}
}

function updateMaxMinDatesRanges() {
	let campaignInit = $('#startDate')[0].getValue();
	let campaignEnd = $('#endDate')[0].getValue();
	
	$('#date-day-picker-container').children().each((index, elem) => {
		if(index == 0) {
			elem.setMinStartDate(new Date(campaignInit));
			elem.setMinEndDate(new Date(campaignInit));
		}
		if(index > 0) {
			let prevElem = $('#date-day-picker-container').children().get(index - 1);
			let prevElemEnd = new Date(prevElem.$.endDate.getValue());
			prevElemEnd.setDate(prevElemEnd.getDate() + 1);
			elem.setMinStartDate(prevElemEnd);
			elem.setMinEndDate(prevElemEnd);
		}
		if(index < ($('#date-day-picker-container').children().length - 1)) {
			let nextElem = $('#date-day-picker-container').children().get(index + 1);
			nextElemInit = new Date(nextElem.$.startDate.getValue());
			nextElemInit.setDate(nextElemInit.getDate() - 1)
			elem.setMaxStartDate(nextElemInit);
			elem.setMaxEndDate(nextElemInit);
		}
		if(index == $('#date-day-picker-container').children().length - 1) {
			elem.setMaxStartDate(new Date(campaignEnd));
			elem.setMaxEndDate(new Date(campaignEnd));
		}
	})
}

function addContentsTimetables(expand) {
	
	$('#contents-container').children().each(function(index, elem) {
		let collapsible = new(customElements.get('collapsible-content'))
		$(elem).empty();
		$(collapsible).html($('#date-day-picker-container').html());
		collapsible.title="Horarios";
		if(!expand)
			collapsible.collapsed = true;
		elem.clearDateDayPickers();
		elem.appendDateDayPicker(collapsible);
		setTimeout(() => {
			$(collapsible).children().each(function(i, el) {
				el.deleteHidden = "hidden";
				el.setData($('#date-day-picker-container').children().get(i).getData());
			})
		}, 200)
	})
	
}

function addPlayersClusterCount(whereQuery) {
	//let clusterId = $('#cluster-list')[0].$.clusters_list.accepted[0].id;
	let clusterId = '5a81567046e0fb0005701061';
	let publisherId = 10;//$('#publisher-list')[0].accepted[0].id;
	
	if(whereQuery)
		whereQuery = whereQuery + " AND p.publisher_id='"+publisherId+"'";
	else
		whereQuery = " WHERE p.publisher_id='"+publisherId+"'";
	
	let sql = `SELECT p.the_geom_webmercator, p.cartodb_id , p.name,  count(*) FROM infiniamaps.players p inner join cluster_workplace_5a81567046e0fb0005701061 cw on st_contains(p.the_geom, cw.the_geom) ${whereQuery} group by p.name,p.the_geom_webmercator, p.cartodb_id order by count desc`
		
	
	$.getJSON('https://infiniamaps.carto.com/api/v2/sql/?api_key=faf8ad771e162441a5f299ada5e044e63e2a2ed9&q='+sql, function(data) {
		
		let list = [];
		let top = data.rows[0].count;
		data.rows.forEach((elem) => {
			
			 list.push({id:elem.cartodb_id, value:elem.name + ": "+((elem.count / top)*100).toFixed(2).toLocaleString()+" %"});
		  })
		   $('#count-list')[0].setList(list);
	});
}

function drawPlayersData(whereQuery) {
	
	let publisherId =10;// $('#publisher-list')[0].accepted[0].id;
	if(whereQuery)
		whereQuery = whereQuery + " AND p.publisher_id='"+publisherId+"'";
	else
		whereQuery = " WHERE p.publisher_id='"+publisherId+"'";
	
	let sql = `SELECT p.the_geom_webmercator, p.cartodb_id , p.name,  count(*) FROM infiniamaps.players p inner join cluster_workplace_5a81567046e0fb0005701061 cw on st_contains(p.the_geom, cw.the_geom) ${whereQuery} group by p.name,p.the_geom_webmercator, p.cartodb_id order by count desc`
	setTimeout(function() {
		$('profile-map')[0].$.map.$.cartoManagement.removeCartoLayer('publisher'+publisherId);
		$('#waypointMap')[0].$.map.setCartoLayer('publisher'+publisherId, sql, CartoUtils.getStyle('players'));
		
	}, 500);
	
}