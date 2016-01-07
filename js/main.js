jQuery(document).ready(function($){
	var animating = false;

	//update arrows visibility and detect which section is visible in the viewport
	setSlider();
	$(window).on('scroll resize', function(){
		(!window.requestAnimationFrame) ? setSlider() : window.requestAnimationFrame(setSlider);
	});

	//move to next/previous section clicking on arrows
    $('.cd-vertical-nav .cd-prev').on('click', function(){
    	prevSection();
    });
    $('.cd-vertical-nav .cd-next').on('click', function(){
    	nextSection();
    });

    //move to next/previous using the keyboards
    $(document).keydown(function(event){
		if( event.which=='38' ) {
			prevSection();
			event.preventDefault();
		} else if( event.which=='40' ) {
			nextSection();
			event.preventDefault();
		}
	});

	//go to next section
	function nextSection() {
		if (!animating) {
			if ($('.is-visible[data-type="slider-item"]').next().length > 0) smoothScroll($('.is-visible[data-type="slider-item"]').next());
		}
	}

	//go to previous section
	function prevSection() {
		if (!animating) {
			var prevSection = $('.is-visible[data-type="slider-item"]');
			if(prevSection.length > 0 && $(window).scrollTop() != prevSection.offset().top) {
				smoothScroll(prevSection);
			} else if(prevSection.prev().length > 0 && $(window).scrollTop() == prevSection.offset().top) {
				smoothScroll(prevSection.prev('[data-type="slider-item"]'));
			}
		}
	}

	function setSlider() {
		checkNavigation();
		checkVisibleSection();
	}

	//update the visibility of the navigation arrows
	function checkNavigation() {
		( $(window).scrollTop() < $(window).height()/2 ) ? $('.cd-vertical-nav .cd-prev').addClass('inactive') : $('.cd-vertical-nav .cd-prev').removeClass('inactive');
		( $(window).scrollTop() > $(document).height() - 3*$(window).height()/2 ) ? $('.cd-vertical-nav .cd-next').addClass('inactive') : $('.cd-vertical-nav .cd-next').removeClass('inactive');
	}

	//detect which section is visible in the viewport
	function checkVisibleSection() {
		var scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height();

		$('[data-type="slider-item"]').each(function(){
			var actualBlock = $(this),
				offset = scrollTop - actualBlock.offset().top;
			//add/remove .is-visible class if the section is in the viewport - it is used to navigate through the sections
			( offset >= 0 && offset < windowHeight ) ? actualBlock.addClass('is-visible') : actualBlock.removeClass('is-visible');
		});
	}

	function smoothScroll(target) {
		animating = true;
        $('body,html').animate({'scrollTop': target.offset().top}, 500, function(){ animating = false; });
	}

	var rotation = 0,
	scrollLoc = $(document).scrollTop();
	$(window).scroll(function() {
		var newLoc = $(document).scrollTop();
		var diff = scrollLoc - newLoc;
		rotation += diff, scrollLoc = newLoc;
		var rotationStr = "rotate(" + rotation + "deg)";
		$(".gear").css({
			"-webkit-transform": rotationStr,
			"-moz-transform": rotationStr,
			"transform": rotationStr
		});
	});

	var homeH = $( window ).height(),
			navPanels = $();

		$('#prod-menu a').each(function() {
			navPanels = navPanels.add($(this.hash));	// easy array of nav panels according to nav items
		});

		$( window ).scroll(function() {
			// toggle top menu selection
			navPanels.each(function() {
				var $p = $(this)	// current panel in loop
				var viewTop = $( window ).scrollTop() + $('#prod-menu').outerHeight();
				if (viewTop  >= $p.offset().top) {
					$("#prod-menu ul li").removeClass("sel");
					if ($p.offset().top + $p.outerHeight() > viewTop) {
						$('#prod-menu a').filter('[href="#'+$p.attr('id')+'"]').parent().addClass("sel");
					}
				}
			});
		});

		// animating anchor link scrolling
		// snippet from css-tricks
		// css-tricks.com/snippets/jquery/smooth-scrolling
		$("a[href*=#]:not([href=#])").click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top-$('#prod-menu').outerHeight()
					}, 700);
					return false;
				}
			}
		});
});
