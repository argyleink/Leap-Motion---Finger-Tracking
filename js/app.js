var app = function() {

	var controller 	= new Leap.Controller({enableGestures: true})
	  , debug 		= false // toggle console logging
	  , xoffset 	= window.innerWidth / 4
	  , crosshair 	= {}
	  , thumb 		= { x: 0 }
	  , latestFrame;

	function moveCrosshair(x,y) {
		crosshair.el.style.left 	= crosshair.x = x + 'px';
		crosshair.el.style.bottom 	= crosshair.y = y + 'px';
	}

	function shoot() {
		console.log('BANG!' + crosshair.x);
	}

	function accountForScreenXOffset(x) {
		return Math.floor( (x * 5) + xoffset );
	}

	function accountForScreenYOffset(y) {
		return Math.floor( y * 2 );
	}

	function watchThumbMotion(thumbPos) {
		var distance = Math.abs(thumb.x - thumbPos[0]);
		
		if (distance > 40)
			app.shoot()

		thumb.x = thumbPos[0];
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
		crosshair.el = document.getElementById('crosshair');

		debug && console.log("ready");
	});

	return {
		moveCrosshair: 				moveCrosshair,
		shoot: 						_.throttle(shoot, 300),
		watchThumbMotion: 			watchThumbMotion,
		accountForScreenXOffset: 	accountForScreenXOffset,
		accountForScreenYOffset: 	accountForScreenYOffset
	};

}();