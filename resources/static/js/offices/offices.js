
var Offices = function(){};
officesObj = new Offices();


window.addEventListener('WebComponentsReady', function() {

	$('h3#title').html(localizer.get('offices'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('offices'),href: '/offices'}).appendTo('.breadcrumbs');

	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"agencyName"}, {name:"city"}, {name:"email"}];
	
	var tableManager = new TableManager('/api/offices');
	tableManager.init('office-actions', filter);


});