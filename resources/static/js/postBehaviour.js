$('.numbersOnly').keydown(function(e) {
	 if (e.keyCode === 190 || e.keyCode === 188 || e.keyCode==189) {
		e.preventDefault();
	 }
});


$('.decimalOnly').keydown(function(e) {
	 if ( e.keyCode==189) {
		e.preventDefault();
	 }
});




$('.numbersOnly').bind('paste', function (e) {
    e.preventDefault();
 });
