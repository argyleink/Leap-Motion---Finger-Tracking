var app = function() {

	var controller = new Leap.Controller({enableGestures: true})
		, xoffset = window.innerWidth / 4
		//, yoffset = window.innerHeight / 2
		, latestFrame
		, crosshair;

	function moveCrosshair(x,y) {
		crosshair.style.left = x + 'px';
		crosshair.style.bottom = y + 'px';
	}

	function accountForScreenXOffset(x) {
		return (x * 5) + xoffset;
	}

	function accountForScreenYOffset(y) {
		return y * 2;
	}
	

	////////////////  GESTURE EVENTS
	controller.gesture('keyTap', function(data) {
		console.log('tappy');
	});

	controller.gesture('screenTap', function(data) {
		var x = app.accountForScreenXOffset(data.gestures[0].position[0]),
			y = app.accountForScreenYOffset(data.gestures[0].position[1]);
		
		app.moveCrosshair(x,y);
		console.log('poke');
	});


	////////////////  PRIMARY LOOP - ALREADY RAF
	controller.loop(function(frame) {
		latestFrame = frame;

		if (!frame.pointables || !frame.pointables[0] || frame.pointables[0] === 'undefined') return;

		var x = app.accountForScreenXOffset(frame.pointables[0].tipPosition[0]),
			y = app.accountForScreenYOffset(frame.pointables[0].tipPosition[1]);
	
		app.moveCrosshair(x,y);
	});


	//////////////// DEVICE EVENTS
	controller.on('ready', function() {
		crosshair = document.getElementById('crosshair');
		console.log("ready");
	});

	return {
		moveCrosshair: 				moveCrosshair,
		accountForScreenXOffset: 	accountForScreenXOffset,
		accountForScreenYOffset: 	accountForScreenYOffset
	};

}();