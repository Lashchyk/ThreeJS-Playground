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
                particles = Array();
                for(var i=0; i < nr; i++) {
                        var material = new THREE.SpriteCanvasMaterial( {
                                color: 0x7777ff,
                                program: function ( context ) {
                                        context.lineWidth = 0.025;
                                        context.beginPath();
                                        context.arc( 0, 0, 0.25, 0, PI2, true );
                                        context.fill();
                                }
                        });
                        var px = Math.random() *40 - 20;
			var py = Math.random() *40 -20;
			var pz = Math.random() *40 -20;
                        particle = new THREE.Sprite(material);
                        particle.position.x = px;
                        particle.position.y = py;
                        particle.position.z = pz;
                        scene.add(particle);
                        particles.push([px,py,pz]);
                }
                render();
        });
        $("#find").click(function() {
                var vec = Array()
                if (sphere) {
                        scene.remove(sphere);
                }
                if (found) {
                        scene.remove(found);
                }
                if (point) {
                        point.material.color.setRGB(119, 119, 255);
                }

		var components = $("#findNearestTo").val().split('|');
		$.each(components, function(key, cmp) {
                        vec.push(parseFloat(cmp));
                });
                var p = {
                        vectors: particles,
                        findNearestTo: vec
                }
                $.post("/kdtree/ajax", JSON.stringify(p))
                        .done(function( data ) {
                                for (i = 0; i < scene.children.length; i++) {
                                        if (scene.children[i] instanceof THREE.Sprite) {
                                                point = scene.children[i];
                                                if (point.position.x == data[0] && point.position.y == data[1] && point.position.z == data[2]) {
                                                        point.material.color.setRGB(255,0,0);
                                                        meshMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true });
                                                        var d = Math.sqrt(Math.pow(data[0] - vec[0], 2) + Math.pow(data[1] - vec[1], 2) + Math.pow(data[2] - vec[2], 2));
                                                        sphere = new THREE.Mesh( new THREE.SphereGeometry( d ), meshMaterial );
                                                        sphere.position.set( vec[0], vec[1], vec[2] );
                                                        scene.add( sphere );
                                                        meshMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
                                                        found = new THREE.Mesh( new THREE.SphereGeometry( 0.25 ), meshMaterial );
                                                        found.position.set( vec[0], vec[1], vec[2] );
                                                        scene.add(found);
                                                        break;
                                                }
                                        }
                                }
                                render();
                        });
        });
	   
	var container;
	var camera, controls, scene, renderer;
        var particles = Array()
        var sphere, point, found;

	init();
	animate();

	function init() {
                scene = new THREE.Scene();

		var axes = new THREE.AxisHelper( 20 );
		scene.add(axes);
		
                for( i = -2; i < 3; i++) {
                        var helperXY = new THREE.GridHelper( 20, 10 );
                        helperXY.rotation = new THREE.Euler( Math.PI/2, 0, 0 );
                        helperXY.setColors( 0xCCCCCC, 0xCCCCCC );
                        helperXY.position.z = i*10;
                        scene.add( helperXY );
                        var helperXZ = new THREE.GridHelper( 20, 10 );
                        helperXZ.setColors( 0xCCCCCC, 0xCCCCCC );
                        helperXZ.position.y = i*10;
                        scene.add( helperXZ );
                }
                camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.x = -30;
		camera.position.y = 40;
		camera.position.z = 30;
		camera.lookAt(scene.position);

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(new THREE.Color(0xEEEEEE));
		renderer.setSize( window.innerWidth/1.5, window.innerHeight );

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
	        camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth/1.5, window.innerHeight );
		render();
	}

	function animate() {
	        requestAnimationFrame( animate );
		controls.update();
	}

	function render() {
                camera.updateMatrixWorld();
	        renderer.render( scene, camera );
	}
});
