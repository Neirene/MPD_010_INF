window.addEventListener('WebComponentsReady', function() {		
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('creatives'),href: '/creatives'}).appendTo('.breadcrumbs');
	
	
	var selectPromises = [];
	
	var selectsPromise = new Promise((resolve, reject) => {
		//Fill advertisers select
		utils.post("/api/components/selects", JSON.stringify({"fields":[{"id" : 0,"field" : "advertisers"}]}),
			function(options) {
				var advertisers = $.map(options[0].options, (elem) => {
					return { id: elem.id, value: elem.value + ' (' + elem.parentValue + ')' }
				});
				document.querySelector('infinia-select[name="idAdvertiser"]').setOptions(advertisers);
				resolve();
		});
	});
	
	selectPromises.push(selectsPromise);
	
	if(creativeType=="tag") {
		document.querySelector('infinia-select[name="fileType"]').setOptions([
			{id:"gif", value:"GIF"}, {id:"html5", value:"HTML5"}, {id:"swf", value:"SWF"}, {id:"jpg", value:"JPG"}, {id:"unknown", value:localizer.get('unknown')}
		]);
		
		document.querySelector('infinia-select[name="tagType"]').setOptions([
			{id:"SCRIPT", value:"Script"}, {id:"IFRAME", value:"Iframe"}, {id:"IMG", value:"Image"}
		]);
		
		document.querySelector('infinia-select[name="adFormat"]').setOptions([
			{id:"DISPLAY", value:"Display"}, {id:"MOBILE", value:"Mobile"}, {id:"EXPANDABLE", value:"Expandable"}
		]);
		
		document.querySelector('infinia-select[name="adServer"]').setOptions([
			{id:"ATLAS", value:"Atlas"}, {id:"DART", value:"Dart"}, {id:"EYEWONDER", value:"Eyewonder"}, {id:"MEDIAFORGE", value:"mediaFORGE"}, {id:"MEDIAPLEX", value:"Mediaplex"} ,
			{id:"POINTROLL", value:"Pointroll"},{id:"MEDIAMIND", value:"Mediamind"},{id:"YIELD_MANAGER", value:"Yield Manager"},{id:"OTHER", value:localizer.get('other')}
		]);
		
		var defaultMacro = "";
		$('infinia-select[name="adServer"]').on('change', function(e)  {
			
			if(!defaultMacro)
				defaultMacro = $('#macros-example').html();
			
			let ex = {	
				YIELD_MANAGER:[
					{title:"IFRAME", text:'<IFRAME FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=728 HEIGHT=90 SRC="http://ad.yieldmanager.com/st?ad_type=iframe&ad_size=728x90&section=123456&pub_redirect_unencoded=0&pub_redirect=[ENCODED_CLICK_REDIRECT]"></IFRAME>'}
				],
				ATLAS:[
					{title:"IFRAME", text:"<iframe frameborder='0' scrolling='no' marginheight='0' marginwidth='0' topmargin='0' leftmargin='0' allowtransparency='true' height=250' width='300' src='https://ad.atdmt.com/i/a.html;p=11002201179609;cache=[RANDOM_NUMBER]?click=[ENCODED_CLICK_REDIRECT]'></iframe>"},
					{title:"JAVASCRIPT",text:"<script src='http://ad.atdmt.com/i/a.js;p=11002201179609;cache=[RANDOM_NUMBER]?click=[ENCODED_CLICK_REDIRECT]'></script><noscript><iframe frameborder='0' scrolling='no' marginheight='0' marginwidth='0' topmargin='0' leftmargin='0' allowtransparency='true' height='600' width='120' src='https://ad.atdmt.com/i/a.html;p=11002201179609;cache=[RANDOM_NUMBER]?click=[ENCODED_CLICK_REDIRECT]'></iframe></noscript>"}
				],
				MEDIAMIND:[
					{title:"<p>A special consideration for Sizmek ad tags is that you must insert several new URL parameters into the src attribute of the tag: <li>ncu** This parameter includes the [ENCODED_CLICK_REDIRECT]** (The entire value must be surrounded by $$ characters)</li>"+
							"<li>z** The z parameter must have the value 0</li>", text:""}	,
					{title:"JAVASCRIPT", text:'<script src="http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=rsb&c=28&pli=1786619&PluID=0&w=300&h=250&ord=[RANDOM_NUMBER]&ucm=true&ncu=$$[ENCODED_CLICK_REDIRECT]$$&z=0"></script> <noscript> <a href="[UNENCODED_CLICK_REDIRECT]http://bs.serving-sys.com/BurstingPipe/BannerRedirect.asp?FlightID=1786619&Page=&PluID=0&Pos=1997" target="_blank"><img src="http://bs.serving-sys.com/BurstingPipe/BannerSource.asp?FlightID=1786619&Page=&PluID=0&Pos=1997" border=0 width=300 height=250></a> </noscript>'}
					],
				MEDIAPLEX:[
					{title:"IFRAME", text:'<iframe src="http://adfarm.mediaplex.com/ad/fm/00000-000000-00000-0?mpt=[RANDOM_NUMBER]&mpvc=[ENCODED_CLICK_REDIRECT]" width=300 height=250 marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no bordercolor="#000000"> <a href="[UNENCODED_CLICK_REDIRECT]http://adfarm.mediaplex.com/ad/ck/00000-000000-00000-0?mpt=[RANDOM_NUMBER]"> <img src="http://adfarm.mediaplex.com/ad/!bn/00000-000000-00000-0?mpt=[RANDOM_NUMBER]" alt="Click Here" border="0"></a> </iframe>'},
					{title:"JAVASCRIPT", text:'<script type="text/javascript" src="http://adfarm.mediaplex.com/ad/js/00000-000000-00000-0?mpt=[RANDOM_NUMBER]&mpvc=[ENCODED_CLICK_REDIRECT]"> </script> <noscript> <a href="[UNENCODED_CLICK_REDIRECT]http://adfarm.mediaplex.com/ad/nc/00000-000000-00000-0?mpt=[RANDOM_NUMBER]"> <img src="http://adfarm.mediaplex.com/ad/nb/00000-000000-00000-0?mpt=[RANDOM_NUMBER]" alt="Click Here" border="0"> </a> </noscript>'}
				]
			}
			let text = ex[e.detail];
			if(text) {
				$('#macros-example').empty();
				text.forEach((elem) => {
					let p = document.createElement('p');
					
					$('#macros-example').append('<b>'+elem.title+'</b>');
					$('#macros-example').append(p);
					$(p).text(elem.text)
				})
				
			}
			else $('#macros-example').html(defaultMacro)
				
		})
		
		
	}
	else if(creativeType == "video") {
		$('#vastAssetContainer').hide();
		$('input[type=radio][name="asset"]').on('click', function(){
			$('#vastAssetContainer').hide();
			$('#videoAssetContainer').hide();
			if ($("input[type=radio][name='asset']:checked").attr('id') === 'videoAsset'){
				$('#videoAssetContainer').show();
				$('file-loader[name="file"]').addClass('required');
				$('textarea[name="vast"]').addClass('required');
			}
			else {
				$('#vastAssetContainer').show();
				$('file-loader[name="files"]').removeClass('required');
				$('textarea[name="vast"]').addClass('required');
			}
		})
	}
	$("input[type=radio][id='videoAssetContainer']").attr('checked', true).trigger("click");
	
	$('input[name="height"]').attr('placeholder', localizer.get('height'));
	$('input[name="width"]').attr('placeholder', localizer.get('width'));
	
	
	Promise.all(selectPromises).then((results) => {
		if(id_creative) {
			
			utils.get('/api/creatives/'+id_creative, {}, function(response) {
				utils.loadFormData(response);
				var title =localizer.get('creatives');
				$('#title, title').html(response.name);
				
				$("input[type=radio][id="+response.fileType+"Asset]").attr('checked',true).trigger('click');
				
				$('#vastAsset').attr("disabled",true);
				$('#videoAsset').attr("disabled",true);
				
				if(response.thirdPartyEventTrackers) {
					$('#trackers-container').empty();
					JSON.parse(response.thirdPartyEventTrackers).forEach(function(elem) {
						cloneTracker(elem.type, elem.url);
					})
				}
			})
		}
		else {
			var pathname = window.location.pathname.split("/");
			var title =localizer.get('new_creative') + " (" + pathname[pathname.length-1] +")";
			$('#title, title').html(title);
			$('<a>',{text: localizer.get('new_creative'),href: ''}).appendTo('.breadcrumbs');
		}
	})

	$('#save').on('click', function(e) {
		
		if(utils.validateRequired('creative-form')) {
			utils.lockScreen();
			
			
			
			
			
			var fd = utils.getFormAsObject('creative-form');
			fd.creativeType = creativeType;
			fd.id = id_creative || 0;
			fd.thirdPartyEventTrackers = [];
			if (fd.idOrderLines && fd.idOrderLines !== ""){
				fd.idOrderLines = fd.idOrderLines.split(",");
			}
			else {
				fd.idOrderLines = [];
			}
			let correct = true;
			$('#trackers-container .grey-top').each(function(index, elem) {
				let tracker = $(elem).find('infinia-select').val();
				let url =  $(elem).find('.trackerUrl').val();
				
				if(tracker && url) {
					if(!utils.validURL(url)) {
						correct = false;
						return false;
					}
					fd.thirdPartyEventTrackers.push({type:tracker, url:url});
				}
			});
			
			if(!correct) { 
				alert("Alguna URL no es válida"); utils.unlockScreen(); 
				return false;
			}

			fd.thirdPartyEventTrackers = JSON.stringify(fd.thirdPartyEventTrackers);

			
			if (fd.creativeType == 'video'){
				fd.fileType = $('#videoAssetContainer').is(":visible") ? 'video' : 'vast';
			}
			
			var promise = new Promise((resolve, reject) => {
				if (fd.creativeType == "video" && fd.fileType == 'video') {
					$('file-loader')[0].uploadFiles('creatives').then(function(response) {
						fd[$($('file-loader')[0]).attr('name')] = JSON.stringify(response);
						resolve();						
					})
				}
				else {
					resolve();
				}
			})
			
			var url = new URL(window.location.href );
			var duplicate = url.searchParams.get("duplicate");
			if(duplicate == "true") {
				fd.id = 0;
				fd.idOrderLines = [];
				fd.mediamathConceptId=0;
				fd.mediamathId = 0;
			}

			promise.then(function() {
				utils.post('/api/creatives', JSON.stringify(fd), 
					function(response) {
						id_creative = response.id;
						utils.unlockScreen();
						utils.floatingSuccess(localizer.get('saved'));
					},
					function() {utils.unlockScreen();}
				)
			})
		}
	})
		
	
	if(creativeType == "video")
		cloneTracker();
	
	$('#add-tracker').on('click', function() {
		cloneTracker();
	})
	
})

function cloneTracker(selected, url) {
	var tr = $('#eventTracker').clone();
	
	$(tr).removeClass('hidden').appendTo($('#trackers-container'))
	
	$(tr).find('infinia-select')[0].options = [
		{id:'creative:imp', value:"Impression"},
		{id:'creative:click', value:"Click through"},
		{id:'firstQuartile', value:"First Quartile"},
		{id:'midpoint', value:"Midpoint"},
		{id:'thirdQuartile', value:"Third Quartile"},
		{id:'complete', value:"Complete View"},
		{id:'pause', value:"Pause"},
		{id:'mute', value:"Mute"},
		{id:'close', value:"Close"},
		{id:'resume', value:"Resume"},
		{id:'rewind', value:"Rewind"},
		{id:'unmute', value:"Unmute"},
		{id:'fullscreen', value:"Fullscreen"},
		{id:'acceptInvitation', value:"Accept Invitation"},
		{id:'creativeView', value:"Creative View"},
		{id:'start', value:"Start"},
		{id:'expand', value:"Expand"},
		{id:'collapse', value:"Collapse"},
	];
	
	if(selected && url) {
		setTimeout(function() {
			$(tr).find('infinia-select')[0].setValue(selected);
			$(tr).find('.trackerUrl').val(url);
		},200);
		
	}
}

function removeTracker(elem) {
	$(elem).closest('#eventTracker').remove();
	if($('#trackers-container').find('.grey-top').length == 0) {
		cloneTracker();
	}
}
