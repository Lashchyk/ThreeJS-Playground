   $(function () {
	   $( "#addVectors" ).click(function() {
		  var allChildren = scene.children;
          $.each(allChildren, function(key, obj) {
			  if (obj instanceof THREE.Mesh) {
                    scene.remove(obj);
                }
		  });
		  
		  var lines = $("#vectors").val().split('\n');
		  $.each(lines, function(key, line) {
				var parts = line.split('|');
				
				var sphereGeometry = new THREE.SphereGeometry(0.25,20,20);
				var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
				var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

				sphere.position.x=parts[0];
				sphere.position.y=parts[1];
				sphere.position.z=parts[2];
				scene.add(sphere);
				render();
		  });
	  });
	   
		var container;
		var camera, controls, scene, renderer;
		var cross;

		init();
		animate();

		function init() {
			scene = new THREE.Scene();

			var axes = new THREE.AxisHelper( 20 );
			scene.add(axes);
			
			camera = new THREE.PerspectiveCamera( 45, (window.innerWidth) / (window.innerHeight), 0.1, 1000 );
			camera.position.x = -30;
			camera.position.y = 40;
			camera.position.z = 30;
			camera.lookAt(scene.position);

			var ambientLight = new THREE.AmbientLight(0x0c0c0c);
			scene.add(ambientLight);

			var spotLight = new THREE.SpotLight( 0xffffff );
			spotLight.position.set( -40, 60, -10 );
			spotLight.castShadow = true;
			scene.add( spotLight );

			renderer = new THREE.WebGLRenderer( { antialias: false } );
			renderer.setClearColor(new THREE.Color(0xEEEEEE));
			renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );

			container = document.getElementById( 'output' );
			container.appendChild( renderer.domElement );

			controls = new THREE.OrbitControls( camera, renderer.domElement );

			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.panSpeed = 0.8;

			controls.noZoom = false;
			controls.noPan = false;

			controls.staticMoving = true;
			controls.dynamicDampingFactor = 0.3;

			controls.keys = [ 65, 83, 68 ];

			controls.addEventListener( 'change', render );
			
			window.addEventListener( 'resize', onWindowResize, false );
		}

		function onWindowResize() {
			camera.aspect = (window.innerWidth) / (window.innerHeight);
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );
			render();
		}

		function animate() {
			requestAnimationFrame( animate );
			controls.update();
		}

		function render() {
			renderer.render( scene, camera );
		}
    });
