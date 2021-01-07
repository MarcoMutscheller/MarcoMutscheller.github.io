/********************************Interactions*******************************************/
function show(id) {
    if(document.getElementById) {
        var next1 = document.getElementById(id);
        next1.style.display = (next1.style.display=='block'?'none':'block');
    }
}function show(id) {
    if(document.getElementById) {
        var interactbutton = document.getElementById(id);
        interactbutton.style.display = (interactbutton.style.display=='block'?'none':'block');
    }
}
function show(id) {
    if(document.getElementById) {
        var rollo = document.getElementById(id);
        rollo.style.display = (rollo.style.display=='block'?'none':'block');
    }
}




/*****************************stop*******************************************/




const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

const sounds = ["11 swf.wav", '12 swf.wav', '13 swf.wav', '21 swf.wav', '22 swf.wav', '23 swf.wav', '31 swf.wav', '32 swf.wav', '33 swf.wav', '11 afr.wav', '12 afr.wav', '13 afr.wav', '21 afr.wav', '22 afr.wav', '23 afr.wav', '31 afr.wav', '32 afr.wav', '33 afr.wav', '11 solo synth.wav', '12 solo synth.wav', '13 solo synth.wav', '21 solo synth.wav', '22 solo synth.wav', '23 solo synth.wav', '31 solo synth.wav', '32 solo synth.wav', '33 solo synth.wav', "tranistion orc.wav", "tranistion drums.wav", "tranistion voc.wav"];
const levels = [0, 0, -3, -10];
const loops = [];
const activeLoops = new Set();
let loopStartTime = 0;
const fadeTime = 0.050;

window.addEventListener('mousedown', onButton);
window.addEventListener('touchstart', onButton);

loadLoops();

/***************************************************************************/

class Loop {
                                                            constructor(buffer, button, trans, level = 0) {
    this.buffer = buffer;
    this.button = button;
    this.trans = trans;
    this.amp = decibelToLinear(level);
    this.gain = null;
    this.source = null;
    this.analyser = null;
  
} 
 
    
  start(time, sync = true) {
    const buffer = this.buffer;
    let analyser = this.analyser;
    let offset = 0;

    if (analyser === null) {
      analyser = audioContext.createAnalyser();
      this.analyser = analyser;
      this.analyserArray = new Float32Array(analyser.fftSize);
    }

    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.connect(analyser);

    if (sync) {
      // fade in only when starting somewhere in the middle
      gain.gain.value = 0;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(this.amp, time + fadeTime);

      // set offset to loop time
      offset = (time - loopStartTime) % buffer.duration;
    }

    const source = audioContext.createBufferSource();
    source.connect(gain);
    source.buffer = buffer;
    source.loop = true;
    source.start(time, offset);

    this.source = source;
    this.gain = gain;

    activeLoops.add(this);
                                                                        this.button.trans.classList.add('active');
  }

  stop(time) {
    this.source.stop(time + fadeTime);
    this.gain.gain.setValueAtTime(this.amp, time);
    this.gain.gain.linearRampToValueAtTime(0, time + fadeTime);

    this.source = null;
    this.gain = null;

    activeLoops.delete(this);
                                                                        this.button.trans.classList.remove('active');
                                                                        this.button.trans.style.opacity = 0.25;
  }
    
                                                                        übergang() {
   
                                                                               if (sounds[27] != null){
                                                                                  
                                                                                 activeLoops.delete(sounds[0,1,2,3,4,5,6,7,8]);
                                                                               }
                                                                            
                                                                                if (sounds[28] != null){
                                                                                  
                                                                                 activeLoops.delete(sounds[9,10,11,12,13,14,15,16,17]);
                                                                               }
                                                                            
                                                                                if (sounds[29] != null){
                                                                                  
                                                                                 activeLoops.delete(sounds[18,19,20,21,22,23,24,25,26]);
                                                                               }
                                                                         }

  displayIntensity() {
    const analyser = this.analyser;

    if (analyser.getFloatTimeDomainData) {
      const array = this.analyserArray;
      const fftSize = analyser.fftSize;

      analyser.getFloatTimeDomainData(array);

      let sum = 0;
      for (let i = 0; i < fftSize; i++) {
        const value = array[i];
        sum += (value * value);
      }

      const opacity = Math.min(1, 0.25 + 10 * Math.sqrt(sum / fftSize));
      this.button.trans.style.opacity = opacity;
    }
  }

  get isPlaying() {
    return (this.source !== null);
  }
}

function loadLoops() {
  const decodeContext = new AudioContext();

  // load audio buffers
  for (let i = 0; i < sounds.length; i++) {
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.open('GET', sounds[i]);
    request.addEventListener('load', () => {
      decodeContext.decodeAudioData(request.response, (buffer) => {
                                                                        const button = document.querySelector(`div.button.trans[data-index="${i}"]`);
                                                                                        
                                                                                        loops[i] = new Loop(buffer, button, trans, levels[i])
      });
    });

    request.send();
  }
}

function onButton(evt) {
  const target = evt.target;
  const index = target.dataset.index;
  const loop = loops[index];

  if (audioContext === null)
    audioContext = new AudioContext();

  if (loop) {
    const time = audioContext.currentTime;
    let syncLoopPhase = true;

    if (activeLoops.size === 0) {
      loopStartTime = time;
      syncLoopPhase = false;
      window.requestAnimationFrame(displayIntensity);
    }

    if (!loop.isPlaying) {
      loop.start(time, syncLoopPhase);
    } else {
      loop.stop(time);
    }
  }
}

function displayIntensity() {
  for (let loop of activeLoops)
    loop.displayIntensity();

  if (activeLoops.size > 0)
    window.requestAnimationFrame(displayIntensity);
}

function decibelToLinear(val) {
  return Math.exp(0.11512925464970229 * val); // pow(10, val / 20)
}



