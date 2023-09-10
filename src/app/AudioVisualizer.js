import * as THREE from "three";
import  gsap from "gsap"

const messageElement = document.querySelector('.footer-message');


export default class AudioVisualizer {
    constructor(mesh, frequencyUniformName) {

        this.mesh = mesh;
        this.frequencyUniformName = frequencyUniformName;
        this.mesh.material.uniforms[this.frequencyUniformName] = {value: 0}

        this.listener = new THREE.AudioListener();
        this.mesh.add(this.listener);

        this.sound = new THREE.Audio(this.listener)
        this.loader = new THREE.AudioLoader();
        this.analyser = new THREE.AudioAnalyser(this.sound, 32);

        this.loaded = false;

    }

    load(path) {
        this.loader.load(path, (buffer) => {
            this.sound.setBuffer(buffer)
            this.sound.setLoop(true)
            this.sound.setVolume(0.5)
            this.sound.hasPlaybackControl = true;
            this.loaded = true;
            this.showMessage();
        })
    }

    getFrequency() {
        return this.analyser.getAverageFrequency();
    }

    update() {
        const freq = Math.max(this.getFrequency() - 100, 0) / 50;
        const freqUniform = this.mesh.material.uniforms[this.frequencyUniformName];
        gsap.to(freqUniform, {
            duration: 1.5,
            ease: "Slow.easeOut",
            value: freq
        })
    }

    showMessage(){
        messageElement.classList.remove("hide");
    }
}