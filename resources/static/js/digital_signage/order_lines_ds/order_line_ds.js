
var orderLine;
var playerList;
var playlistList;
var oLine;
var contentCreate = new ContentCreate();

window.addEventListener('WebComponentsReady',function() {
	
	utils.fillTargetLists();
	
	
	
	//Setting breadcrumbs
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'), href: '/campaigns_ds'}).appendTo('.breadcrumbs');
	
	
	utils.lockScreen();
	
	utils.get("/api/players", {}, function(players) {
		var properties = $.map(players.tableRows, (tableRow) => {
			return {id:tableRow.id, value:tableRow.cells[0].value};
		});
		playerList = properties;
	});
	
	utils.initStatusSelect();
	
	getCampaign(id_campaign_ds, function(campaign) {
		
		$('<a>',{text: campaign.name, href: '/campaigns_ds/'+campaign.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Líneas de pedido",href: '/campaigns_ds/'+campaign.id+'/order_lines_ds'}).appendTo('.breadcrumbs');
		if(!id_order_line_ds) {
			$('date-picker[name="startDate"]')[0].setValue(campaign.startDate);
			$('date-picker[name="endDate"]')[0].setValue(campaign.endDate);
			
			// Orderline data
			// Set max/min date for the date picker
			var minDate = new Date();
			minDate.setDate(minDate.getDate()-1);
			document.querySelector('date-picker[name="startDate"]').setMinDate(minDate);
			document.querySelector('date-picker[name="endDate"]').setMinDate(minDate);
			$('date-picker[name="startDate"]').on('dateSelected', (d) => {
				document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
			});
			$('date-picker[name="endDate"]').on('dateSelected', (d) => {
				document.querySelector('date-picker[name="startDate"]').setMaxDate(new Date(document.querySelector('date-picker[name="endDate"]').getValue()));
			});
		}
		
		if (id_order_line_ds){
			getOrderLine(id_order_line_ds, function(orderLine) {
				oLine = orderLine;
				$('#title').html(orderLine.name);
				utils.loadFormData(orderLine);
				console.log(orderLine)
				contentCreate.contents = orderLine.contents;
				setTimeout(() => {
					Object.keys(orderLine.targeting).forEach((key) => {
						let auxKey = key;
						if(key == "incomeLevel") key = "income_level";
						if($('selectable-list[name="'+key+'"]').length > 0)
						orderLine.targeting[auxKey].forEach((elem) => {
							$('selectable-list[name="'+key+'"]')[0].acceptItem({id:elem})
						})
					})
				}, 300)
				
				orderLine.contents.forEach(content => {
					let info = JSON.parse(content.fileUrl);
					drawContent(info.url, content.name);
				})
				
				utils.unlockScreen();
			});	
		}
		else {
			utils.unlockScreen();
		}
	});	
	
	$('#save-order-line').on('click', function() {
		// Save order line data
		
		if(utils.validateRequired('order_line_ds-form')){
			
			var formData = utils.getFormAsObject('order_line_ds-form');
			formData.idCampaign = id_campaign_ds;
			
			var rules = [];
			formData.targeting = {
				idCampaignDS : id_campaign_ds,
				gender : $.map($('selectable-list[name="gender"]')[0].getData().accepted, (a) => {
					return a.id;
				}),
				age : $.map($('selectable-list[name="age"]')[0].getData().accepted, (a) => {
					return a.id;
				}),
				incomeLevel : $.map($('selectable-list[name="income_level"]')[0].getData().accepted, (a) => {
					return a.id;
				}),
				nationality:  $.map($('selectable-list[name="nationality"]')[0].getData().accepted, (a) => {
					return a.id;
				})
			};
			if (id_order_line_ds){
				formData.id = id_order_line_ds;
				formData.targeting.idOrderLineDS = id_order_line_ds;
			}
			formData.contents = contentCreate.contents;
			
			let players = [];
			$('#waypointMap')[0].selectedPois.forEach((poi) => {
				players.push(poi.category);
			})
			formData.idPlayers = players;
			utils.lockScreen();
			utils.post('/api/order_lines_ds', JSON.stringify(formData), function(response) {
				
				id_order_line_ds = response.id;
				if(response.resultCode == 0) {
					utils.unlockScreen();
					utils.modal("Linea de pedido creada", "La linea de pedido se ha creado correctamente <br><br>"+
							"<a href='/campaigns_ds/" + id_campaign_ds + "/order_lines_ds'>Volver a listado de líneas</a><br><br>"+
							"<a href='/order_lines_ds/" + id_order_line_ds + "?id_campaign_ds=" + id_campaign_ds + "'>Editar línea</a><br><br>"+
							"<a href='/campaigns_ds/" + id_campaign_ds + "'>Volver a la campaña</a><br><br>", { disableCloseButton : true });
				
				} else {
					utils.unlockScreen();
				}
			}, function(error) {
				// Timeout error
				utils.unlockScreen();
				utils.modal("Guardando linea de pedido", "La linea de pedido se encuentra en proceso de guardado <br><br>"+
						"<a href='/campaigns_ds/" + id_campaign_ds + "/order_lines_ds'>Volver a listado de líneas</a><br><br>"+
						"<a href='/campaigns_ds/" + id_campaign_ds + "'>Volver a la campaña</a><br><br>", { disableCloseButton : true });
			});
		}
	});
	
	
	$("#ol-tabs").on("tabClicked" ,function(e){
		
		if (e.detail === 2) {
			$("#waypointMap")[0].init()	
			$("#waypointMap")[0].initCartoManagement();	
			$("#waypointMap")[0].initCarto("", CartoUtils.getStyle('mainHeatMap'))
			$('#cluster-list')[0].doSearch();
		}
		
	});
	
	
	$('#waypointMap').on('circleUnselected', function(e) {
		let index = 0;
		$('#selectedPois')[0].list.some((elem, i) => {
			if(elem.id == e.detail.category) {
				index = i;
				return true;
			}
		})
		$('#selectedPois')[0].splice('list', index, 1);
	})
	
	$('#waypointMap').on('circleSelected', function(e) {
		let index = 0;
		$('#selectedPois')[0].addItem({id:e.detail.circle.category, value:e.detail.circle.search});
	})
	
	$('#new-content').on('click', function() {
		utils.get('/contents/createTemplate',{}, function(response) {
			utils.modal("Crear contenido", response);
			
			$('#content-form').find('#endDate')[0].setValue($('#order-line-dates').find('date-picker[name="endDate"]')[0].getValue());
			$('#content-form').find('#startDate')[0].setValue($('#order-line-dates').find('date-picker[name="startDate"]')[0].getValue());
			
			$('#content-form').find('#startDate')[0].setMinDate(new Date($('#order-line-dates').find('date-picker[name="startDate"]')[0].getValue()));
			$('#content-form').find('#endDate')[0].setMaxDate(new Date($('#order-line-dates').find('date-picker[name="endDate"]')[0].getValue()));
			
			contentCreate.setEvents();
		})
	})
	
	$(window).on('contentAdded', function(e) {
		
		drawContent(JSON.parse(e.detail.fileUrl).url, e.detail.name);
	})
	
	
	$('#publisher-list')[0].setList([
		{id:10, value:"014"},
		{id:11, value:"Media"}
	])
	
	$('#publisher-list').on('itemAccepted', function(e) {	
		if($('#cluster-list')[0].$.clusters_list.accepted.length > 0) {
			drawPlayersData();
		}
	})
	
	$('#cluster-list').on('clusterSelected', function(e) {	
		if($('#publisher-list')[0].accepted.length > 0) {
			drawPlayersData();
		}
	})

});

function drawPlayersData() {
	
	let clusterId = $('#cluster-list')[0].$.clusters_list.accepted[0].id;
	let publisherId = $('#publisher-list')[0].accepted[0].id;
	let sql = `SELECT cluster_homeplace.the_geom, cluster_homeplace.the_geom_webmercator, cluster_homeplace.cartodb_id, players.name  AS count
		FROM players LEFT JOIN cluster_homeplace 
		ON st_contains(players.the_geom,cluster_homeplace.the_geom) 
		where cluster_homeplace.id_cluster = '${clusterId}' AND players.publisher_id='${publisherId}'`
	
	$('#waypointMap')[0].$.cartoManager.overlapLayer('publisher'+publisherId, sql);
	
	sql = "SELECT players.name, players.cartodb_id, players.publisher_id, count(*) AS count FROM players LEFT JOIN cluster_homeplace ON st_contains(players.the_geom,cluster_homeplace.the_geom)"+ 
				"where players.publisher_id = '"+publisherId+"' AND cluster_homeplace.id_cluster = '"+clusterId+"' GROUP BY players.cartodb_id, players.name, players.publisher_id ORDER BY count DESC";

	$.getJSON('https://infiniamaps.carto.com/api/v2/sql/?q='+sql, function(data) {
		
		data.rows.forEach((elem) => {
			  $('#count-list')[0].addItem({id:elem.cartodb_id, value:elem.name + ": "+elem.count.toLocaleString()});
		  })
	});
}

function drawContent(url, name) {
	var div = document.createElement("div");
	div.className = "center-content flex-wrap";
	var img = document.createElement("img");
	img.src = url;
	$(img).css('max-width', '100px')
	$(img).css('max-height', '100px')
	$(div).append(img);
	$(div).append('<div style="width:100%; margin-top:10px; text-align:center">'+name+'</div>')
	$('#contents-list').append(div)
}

function getCampaign(idCampaign, callback){
	utils.get('/api/campaigns_ds/' + idCampaign, {}, callback);
}

function getOrderLine(idOrderLine, callback){
	utils.get('/api/order_lines_ds/' + idOrderLine, {}, callback);
}



