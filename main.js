$(function () {
        function removeAll() {
                for (i = scene.children.length -1; i >= 0; i --) {
                        obj = scene.children[i];
		        if (obj instanceof THREE.Sprite) {
                                scene.remove(obj);
                        }
		}
        }

        $( "#addVectors" ).click(function() {
		removeAll();
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
		});
                render();
        });

        $("#addRandomVectors").click(function() {
                removeAll();
                var nr = $("#randomVectorsCount").val();
                var PI2 = Math.PI * 2;
                var material = new THREE.SpriteCanvasMaterial( {
                        color: 0x7777ff,
                        program: function ( context ) {
                                context.lineWidth = 0.025;
                                context.beginPath();
                                context.arc( 0, 0, 0.25, 0, PI2, true );
                                context.fill();
                        }
                });
                for(var i=0; i < nr; i++) {
                        var px = Math.random() *40 - 20;
			var py = Math.random() *40 -20;
			var pz = Math.random() *40 -20;
                        particle = new THREE.Sprite(material);
                        particle.position.x = px;
                        particle.position.y = py;
                        particle.position.z = pz;
                        scene.add(particle);
                }
                render();
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

		renderer = new THREE.CanvasRenderer();
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
