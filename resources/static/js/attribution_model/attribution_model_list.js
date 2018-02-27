$('h3#title').html(localizer.get('customer_journey'));
$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
$('<a>',{text: localizer.get('customer_journey'),href: '/attribution_model'}).appendTo('.breadcrumbs');



let tableManager = new TableManager('/api/ma');
tableManager.disableSorting();
tableManager.setDefaultFilter({type:"CLUSTER"});
tableManager.init();
tableManager.disableDownload();


