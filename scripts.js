const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

const sounds = ["11 swf.wav", '12 swf.wav', '13 swf.wav', '21 swf.wav', '22 swf.wav', '23 swf.wav', '31 swf.wav', '32 swf.wav', '33 swf.wav', '11 afr.wav', '12 afr.wav', '13 afr.wav', '21 afr.wav', '22 afr.wav', '23 afr.wav', '31 afr.wav', '32 afr.wav', '33 afr.wav', '11 solo synth.wav', '12 solo synth.wav', '13 solo synth.wav', '21 solo synth.wav', '22 solo synth.wav', '23 solo synth.wav', '31 solo synth.wav', '32 solo synth.wav', '33 solo synth.wav'];
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
  constructor(buffer, button, level = 0) {
    this.buffer = buffer;
    this.button = button;
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
    this.button.classList.add('active');
  }

  stop(time) {
    this.source.stop(time + fadeTime);
    this.gain.gain.setValueAtTime(this.amp, time);
    this.gain.gain.linearRampToValueAtTime(0, time + fadeTime);

    this.source = null;
    this.gain = null;

    activeLoops.delete(this);
    this.button.classList.remove('active');
    this.button.style.opacity = 0.25;
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
      this.button.style.opacity = opacity;
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
        const button = document.querySelector(`div.button[data-index="${i}"]`);
        loops[i] = new Loop(buffer, button, levels[i])
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

/********************************Interactions*******************************************/
function show(id) {
    if(document.getElementById) {
        var interactbutton = document.getElementById(id);
        interactbutton.style.display = (interactbutton.style.display=='block'?'none':'block');
    }
}

/*****************************Move Button*******************************************/
$(document.body).ready(function(){
    animateDiv();
    
});

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.a').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
    
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.1;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}
