$(function() {
    var container;
    var state = 'not_stared';
    var camera, scene, renderer, listener, speed;
    var uno, dos, tres;
    var start_race_three, now;
    var lightmesh, pointlight, otherpointlight, ambientlight, directlight;
    var material, texture;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    function init() {
        // bind elements
        $('#start').click(start_semaphore);
        $('#pause').click(pause_clock);

        container = document.getElementById('container');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 500;
        listener = new THREE.AudioListener();
        camera.add(listener);

        scene.add(camera);

        // setting default speed
        speed = -0.0003;

        // lights
        pointlight = new THREE.PointLight(0xFFFFFF, 1.);
        otherpointlight = new THREE.PointLight(0xFFFFFF, 0.4);
        ambientlight = new THREE.AmbientLight(0x222222);

        pointlight.position.set(200, 200, 30);
        otherpointlight.position.set(-100, -100, 0);

        scene.add(pointlight);
        scene.add(otherpointlight);
        scene.add(ambientlight);

        // esferas para semaforo
        sphere = new THREE.SphereGeometry(60, 32, 32);
        material = new THREE.MeshPhongMaterial({
            color: 0x1fff58,
            specular: 0x111111,
            emissive: 0x0,
            reflectivity: 1.,
            shininess: 100
        })
        uno = addMesh(sphere, 1, 200, -30, 0, 0, 0, 0, material);
        dos = addMesh(sphere, 1, 0, -30, 0, 0, 0, 0, material);
        tres = addMesh(sphere, 1, -200, -30, 0, 0, 0, 0, material);

        // render
        renderer = new THREE.WebGLRenderer({ clearColor: 0x040404, clearAlpha: 1, antialias: true });
        renderer.setClearColor(0xff0000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        //renderer.physicallyBasedShading = true;

        window.addEventListener('resize', onWindowResize, false);

        start_race = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load('static/sound/startmk64.ogg', function(buffer) {
            start_race.setBuffer(buffer);
            start_race.setLoop(false);
            start_race.setVolume(1.);
        });

        now = new THREE.Audio(listener);
        audioLoader.load('static/sound/light_1.wav', function(buffer) {
            now.setBuffer(buffer);
            now.setLoop(false);
            now.setVolume(1.);
        });
    }

    function addMesh(geometry, scale, x, y, z, rx, ry, rz, material) {

        var mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.visible = false;
        scene.add(mesh);

        return mesh
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var timer = speed * Date.now();

        pointlight.position.x = 1000 * Math.cos(timer);
        pointlight.position.z = 1000 * Math.sin(timer);
        otherpointlight.position.y = 1000 * Math.cos(timer);
        otherpointlight.position.z = 1000 * Math.cos(timer);

        renderer.render(scene, camera);

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function pause_clock() {
        var elem = document.getElementById("pause");
        if (elem.value == "Pause!") {
            clock.stop();
            elem.value = "Continue!"
        } else {
            elem.value = "Pause!"
            clock.start();
        }
    }

    function create_clock() {
        /* Remove ThreeJS */

        clock = new FlipClock($('.clock'), 180, {
            clockFace: 'MinuteCounter',
            autoStart: true,
            countdown: true
        });
    }

    function start_semaphore() {
        // aparecen una a una con 1 seg de delay
        if (state === 'stared') {
            window.location.reload();
        }
        state = 'stared';
        $(this).val("Reset!")

        countdown(uno, true, 1000)
            .then(countdown_music.bind(null, start_race))
            .then(countdown.bind(null, dos, true, 1000))
            .then(countdown.bind(null, tres, true, 1000))
            .then(countdown.bind(null, tres, false, 1000))
            .then(countdown.bind(null, dos, false, 0))
            .then(countdown.bind(null, uno, false, 0))
            .then(countdown.bind(null, uno, true, 5000))
            .then(countdown_music.bind(null, now))
            .then(countdown.bind(null, dos, true, 0))
            .then(countdown.bind(null, tres, true, 0))
            .then(countdown.bind(null, tres, false, 1000))
            .then(countdown.bind(null, dos, false, 0))
            .then(countdown.bind(null, uno, false, 0))
            .then(create_clock);
    }

    function countdown_music(song) {
        var promise = new Promise(function(resolve, reject) {
            song.play();
            resolve({ data: '123' });
        });
        return promise;
    }

    function countdown(my_mesh, state, time) {
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                my_mesh.visible = state;
                resolve({ data: '123' });
            }, time);
        });
        return promise;
    }

    function start_clock() {
        clock.start()
    }

    init();
    animate();
});
