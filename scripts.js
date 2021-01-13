/********************************Interactions*******************************************/   // sind unwichtig momentan
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
        document.getElementById("rollo").style.visibility='visible';
        rollo.style.display = (rollo.style.display=='block'?'none':'block');
    }
}



/*****************************stop*******************************************/




const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

const matrix1sounds = ["11 swf.wav", '12 swf.wav', '13 swf.wav', '21 swf.wav', '22 swf.wav', '23 swf.wav', '31 swf.wav', '32 swf.wav', '33 swf.wav'];
const matrix2sounds = ['11 afr.wav', '12 afr.wav', '13 afr.wav', '21 afr.wav', '22 afr.wav', '23 afr.wav', '31 afr.wav', '32 afr.wav', '33 afr.wav'];
const matrix3sounds = ['11 solo synth.wav', '12 solo synth.wav', '13 solo synth.wav', '21 solo synth.wav', '22 solo synth.wav', '23 solo synth.wav', '31 solo synth.wav', '32 solo synth.wav', '33 solo synth.wav'];
const matrixneusounds = ["11 pluck.wav", "12 pluck.wav", "13 pluck.wav", "21 pluck.wav", "22 pluck.wav", "23 pluck.wav", "31 pluck.wav", "32 pluck.wav", "33 pluck.wav"];
const matrixbass = ["bass low.wav", "bass high.wav"];
const matrixguitar = ["guitar mid.wav", "guitar left.wav", "guitar right.wav", "guitar solo.wav"];
const matrixdrumsounds = ["kick.wav", "snare.wav", "cymbals.wav"];
const übergangdrums = ["tranistion drums.wav"];
const übergangorc = ["tranistion orc.wav"];
const übergangvocal = ["tranistion voc.wav"];
const levels = [0, 0, -3, -10];
const loops1 = ["11 swf.wav", '12 swf.wav', '13 swf.wav', '21 swf.wav', '22 swf.wav', '23 swf.wav', '31 swf.wav', '32 swf.wav', '33 swf.wav'];
const loops2 = ['11 afr.wav', '12 afr.wav', '13 afr.wav', '21 afr.wav', '22 afr.wav', '23 afr.wav', '31 afr.wav', '32 afr.wav', '33 afr.wav'];
const loops3 = ['11 solo synth.wav', '12 solo synth.wav', '13 solo synth.wav', '21 solo synth.wav', '22 solo synth.wav', '23 solo synth.wav', '31 solo synth.wav', '32 solo synth.wav', '33 solo synth.wav'];
const loops4 = ["tranistion drums.wav"];
const loops5 = ["tranistion orc.wav"];
const loops6 = ["tranistion voc.wav"];
const loops7 = ["11 pluck.wav", "12 pluck.wav", "13 pluck.wav", "21 pluck.wav", "22 pluck.wav", "23 pluck.wav", "31 pluck.wav", "32 pluck.wav", "33 pluck.wav"];
const loops8 = ["bass low.wav", "bass high.wav"];
const loops9 = ["guitar mid.wav", "guitar left.wav", "guitar right.wav", "guitar solo.wav"];
const activeLoops = new Set();
let loopStartTime = 0;
const fadeTime = 0.050;

window.addEventListener('mousedown', onButton);
window.addEventListener('touchstart', onButton);

loadLoops();

/***************************************************************************/

class Matrix1{ 
constructor(buffer, button, level = 0) {

const matrix1sounds = ["11 swf.wav", '12 swf.wav', '13 swf.wav', '21 swf.wav', '22 swf.wav', '23 swf.wav', '31 swf.wav', '32 swf.wav', '33 swf.wav'];
   const loops1 = [];
   const activeLoops = new Set();
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
      this.button.trans.style.opacity = opacity;
    }
  }

  get isPlaying() {
    return (this.source !== null);
  }
  
  loadMatrix1() {
    const decodeContext = new AudioContext();
  
    // laden von audio buffer MATRIX 1 
    for (let i = 0; i < loops1.length; i++) {
      const request = new XMLHttpRequest();
      request.responseType = 'arraybuffer';
      request.open('GET', loops1[i]);                                                     
      decodeContext.decodeAudioData(request.response, (buffer) => {
      const button = document.querySelector(`div.button[name="matrix1sounds"][value="${i}"]`);               
                                                                                                                 
      loops1[i] = new Loop(buffer, button, levels[i])
                                                                                          
        });
      };
  
      request.send();
    }


    justplayone() {

        for (let i = 0; i < 8; i++){
        loops1[i]= i;
        if (loops1[i] > 0) {
            loops1[i].stop;
        
         if (loops1[i] <= 0){
            loops1[i].start;
        }
       

    }
}
} 
}

class Matrix2{ 
    constructor(buffer, button, level = 0) {
    
      const matrix2sounds = ['11 afr.wav', '12 afr.wav', '13 afr.wav', '21 afr.wav', '22 afr.wav', '23 afr.wav', '31 afr.wav', '32 afr.wav', '33 afr.wav'];
       const loops2 = [];
       const activeLoops = new Set();
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
          this.button.trans.style.opacity = opacity;
        }
      }
    
      get isPlaying() {
        return (this.source !== null);
      }
    
        
         loadMatrix2() {
      const decodeContext = new AudioContext();
    
      // laden von audio buffer MATRIX 2 
      for (let i = 0; i < matrix2sounds.length; i++) {
        const request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.open('GET', matrix2sounds[i]);                                                     
        decodeContext.decodeAudioData(request.response, (buffer) => {
        const button = document.querySelector(`div.button[name="matrix2sounds"value="${i}"]`);               
                                                                                                                   
        loops2[i] = new Loop(buffer, button, levels[i])
                                                                                            
          });
        };
    
        request.send();
      }

        justplayone() {
    
            for (let i = 0; i < 8; i++){
            loops2[i]= i;
            if (loops2[i] > 0) {
                loops2[i].stop(time);
            
             if (loops2[i] <= 0){
                loops2[i].start(time, syncLoopPhase);
            }
           
    
        }
    }
    } 
    }

    class Matrix3{ 
      constructor(buffer, button, level = 0) {
      
           const matrix3sounds = ['11 solo synth.wav', '12 solo synth.wav', '13 solo synth.wav', '21 solo synth.wav', '22 solo synth.wav', '23 solo synth.wav', '31 solo synth.wav', '32 solo synth.wav', '33 solo synth.wav'];
         const loops3 = [];
         const activeLoops = new Set();
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
            this.button.trans.style.opacity = opacity;
          }
        }
      
        get isPlaying() {
          return (this.source !== null);
        }
      
          
           loadMatrix3() {
        const decodeContext = new AudioContext();
      
        // laden von audio buffer MATRIX 3
        for (let i = 0; i < matrix3sounds.length; i++) {
          const request = new XMLHttpRequest();
          request.responseType = 'arraybuffer';
          request.open('GET', matrix3sounds[i]);                                                     
          decodeContext.decodeAudioData(request.response, (buffer) => {
          const button = document.querySelector(`div.button[name="matrix3sounds" value="${i}"]`);               
                                                                                                                     
          loops3[i] = new Loop(buffer, button, levels[i])
                                                                                              
            });
          };
      
          request.send();
        }
      
          justplayone() {
      
              for (let i = 0; i < 8; i++){
              loops3[i]= i;
              if (loops3[i] > 0) {
                  loops3[i].stop(time);
              
               if (loops3[i] <= 0){
                  loops3[i].start(time, syncLoopPhase);
              }
             
      
          }
      }
      }
      }

      class Uebergangdrums{ 
        constructor(buffer, button, level = 0) {
        
             const übergangdrums = ["tranistion drums.wav"];
           const loops5 = [];
           const activeLoops = new Set();
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
              this.button.trans.style.opacity = opacity;
            }
          }
        
          get isPlaying() {
            return (this.source !== null);
          }
        
            
             loadUebergangdrums() {
          const decodeContext = new AudioContext();
        
          // laden von audio buffer MATRIX ue1 
          for (let i = 0; i < übergangdrums.length; i++) {
            const request = new XMLHttpRequest();
            request.responseType = 'arraybuffer';
            request.open('GET', übergangdrums[i]);                                                     
            decodeContext.decodeAudioData(request.response, (buffer) => {
            const button = document.querySelector(`div.button[name="übergangdrums"value="${i}"]`);               
                                                                                                                       
            loops4[i] = new Loop(buffer, button, levels[i])
                                                                                                
              });
            };
        
            request.send();
          }
        
           
        }

        class UebergangOrc{ 
          constructor(buffer, button, level = 0) {
          
               const übergangorc = ["tranistion orc.wav"];
             const loops5 = [];
             const activeLoops = new Set();
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
                this.button.trans.style.opacity = opacity;
              }
            }
          
            get isPlaying() {
              return (this.source !== null);
            }
          
              
               loadUebergangorc() {
            const decodeContext = new AudioContext();
          
            // laden von audio buffer MATRIX ue1 
            for (let i = 0; i < übergangorc.length; i++) {
              const request = new XMLHttpRequest();
              request.responseType = 'arraybuffer';
              request.open('GET', übergangorc[i]);                                                     
              decodeContext.decodeAudioData(request.response, (buffer) => {
              const button = document.querySelector(`div.button[name="übergangorc"value="${i}"]`);               
                                                                                                                         
              loops5[i] = new Loop(buffer, button, levels[i])
                                                                                                  
                });
              };
          
              request.send();
            }
          
             
          }


          class Uebergangvocal{ 
            constructor(buffer, button, level = 0) {
            
                 const übergangvocal = ["tranistion voc.wav"];
               const loops6 = [];
               const activeLoops = new Set();
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
                  this.button.trans.style.opacity = opacity;
                }
              }
            
              get isPlaying() {
                return (this.source !== null);
              }
            
                
                 loadUebergangvocals() {
              const decodeContext = new AudioContext();
            
              // laden von audio buffer MATRIX ue3
              for (let i = 0; i < übergangvocal.length; i++) {
                const request = new XMLHttpRequest();
                request.responseType = 'arraybuffer';
                request.open('GET', übergangvocal[i]);                                                     
                decodeContext.decodeAudioData(request.response, (buffer) => {
                const button = document.querySelector(`div.button[name="übergangvocal"value="${i}"]`);               
                                                                                                                           
                loops6[i] = new Loop(buffer, button, levels[i])
                                                                                                    
                  });
                };
            
                request.send();
              }
            
               
            }
      
            class MatrixNeu{ 
                constructor(buffer, button, level = 0) {
                
                const matrixneusounds = ["11 pluck.wav", "12 pluck.wav", "13 pluck.wav", "21 pluck.wav", "22 pluck.wav", "23 pluck.wav", "31 pluck.wav", "32 pluck.wav", "33 pluck.wav"];
                   const loops7 = [];
                   const activeLoops = new Set();
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
                      this.button.trans.style.opacity = opacity;
                    }
                  }
                
                  get isPlaying() {
                    return (this.source !== null);
                  }
                
                    
                     loadMatrixNeu() {
                  const decodeContext = new AudioContext();
                
                  // laden von audio buffer MATRIX 1 
                  for (let i = 0; i < matrixneusounds.length; i++) {
                    const request = new XMLHttpRequest();
                    request.responseType = 'arraybuffer';
                    request.open('GET', matrixneusounds[i]);                                                     
                    decodeContext.decodeAudioData(request.response, (buffer) => {
                    const button = document.querySelector(`div.button[name="matrixneusounds"value="${i}"]`);               
                                                                                                                               
                    loops7[i] = new Loop(buffer, button, levels[i])
                                                                                                        
                      });
                    };
                
                    request.send();
                  }
                
                    justplayone() {
                
                        for (let i = 0; i < 8; i++){
                        loops1[i]= i;
                        if (loops7[i] > 0) {
                            loops7[i].stop;
                        
                         if (loops7[i] <= 0){
                            loops7[i].start;
                        }
                       
                
                    }
                }
                }
                }
                
                class MatrixBass{ 
                    constructor(buffer, button, level = 0) {
                    
                    const matrixbasssounds = ["bass low.wav", "bass high.wav"];
                       const loops8 = [];
                       const activeLoops = new Set();
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
                          this.button.trans.style.opacity = opacity;
                        }
                      }
                    
                      get isPlaying() {
                        return (this.source !== null);
                      }
                    
                        
                         loadMatrixBass() {
                      const decodeContext = new AudioContext();
                    
                      // laden von audio buffer MATRIX 1 
                      for (let i = 0; i < matrixbasssounds.length; i++) {
                        const request = new XMLHttpRequest();
                        request.responseType = 'arraybuffer';
                        request.open('GET', matrixbasssounds[i]);                                                     
                        decodeContext.decodeAudioData(request.response, (buffer) => {
                        const button = document.querySelector(`div.button[name="matrixbasssounds"value="${i}"]`);               
                                                                                                                                   
                        loops8[i] = new Loop(buffer, button, levels[i])
                                                                                                            
                          });
                        };
                    
                        request.send();
                      }
                    
                        justplayone() {
                    
                            for (let i = 0; i < 8; i++){
                            loops8[i]= i;
                            if (loops8[i] > 0) {
                                loops8[i].stop;
                            
                             if (loops8[i] <= 0){
                                loops8[i].start;
                            }
                           
                    
                        }
                    }
                    }
                }

                    class MatrixGuitar{ 
                        constructor(buffer, button, level = 0) {
                        
                        const matrixguitarsounds = ["guitar mid.wav", "guitar left.wav", "guitar right.wav", "guitar solo.wav"];
                           const loops9 = [];
                           const activeLoops = new Set();
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
                              this.button.trans.style.opacity = opacity;
                            }
                          }
                        
                          get isPlaying() {
                            return (this.source !== null);
                          }
                        
                            
                             loadMatrixGuitar() {
                          const decodeContext = new AudioContext();
                        
                          // laden von audio buffer MATRIX 1 
                          for (let i = 0; i < matrixguitarsounds.length; i++) {
                            const request = new XMLHttpRequest();
                            request.responseType = 'arraybuffer';
                            request.open('GET', matrixguitarsounds[i]);                                                     
                            decodeContext.decodeAudioData(request.response, (buffer) => {
                            const button = document.querySelector(`div.button[name="matrixguitarsounds"value="${i}"]`);               
                                                                                                                                       
                            loops9[i] = new Loop(buffer, button, levels[i])
                                                                                                                
                              });
                            };
                        
                            request.send();
                          }
                        }
                            
                        class MatrixDrums{ 
                            constructor(buffer, button, level = 0) {
                            
                            const matrixdrumsounds = ["guitar mid.wav", "guitar left.wav", "guitar right.wav", "guitar solo.wav"];
                               const loops10 = [];
                               const activeLoops = new Set();
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
                                  this.button.trans.style.opacity = opacity;
                                }
                              }
                            
                              get isPlaying() {
                                return (this.source !== null);
                              }
                            
                                
                                 loadMatrixDrums() {
                              const decodeContext = new AudioContext();
                            
                              // laden von audio buffer MATRIX 1 
                              for (let i = 0; i < matrixdrumsounds.length; i++) {
                                const request = new XMLHttpRequest();
                                request.responseType = 'arraybuffer';
                                request.open('GET', matrixdrumsounds[i]);                                                     
                                decodeContext.decodeAudioData(request.response, (buffer) => {
                                const button = document.querySelector(`div.button[name="matrixdrumsounds"value="${i}"]`);               
                                                                                                                                           
                                loops10[i] = new Loop(buffer, button, levels[i])
                                                                                                                    
                                  });
                                };
                            
                                request.send();
                              }
                            }
                      
 //hier gleiches für neue Matrizen



    
   




//// global : button erzeugen und stopfunktionen



function uebergang(){

if(loops4 == 0){
  matrix1sounds[i].stop(time);
  if(loops4 < 0){
    matrix1sounds[i].start(time, syncLoopPhase);

  }
}
if(loops5 == 0){
  matrix2sounds[i].stop(time);
  if(loops5 < 0){
    matrix2sounds[i].start(time, syncLoopPhase);
  }
}
  if(loops6 == 0){
    matrix3sounds[i].stop(time);
    if(loops6 < 0){
      matrix3sounds[i].start(time, syncLoopPhase);
  
    }
  }

}

function bassnicht2mal(){
if(loops8 == 0){
    übergangorc[i].stop(time);
    if(loops8 < 0){
      übergangorc[i].start(time, syncLoopPhase);
    }
  }

}
  
function onButton(evt) {
  const target = evt.target;
  const index = target.dataset.index;
  const loop = loops1[index]; loops2[index]; loops3[index]; loops4[index]; loops5[index]; loops6[index]; loops7[index]; loops8[index]; loops9[index];
 

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
