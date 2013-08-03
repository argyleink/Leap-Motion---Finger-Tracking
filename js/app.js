var app = function() {

	var controller 	= new Leap.Controller({enableGestures: true})
	  , debug 		= true // toggle console logging
	  , xoffset 	= window.innerWidth / 4
	  , thumb 		= {}
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

	function watchThumbMotion(thumbPos) {
		debug && console.info(thumbPos[0]);
	}
	

	////////////////  GESTURE EVENTS
	controller.gesture('keyTap', function(data) {
		debug && console.log('tappy');
	});

	controller.gesture('screenTap', function(data) {
		var x = app.accountForScreenXOffset(data.gestures[0].position[0]),
			y = app.accountForScreenYOffset(data.gestures[0].position[1]);
		
		app.moveCrosshair(x,y);

		debug && console.log('poke');
	});


	////////////////  PRIMARY LOOP - ALREADY RAF
	controller.loop(function(frame) {
		var fingers 	= frame.pointables,
			latestFrame = frame;

		if (_.isEmpty(fingers)) return;

		app.moveCrosshair(
			app.accountForScreenXOffset(fingers[0].tipPosition[0]),
			app.accountForScreenYOffset(fingers[0].tipPosition[1])
		);

		if (fingers[1] && fingers[1].tipPosition) {
			app.watchThumbMotion(fingers[1].tipPosition);
		}
	});


	//////////////// DEVICE EVENTS
	controller.on('ready', function() {
		crosshair = document.getElementById('crosshair');

		debug && console.log("ready");
	});

	return {
		moveCrosshair: 				moveCrosshair,
		watchThumbMotion: 			watchThumbMotion,
		accountForScreenXOffset: 	accountForScreenXOffset,
		accountForScreenYOffset: 	accountForScreenYOffset
	};

}();