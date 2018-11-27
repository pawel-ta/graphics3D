
class AsteroidGame{
	
	constructor(canvasId, counterId, textId) {

		this.renderCanvas = document.getElementById(canvasId);
		this.renderCounter = document.getElementById(counterId);
		this.renderText = document.getElementById(textId);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer( { canvas: this.renderCanvas } );
		this.renderer.setSize( this.renderCanvas.width*4, 3.8*this.renderCanvas.height );
		
		this.playerSpeed = 0.2;
		this.playerSpeedX = 0;
		this.playerSpeedY = 0;
		this.simplexPosition = 0;
		this.pace = 0.1;
		
		this.tick = 0;
		
		this.obstaclesArray = [];

		this.state = 0;
		this.score = 0;

	}

	movePlayer() {
			
		if(this.playerSpeedX > this.playerSpeed)
			this.playerSpeedX = this.playerSpeed;
		if(this.playerSpeedX < -this.playerSpeed)
			this.playerSpeedX = -this.playerSpeed;
		if(this.playerSpeedY > this.playerSpeed)
			this.playerSpeedY = this.playerSpeed;
		if(this.playerSpeedY < -this.playerSpeed)
			this.playerSpeedY = -this.playerSpeed;
		
		if(Math.abs(this.player.position.x + this.playerSpeedX) > 3.6)
			this.playerSpeedX = 0;
		if((this.player.position.y + this.playerSpeedY) < -1.4 || (this.player.position.y + this.playerSpeedY) > 0.7)
			this.playerSpeedY = 0;
		
		this.player.position.x += this.playerSpeedX;
		this.player.position.y += this.playerSpeedY;
		
	}
	
	collide() {	
		this.playerShip.vertices	
		for (var vertexIndex = 0; vertexIndex < this.playerShip.vertices.length; vertexIndex++)
		{       
			var localVertex = this.player.geometry.vertices[vertexIndex].clone();
			var globalVertex = this.player.matrix.multiplyVector3(localVertex);
			var directionVector = globalVertex.sub( this.player.position );
			var ray = new THREE.Raycaster( this.player.position, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( this.obstaclesArray );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			{
				this.state = 2;
			}
		}
	}
	
	addAsteroids() {
		if(Math.random()+this.pace > 0.5 && this.tick%10 == 0){		
			let asteroidMaterial = new THREE.MeshPhongMaterial( { color: 0xf4eb42, wireframe: true, vertexColors: THREE.NoColors } );
			let newAsteroid = new THREE.SphereGeometry( 0.25, 10, 10 );
			let asteroidMesh = new THREE.Mesh( newAsteroid, asteroidMaterial );
			asteroidMesh.position.z = -10;
			asteroidMesh.position.x = -3.6 + 7.2 * Math.random();
			asteroidMesh.position.y = -0.7 + 2.4 * Math.random();
			if(Math.random() > 0.6){
				asteroidMesh.position.x = this.player.position.x;
				asteroidMesh.position.y = this.player.position.y;
			}
			this.scene.add(asteroidMesh);
			this.obstaclesArray.push(asteroidMesh);
		}
	}
	
	increasePace() {
		if(this.tick%200 == 0)
			if(this.pace < 0.8)
				this.pace += 0.1;

	}
	
	moveAsteroids() {
		for (var i = 0; i < this.obstaclesArray.length; i++){
			this.obstaclesArray[i].position.z += this.pace;
			if(this.obstaclesArray[i].position.z > 3){
				this.scene.remove(this.obstaclesArray[i]);
				this.score++;
			}
		}
		this.obstaclesArray = this.obstaclesArray.filter(asteroid => asteroid.position.z <= 3);
	}
	
	emptyAsteroids() {
		for (var i = 0; i < this.obstaclesArray.length; i++){
			this.scene.remove(this.obstaclesArray[i]);
		}
		this.obstaclesArray = [];
	}
	
	gameSceneRender(){
	
		this.simplexPosition += this.pace;
	
		noise.seed(this.upperSeed);
		for(var k=0;k<100;k++) {
		  for(var l=0;l<100;l++) {
			var ex = 0.7;
			let j = l - this.simplexPosition;
			let i = k;
			this.upperPgeom.vertices[k+l*100].z = (noise.simplex2(i/100,j/100)+
			  (noise.simplex2((i+200)/50,j/50)*Math.pow(ex,1))+
			  (noise.simplex2((i+400)/25,j/25)*Math.pow(ex,2))+
			  (noise.simplex2((i+600)/12.5,j/12.5)*Math.pow(ex,3))+
			  (noise.simplex2((i+800)/6.25,j/6.25)*Math.pow(ex,4)))/2;
		  }
		}
		
		noise.seed(this.bottomSeed);
		for(var k=0;k<100;k++) {
		  for(var l=0;l<100;l++) {
			var ex = 0.7;
			let j = l - this.simplexPosition;
			let i = k;
			this.bottomPgeom.vertices[k+l*100].z = (noise.simplex2(i/100,j/100)+
			  (noise.simplex2((i+200)/50,j/50)*Math.pow(ex,1))+
			  (noise.simplex2((i+400)/25,j/25)*Math.pow(ex,2))+
			  (noise.simplex2((i+600)/12.5,j/12.5)*Math.pow(ex,3))+
			  (noise.simplex2((i+800)/6.25,j/6.25)*Math.pow(ex,4)))/2;
		  }
		}
		
		this.upperPgeom.computeVertexNormals();
		this.upperPgeom.computeFaceNormals();
		this.upperPgeom.verticesNeedUpdate = true;
		
		this.bottomPgeom.computeVertexNormals();
		this.bottomPgeom.computeFaceNormals();
		this.bottomPgeom.verticesNeedUpdate = true;
		
		this.skyController.azimuth += 0.002 * this.pace;
	    this.skyController.height = 0.498 + 0.002*Math.sin(-0.2*this.simplexPosition);
		
		this.updateSun();		
	}
	
	render() {
		
		if(this.state == 1){
			this.tick++;
			this.gameSceneRender();
			this.collide();
			this.movePlayer();
			this.addAsteroids();
			this.increasePace();
			this.moveAsteroids();
		}
		
		if(this.state == 0){
			this.stopBGM();
			this.renderer.clear(true, true, true);
			this.renderText.innerHTML = "CLICK TO START, WASD TO MOVE";
		}
		
		if(this.state == 2){
			this.stopBGM();
			this.renderer.clear(true, true, true);
			this.renderText.innerHTML = "YOU SCORED "+this.score+"! CLICK TO RETRY, WASD TO MOVE";
		}
		
		this.updateScore();
		
		if(this.state == 1){
			this.renderer.render( this.scene, this.camera);
			requestAnimationFrame( this.render.bind(this) );
		}

	}
	
	initLighting() {
		var light2 = new THREE.PointLight(0xffcc77, 1.0);
		this.scene.add(light2);
		light2.position.z = 3;
		light2.position.x = 4;
		light2.position.y = 2;
		this.scene.add(new THREE.AmbientLight(0x000055));	
	}
	
	initPlanes() {	
		let bottomPlaneMaterial = new THREE.MeshPhongMaterial( { color: 0xff5d00, wireframe: true, vertexColors: THREE.NoColors } );
		let upperPlaneMaterial = new THREE.MeshPhongMaterial( { color: 0xaadded, wireframe: true, vertexColors: THREE.NoColors } );
		
		this.upperPgeom = new THREE.PlaneGeometry(25,5,99,99);
		this.upperPgeom.dynamic = true;
		this.upperPlane = new THREE.Mesh( this.upperPgeom, upperPlaneMaterial );
		this.scene.add(this.upperPlane);
		this.upperPlane.rotation.x = -3.14/2.5;
		this.upperPlane.position.y=2;
		this.upperSeed = Math.random();
		
		this.bottomPgeom = new THREE.PlaneGeometry(25,5,99,99);
		this.bottomPgeom.dynamic = true;
		this.bottomPlane = new THREE.Mesh( this.bottomPgeom, bottomPlaneMaterial );
		this.scene.add(this.bottomPlane);
		this.bottomPlane.rotation.x = -3.14/2.5;
		this.bottomPlane.position.y=-2;
		this.bottomSeed = Math.random();
		
	}

	initPlayer() {
		let playerMaterial = new THREE.MeshPhongMaterial( { color: 0xe000ff, wireframe: true, vertexColors: THREE.NoColors } );
		this.playerShip = new THREE.ConeGeometry( 0.25, 1, 32 );
		this.player = new THREE.Mesh( this.playerShip, playerMaterial );
		this.player.rotation.x = -3.14/2;
		this.scene.add(this.player);	
	}
	
	updateScore() {
		this.renderCounter.innerHTML = this.score;		
	}
	
	updateSun() {	
		var distance = 10;
		var uniforms = this.sky.material.uniforms;
		uniforms.turbidity.value = this.skyController.turbidity;
		uniforms.rayleigh.value = this.skyController.rayleigh;
		uniforms.luminance.value = this.skyController.luminance;
		uniforms.mieCoefficient.value = this.skyController.mieCoefficient;
		uniforms.mieDirectionalG.value = this.skyController.mieDirectionalG;
		var theta = Math.PI * ( this.skyController.height - 0.5 );
		var phi = 2 * Math.PI * ( this.skyController.azimuth - 0.5 );
		this.sunSphere.position.x = distance * Math.cos( phi );
		this.sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
		this.sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
		this.sunSphere.visible = this.skyController.sun;
		uniforms.sunPosition.value.copy( this.sunSphere.position );	
	}
	
	initSky() {
		this.sky = new THREE.Sky();
		this.sky.scale.setScalar( 450000 );
		this.scene.add( this.sky );
		this.sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 20000, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0x7f00c9 } )
		);
		this.sunSphere.position.y = - 700000;
		this.sunSphere.visible = false;
		this.scene.add( this.sunSphere );

		this.skyController  = {
			turbidity: 10,
			rayleigh: 2,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.8,
			luminance: 1,
			height: 0.497, 
			azimuth: 0.15, 
			sun: false
		};	
	}
	
	onDocumentKeyDown(event) {	
		var keyCode = event.which;
		if (keyCode == 87) {
			this.playerSpeedY += this.playerSpeed;
		} else if (keyCode == 83) {
			this.playerSpeedY -= this.playerSpeed;
		} else if (keyCode == 65) {
			this.playerSpeedX -= this.playerSpeed;
		} else if (keyCode == 68) {
			this.playerSpeedX += this.playerSpeed;
		}	
	};
	
	onDocumentKeyUp(event) {		
		var keyCode = event.which;
		if (keyCode == 87) {
			if(this.playerSpeedY != 0)
				this.playerSpeedY -= this.playerSpeed;
		} else if (keyCode == 83) {
			if(this.playerSpeedY != 0)
				this.playerSpeedY += this.playerSpeed;
		} else if (keyCode == 65) {
			if(this.playerSpeedX != 0)
				this.playerSpeedX += this.playerSpeed;
		} else if (keyCode == 68) {
			if(this.playerSpeedX != 0)
				this.playerSpeedX -= this.playerSpeed;
		}	
	};
	
	onDocumentMouseDown(event) {	
		if(this.state != 1){
			this.renderText.innerHTML = "";
			this.startBGM();
			this.state = 1;
			this.simplexPosition = 0;
			this.pace = 0.1;
			this.score = 0;
			this.emptyAsteroids();
			this.render();
		}	
	}
	
	stopBGM() {
		this.audio.pause();
	}
	
	startBGM() {
		this.audio.load();
		this.audio.play();
	}
	
	initMusic() {
		this.audio = new Audio('http://www.asteroidgame.cba.pl/HD.mp3');
	}
	
	initAsteroid() {	
	
		this.initLighting();
		this.initPlanes();
		this.initPlayer();
		this.initSky();
		this.updateSun();
		this.initMusic();
		
		document.addEventListener("keydown", this.onDocumentKeyDown.bind(this), false);
		document.addEventListener("keyup", this.onDocumentKeyUp.bind(this), false);
		document.addEventListener("click", this.onDocumentMouseDown.bind(this), false);
		
		this.camera.position.z=3;

	}

}