
$(document).ready(function () {
	/************************
	/*	MAIN NAVIGATION
	/************************/
    $('.menu-modules .js-module-menu-toggle').click(function (e) {
        e.preventDefault();
        $li = $(this).parents('li');
        if (!$li.hasClass('active')) {
            $li.find('.toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
            $li.addClass('active');
            AddActiveMenuModule($($li).data("name"));
        }
        else {
            $li.find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
            $li.removeClass('active');
            RemoveActiveMenuModule($($li).data("name"));
        }
        $li.find('.main-menu').slideToggle(300);
    });


	$('.main-menu .js-sub-menu-toggle').click( function(e){

		e.preventDefault();

		$li = $(this).parent();
		if( !$li.hasClass('active')){
			$li.find('.toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
			$li.addClass('active');
			AddActiveMenuModuleItem($($li).data("name"));
		}
		else {
			$li.find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
			$li.removeClass('active');
			RemoveActiveMenuModuleItem($($li).data("name"));
		} 
	
		$li.find('.sub-menu').slideToggle(300);
	});

	$('.js-toggle-minified').clickToggle(
		function() {
			$('.left-sidebar').addClass('minified');
			$('.content-wrapper').addClass('expanded');

			$('.left-sidebar .sub-menu')
			.css('display', 'none')
			.css('overflow', 'hidden'); 
			
			$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
		},
		function() {
			$('.left-sidebar').removeClass('minified');
			$('.content-wrapper').removeClass('expanded');
			$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');

			$("li[data-name]").find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
			$("li[data-name]").removeClass('active');

			$("li[data-name]").find('.main-menu').hide();
			$("li[data-name]").find('.sub-menu').hide();

			$.cookie("_activesMenuModule", '', { expires: 10 });
			$.cookie("_activesMenuModuleItem", '', { expires: 10 });
		}
	);

	// main responsive nav toggle
	//$('.main-nav-toggle').clickToggle(
	//	function() {
	//		$('.left-sidebar').slideDown(300)
	//	},
	//	function() {
	//		$('.left-sidebar').slideUp(300);
	//	}
	//);

	$('.widget .btn-toggle-expand').click(function () {
	    $(this).find('i.fa-chevron-up').toggleClass('fa-chevron-down');
	    if ($(this).parents('.widget').find('.widget-content').css('display') == 'none')
	        $(this).parents('.widget').find('.widget-content').slideDown(300);
	    else
	        $(this).parents('.widget').find('.widget-content').slideUp(300);
	   
	});


	//*******************************************
	/*	LIVE SEARCH
	/********************************************/

	//$mainContentCopy = $('.main-content').clone();
	//$('.searchbox input[type="search"]').keydown( function(e) {
	//	var $this = $(this);
		
	//	setTimeout(function() {
	//		var query = $this.val();
			
	//		if( query.length > 2 ) {
	//			var regex = new RegExp(query, "i");
	//			var filteredWidget = [];

	//			$('.widget-header h3').each( function(index, el){
	//				var matches = $(this).text().match(regex);

	//				if( matches != "" && matches != null ) {
	//					filteredWidget.push( $(this).parents('.widget') );
	//				}
	//			});
				
	//			if( filteredWidget.length > 0 ) {
	//				$('.main-content .widget').hide();
	//				$.each( filteredWidget, function(key, widget) {
	//					widget.show();
	//				});
	//			}else{
	//				console.log('widget not found');
	//			}
	//		}else {
	//			$('.main-content .widget').show();
	//		}
	//	}, 0);
	//});

	// widget remove
	$('.widget .btn-remove').click(function(e){

		e.preventDefault();
		$(this).parents('.widget').fadeOut(300, function(){
			$(this).remove();
		});
	});

	// widget toggle expand
	//$('.widget .btn-toggle-expand').clickToggle(
	//	function(e) {
	//		e.preventDefault();
	//		$(this).parents('.widget').find('.widget-content').slideUp(300);
	//		$(this).find('i.fa-chevron-up').toggleClass('fa-chevron-down');


	//	},
	//	function(e) {
	//		e.preventDefault();
	//		$(this).parents('.widget').find('.widget-content').slideDown(300);
	//		$(this).find('i.fa-chevron-up').toggleClass('fa-chevron-down');
	//	}
    //);

	

	// widget focus
	$('.widget .btn-focus').clickToggle(
		function(e) {
			e.preventDefault();
			$(this).find('i.fa-eye').toggleClass('fa-eye-slash');
			$(this).parents('.widget').find('.btn-remove').addClass('link-disabled');
			$(this).parents('.widget').addClass('widget-focus-enabled');
			$('<div id="focus-overlay"></div>').hide().appendTo('body').fadeIn(300);

		},
		function(e) {
			e.preventDefault();
			$theWidget = $(this).parents('.widget');
			
			$(this).find('i.fa-eye').toggleClass('fa-eye-slash');
			$theWidget.find('.btn-remove').removeClass('link-disabled');
			$('body').find('#focus-overlay').fadeOut(function(){
				$(this).remove();
				$theWidget.removeClass('widget-focus-enabled');
			});
		}
	);


	/************************
	/*	WINDOW RESIZE
	/************************/

	//$(window).bind("resize", resizeResponse);

	//function resizeResponse() {

	//	if( $(window).width() < (992-15)) {
	//		if( $('.left-sidebar').hasClass('minified') ) {
	//			$('.left-sidebar').removeClass('minified');
	//			$('.left-sidebar').addClass('init-minified');
	//		}

	//	}else {
	//		if( $('.left-sidebar').hasClass('init-minified') ) {
	//			$('.left-sidebar')
	//			.removeClass('init-minified')
	//			.addClass('minified');
	//		}
	//	}
	//}


	/************************
	/*	BOOTSTRAP TOOLTIP
	/************************/

	//$('body').tooltip({
	//	selector: "[data-toggle=tooltip]",
	//	container: "body"
	//});


	/************************
	/*	BOOTSTRAP ALERT
	/************************/

	$('.alert .close').click( function(e){
		e.preventDefault();
		$(this).parents('.alert').fadeOut(300);
	});


	
	

	//*******************************************
	/*	SWITCH INIT
	/********************************************/

	if( $('.bs-switch').length > 0 ) {
		$('.bs-switch').bootstrapSwitch();
	}

	/* set minimum height for the left content wrapper, demo purpose only  */
	if( $('.demo-only-page-blank').length > 0 ) {
		$('.content-wrapper').css('min-height', $('.wrapper').outerHeight(true) - $('.top-bar').outerHeight(true));
	}


	

});

// toggle function
$.fn.clickToggle = function( f1, f2 ) {
	return this.each( function() {
		var clicked = false;
		$(this).bind('click', function() {
			if(clicked) {
				clicked = false;
				return f2.apply(this, arguments);
			}

			clicked = true;
			return f1.apply(this, arguments);
		});
	});

}