import * as THREE from 'three'
import gsap from "gsap";
import AudioVisualizer from "./AudioVisualizer.js";

import vertex from '../shaders/vertexShader.glsl'
import fragment from '../shaders/fragmentShader.glsl'
import track from '../music/siri.mp3'

const SCALE_ON_HOVER = 1.1;
const messageElement = document.querySelector('.footer-message');

export default class App {
    constructor(options) {
        this.scene = new THREE.Scene();

        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x4A155B, 1);

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0, 0, 2);

        this.time = 0;
        this.isPlaying = true;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.addObjects();
        this.resize();
        this.render();
        this.setupEventListeners();
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {value: 0}
            },
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.geometry = new THREE.SphereGeometry(0.3, 100, 100);
        this.sphere = new THREE.Mesh(this.geometry, this.material);

        // audio visualizer
        this.audioVisualizer = new AudioVisualizer(this.sphere, 'uAudioFrequency');
        this.audioVisualizer.load(track)

        this.scene.add(this.sphere);
    }


    setupEventListeners() {
        this.setupResize();
        this.setUpMouseMovement();
        this.setupClick();
    }


    setUpMouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            this.intersects = this.raycaster.intersectObjects([this.sphere]);

            if (this.intersects.length > 0) {
                this.addCursor();
                if (!this.audioVisualizer.sound.isPlaying) {
                    gsap.to(this.sphere.scale, {
                        ease: "ease.out",
                        duration: 1,
                        x: SCALE_ON_HOVER,
                        y: SCALE_ON_HOVER,
                        z: SCALE_ON_HOVER
                    });
                }
            } else {
                this.removeCursor();
                gsap.to(this.sphere.scale, {
                    ease: "ease.out",
                    duration: 1,
                    x: 1,
                    y: 1,
                    z: 1
                });
            }

        });
    }


    setupClick() {
        window.addEventListener("click", (event) => {
            if (this.intersects.length > 0) {
                if (this.audioVisualizer.loaded) {
                    this.audioVisualizer.sound.isPlaying
                        ? this.audioVisualizer.sound.pause()
                        : this.audioVisualizer.sound.play();
                    this.changeMessage();
                }
            }
        });
    }


    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    addCursor() {
        document.body.classList.add("cursor-pointer")
    }

    removeCursor() {
        document.body.classList.remove("cursor-pointer")
    }

    changeMessage() {
        let message = `click on s!r! to ${this.audioVisualizer.sound.isPlaying ? 'stop' : 'play'}`
        messageElement.querySelector('p').innerText = message;
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.05;
        this.material.uniforms.uTime.value = this.time / 10
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.audioVisualizer.update()
    }

}

