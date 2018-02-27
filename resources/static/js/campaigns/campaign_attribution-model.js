
window.addEventListener('WebComponentsReady',function() {
	
	
	common.initSlider('slider-campaign-profile', 'profile-breadcrumb-controller');
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');



	let promises = [];
	
	promises.push(new Promise((resolve, reject) => {
		utils.get('/api/campaigns/' + id_campaign, {}, function(campaign) {
			$('#title').html(campaign.name);
			$('<a>',{text: campaign.name,href: '/campaigns/'+campaign.id}).appendTo('.breadcrumbs');
			
			$('infinia-tabs')[0].addTab(0,campaign.name, "", "/campaigns/"+id_campaign);
			utils.addCampaignPaymentTabs(campaign, $('infinia-tabs')[0]);
			
			$('infinia-tabs')[0].setActive(4);
			resolve(campaign);
		});
	}))
	
	promises.push(new Promise((resolve, reject) => {
		utils.get('/api/ma/'+id_campaign+'/campaign', {}, (response) => {
			console.log(response);
			if(response.length && response.length > 0) {
				let ITable = customElements.get('infinia-table');
				let table = new ITable();
				
				$('#models-list').html(table);
				table.disableDownload();
				let rows = []
				response.forEach((elem) => {
					rows.push({id:elem.id, cells:[{id:0, value:elem.name}]});
				})
				table.tableRows = rows;
				$(table).on('rowClick', (e) => {
					window.location = '/campaigns/'+id_campaign+'/attribution_model/view/'+e.detail;
				});
			}
			else {
				$('#models-list').append(
					`<p>No existe ningún modelo de atribución para la campaña</p>
						<a href="/campaigns/${id_campaign}/attribution_model/new" class="btn btn-primary ma-create">Nuevo modelo de atribución</a>`
				); 
			}
			resolve();
		}) 
	}))
	
	Promise.all(promises).then(responses => {
		if(!responses[0].attributionModel) {
			$('.ma-create').remove();
			$('#models-list').html(
					`<p>No se ha contratado el modelo de atribución para esta campaña</p>`
			); 
		}
	})
})
