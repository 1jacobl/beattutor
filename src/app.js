
/* ================= utils ================= */
const store={get(k,d){try{const v=localStorage.getItem('ktb:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('ktb:'+k,JSON.stringify(v))}catch(e){}}};
const $=s=>document.querySelector(s),$$=(s,r=document)=>r?[...r.querySelectorAll(s)]:[];
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1700)};

/* ================= keyboards =================
   Specs checked against maker pages and reviews (Nov 2026). hw = how the drawing is laid out. */
const MPK4_KEYS=['1/4','1/4T','1/8','1/8T','1/16','1/16T','1/32','1/32T','Up','Down','Excl','Incl','Order','Rand','Chord','Oct 1','Oct 2','Oct 3','Oct 4','Swing','Pattern','Edit','Mutate','Freeze','Sync'];
const KEYBOARDS={
  mpk4:{name:'Akai MPK Mini IV',short:'MPK Mini IV',
    summary:'25 velocity-sensitive mini keys, 8 RGB pads in two banks, 8 endless knobs, separate pitch and mod wheels, a colour screen with a push encoder, transport buttons, a sustain jack and 5-pin MIDI out.',
    pitch:'the <b>pitch wheel</b> and <b>mod wheel</b> on the left',oct:'<b>Oct −</b> / <b>Oct +</b> under the wheels',
    padNote:'Load FPC and hit the pads: in Bank A they trigger FPC\'s first eight pads. If a pad is silent, press <b>Bank A/B</b> to switch back.',
    sustain:'There is a 1/4" sustain pedal jack on the back.',
    repeat:'Hold <b>Note Repeat</b> and a pad to roll it. The rate comes from the time division printed above the first eight keys (1/4 to 1/32T): hold <b>Shift</b> and press one of those keys. With the DAW port set up (below), the rolls follow FL\'s tempo.',
    arp:'Press <b>Arp</b>, then hold <b>Shift</b> and press the keys labelled Up, Down, Excl, Incl, Order, Rand or Chord to pick the pattern, and Oct 1–4 for its range. <b>Latch</b> keeps it running after you let go.',
    hw:{model:'mpk4',trim:true,pitch:'wheels',pads:8,padCols:4,glow:['#ffd23f','#ff8a1f','#ff3b30','#ff4fd8','#b05bff','#3b5bff','#22d3ee','#3ee06a'],
      padLabels:['1','2','3','4','5','6','7','8'],padShift:['','Prog chng','CC#','Notes','Chords','Chords config','Scales','Scales config'],
      left:[['Oct −','Prog edit','down'],['Oct +','Save','up']],
      under:[['Arp','Config','arp'],['Latch','Full level','latch'],['Note repeat','Config','nr'],['Tap tempo','Metronome','tap'],['Bank A/B','','bank']],
      screen:{hd:'01 - Drums 1',l1:'Volume',l2:'-3.6 dB'},encoder:true,centre:[['−','',''],['+','',''],['Shift','','shift'],['Plugin/DAW','User presets','daw']],
      knobs:['Division','Swing','Mode','Oct','Latch','Sync','Gate','BPM'],knobsShift:true,
      transport:[['Undo','Redo','undo'],['Loop','Global','loop'],['■ / ▶','Continue','play'],['●','Quantize','rec'],['Auto','Automation','auto']],
      keys:25,keyLabels:MPK4_KEYS}},
  mpk3:{name:'Akai MPK Mini MK3',short:'MPK Mini MK3',
    summary:'25 mini keys, 8 pads in two banks, 8 endless knobs, a 4-way joystick for pitch and mod, an OLED screen, Arp, Note Repeat and Full Level.',
    pitch:'the 4-way <b>joystick</b> (left/right bends pitch, up is modulation)',oct:'<b>Oct −</b> / <b>Oct +</b>',
    padNote:'Bank A pads send notes 36–43, the range FPC listens to.',sustain:'There is a sustain pedal jack.',
    repeat:'Hold <b>Note Repeat</b> and a pad. The arp\'s time division (1/4 to 1/32T) sets the roll speed.',
    arp:'Press <b>Arp</b>; hold <b>Arp</b> and press the labelled keys to pick the mode, division and octave range.',
    hw:{model:'mpk3',pitch:'joystick',pads:8,padCols:4,glow:Array(8).fill('#ff3b30'),padLabels:['1','2','3','4','5','6','7','8'],
      left:[['Arp','','arp'],['Tap tempo','','tap'],['Oct −','','down'],['Oct +','','up']],
      under:[['Full level','','full'],['Note repeat','','nr'],['Bank A/B','','bank'],['CC','',''],['Prog change','','']],
      screen:{hd:'MPK mini',l1:'Prog 1',l2:''},oled:true,knobs:['K1','K2','K3','K4','K5','K6','K7','K8'],keys:25}},
  launchkey:{name:'Novation Launchkey Mini (MK3 / MK4)',short:'Launchkey Mini',
    summary:'25 mini keys, 16 pads, 8 knobs (endless encoders and an OLED screen on the MK4), pitch and mod touch strips, Arp, scale and chord modes, transport buttons on the MK4.',
    pitch:'the <b>pitch and mod touch strips</b> on the left',oct:'the <b>Octave</b> up/down buttons',
    padNote:'Switch the pads to Drum mode: they send notes from 36 up, the range FPC listens to.',sustain:'There is a sustain input.',
    repeat:'There is no Note Repeat button: hold one note with the Arp at a fast rate, or draw rolls in the piano roll.',
    arp:'Press <b>Arp</b>; hold <b>Shift</b> to change its rate and pattern.',
    hw:{model:'launchkey',pitch:'strips',pads:16,padCols:8,glow:['#22d3ee','#3ee06a','#ffd23f','#ff8a1f','#ff3b30','#ff4fd8','#b05bff','#3b5bff','#3b5bff','#b05bff','#ff4fd8','#ff3b30','#ff8a1f','#ffd23f','#3ee06a','#22d3ee'],
      left:[['Shift','','shift'],['Oct −','','down'],['Oct +','','up']],under:[['Arp','','arp'],['Scale','',''],['Chord','',''],['▶','','play'],['●','','rec']],
      screen:{hd:'Launchkey',l1:'Drum',l2:''},oled:true,knobs:['1','2','3','4','5','6','7','8'],knobRow:true,keys:25}},
  minilab:{name:'Arturia MiniLab 3',short:'MiniLab 3',
    summary:'25 slim keys, 8 pads in two banks, 8 encoders, 4 faders, pitch and mod touch strips, a main encoder with a small screen, Arp, chord and scale modes.',
    pitch:'the <b>pitch and mod touch strips</b>',oct:'<b>Oct −</b> / <b>Oct +</b>',
    padNote:'Pads send notes from 36 up in the DAW preset, so they play FPC.',sustain:'There is a sustain input.',
    repeat:'Use the Arp on one held pad, or draw rolls in the piano roll.',arp:'Press <b>Arp</b> (or Shift + Hold, depending on firmware) and set its rate with the main encoder.',
    hw:{model:'minilab',pitch:'strips',pads:8,padCols:8,glow:Array(8).fill('#3b82f6'),left:[['Shift','','shift'],['Hold','',''],['Oct −','','down'],['Oct +','','up']],under:[],
      screen:{hd:'MiniLab 3',l1:'Prog 1',l2:''},oled:true,encoder:true,knobs:['1','2','3','4','5','6','7','8'],faders:4,keys:25}},
  big:{name:'Full-size keyboard (49 / 61 / 88)',short:'Full-size keys',
    summary:'More octaves, pitch and mod wheels, and on many models pads, knobs and faders.',
    pitch:'the <b>pitch and mod wheels</b>',oct:'the octave buttons (you rarely need them)',
    padNote:'No pads? Play FPC from the low keys (MIDI 36 and up).',sustain:'Use a sustain pedal.',repeat:'Draw rolls in the piano roll.',arp:'Use FL\'s arpeggiator (channel settings) if the keyboard has none.',
    hw:{model:'big',pitch:'wheels',pads:0,left:[['Oct −','','down'],['Oct +','','up']],under:[],knobs:[],keys:49}},
  other:{name:'Another MIDI keyboard',short:'My keyboard',
    summary:'Any class-compliant USB MIDI keyboard works with FL Studio.',
    pitch:'the pitch / mod controls',oct:'the octave buttons',
    padNote:'If pads do not trigger FPC, set them to send notes 36–51 in your keyboard\'s editor.',sustain:'Sustain pedal optional.',repeat:'Draw rolls in the piano roll.',arp:'Use your keyboard\'s arp, or FL\'s.',
    hw:{model:'other',pitch:'wheels',pads:8,padCols:4,glow:Array(8).fill('#ff9a3c'),left:[['Oct −','','down'],['Oct +','','up']],under:[],knobs:['1','2','3','4','5','6','7','8'],keys:25}},
  none:{name:'No MIDI keyboard',short:'No keyboard',summary:'FL\'s typing keyboard, the step sequencer and the mouse.',pitch:'drawn pitch automation or slide notes',oct:'the typing-keyboard octave',padNote:'',sustain:'',repeat:'Draw rolls in the piano roll with Chop or a fine grid.',arp:'Use Tools → Arpeggiate in the piano roll.',hw:{model:'none'}}
};

/* ================= plugins ================= */
const ED=['fruity','producer','signature','all'];
const EDNAME={fruity:'Fruity',producer:'Producer',signature:'Signature',all:'All Plugins'};
const PLUGINS=[
 {id:'flex',n:'FLEX',src:'stock',ed:'fruity',t:'Synth / rompler',u:'Preset instrument. Fastest way to get pianos, pads, plucks, bells. Download free packs from its browser.'},
 {id:'fpc',n:'FPC',src:'stock',ed:'fruity',t:'Drum pads',u:'Drag your drum samples onto 16 pads. Built for MIDI pads.'},
 {id:'sampler',n:'Sampler (Channel)',src:'stock',ed:'fruity',t:'Sampler',u:'Every one-shot you drag into the Channel Rack. Use it for 808s with Mono + Porta for glide.'},
 {id:'3xosc',n:'3x Osc',src:'stock',ed:'fruity',t:'Synth',u:'Simple 3-oscillator synth for basic leads and sub bass.'},
 {id:'flkeys',n:'FL Keys',src:'stock',ed:'fruity',t:'Piano',u:'Basic piano for sketching chords.'},
 {id:'boobass',n:'BooBass',src:'stock',ed:'fruity',t:'Bass',u:'Simple bass for R&B lines.'},
 {id:'kick',n:'Fruity Kick',src:'stock',ed:'fruity',t:'Drum synth',u:'Synthesised kick/808 if you have no samples.'},
 {id:'slicer',n:'Fruity Slicer',src:'stock',ed:'fruity',t:'Sampler',u:'Chops loops/vocals into slices you can play on pads.'},
 {id:'peq2',n:'Fruity Parametric EQ 2',src:'stock',ed:'fruity',t:'EQ',u:'Your main EQ. Cut lows off everything except kick and 808.'},
 {id:'limiter',n:'Fruity Limiter',src:'stock',ed:'fruity',t:'Limiter / comp',u:'Master limiter, plus sidechain in COMP mode.'},
 {id:'comp',n:'Fruity Compressor',src:'stock',ed:'fruity',t:'Compressor',u:'Simple compressor for drums and bus glue.'},
 {id:'reeverb',n:'Fruity Reeverb 2',src:'stock',ed:'fruity',t:'Reverb',u:'Reverb on a send for space.'},
 {id:'delay3',n:'Fruity Delay 3',src:'stock',ed:'fruity',t:'Delay',u:'Tempo-synced echoes on leads and chops.'},
 {id:'fastdist',n:'Fruity Fast Dist',src:'stock',ed:'fruity',t:'Distortion',u:'Quick grit on 808s and rage leads.'},
 {id:'blood',n:'Fruity Blood Overdrive',src:'stock',ed:'fruity',t:'Distortion',u:'Warmer overdrive for 808s.'},
 {id:'soundgood',n:'Soundgoodizer',src:'stock',ed:'fruity',t:'Multiband comp',u:'One-knob loudness/brightness. Use lightly.'},
 {id:'stereo',n:'Fruity Stereo Shaper',src:'stock',ed:'fruity',t:'Stereo',u:'Widen chords and pads.'},
 {id:'loveph',n:'Fruity Love Philter',src:'stock',ed:'fruity',t:'Filter / gate',u:'Filter sweeps and gate chops.'},
 {id:'patcher',n:'Patcher',src:'stock',ed:'fruity',t:'Utility',u:'Save effect chains as one preset.'},
 {id:'wavecandy',n:'Wave Candy',src:'stock',ed:'fruity',t:'Meter',u:'Spectrum and loudness view on the master.'},
 {id:'edison',n:'Edison',src:'stock',ed:'producer',t:'Audio editor',u:'Record, trim, reverse and clean audio.'},
 {id:'slicex',n:'Slicex',src:'stock',ed:'producer',t:'Sampler',u:'Better chopping than Fruity Slicer.'},
 {id:'sytrus',n:'Sytrus',src:'stock',ed:'producer',t:'Synth',u:'Deep FM synth with many bell and pluck presets.'},
 {id:'harmless',n:'Harmless',src:'stock',ed:'signature',t:'Synth',u:'Easy to tweak. Good pads and plucks.'},
 {id:'transistor',n:'Transistor Bass',src:'stock',ed:'all',t:'Bass synth',u:'Acid-style bass with slides.'},
 {id:'maximus',n:'Maximus',src:'stock',ed:'producer',t:'Multiband comp',u:'Master loudness and low-end control.'},
 {id:'vchorus',n:'Vintage Chorus',src:'stock',ed:'signature',t:'Chorus',u:'Thickens keys and R&B guitars.'},
 {id:'pitcher',n:'Pitcher',src:'stock',ed:'signature',t:'Pitch correction',u:'Auto-tune style tuning for vocals or chops.'},
 {id:'grossbeat',n:'Gross Beat',src:'stock',ed:'signature',t:'Time / volume FX',u:'Half-time, tape stops, stutters. Huge in rage and trap.'},
 {id:'newtone',n:'NewTone',src:'stock',ed:'signature',t:'Pitch editor',u:'Note editing on audio.'},
 {id:'harmor',n:'Harmor',src:'stock',ed:'all',t:'Synth',u:'Additive / resynthesis synth. Huge leads and pads.'},
 {id:'sawer',n:'Sawer',src:'stock',ed:'all',t:'Synth',u:'Vintage synth. Fat detuned saws for rage.'},
 {id:'vital',n:'Vital',src:'free',t:'Synth',url:'https://vital.audio',u:'Free wavetable synth with huge supersaws. The top free pick for rage and plugg leads.'},
 {id:'labs',n:'Splice INSTRUMENT (formerly Spitfire LABS)',src:'free',t:'Instruments',url:'https://splice.com/instrument',u:'Needs a free Splice account. Free soft piano, strings, choirs, guitars.'},
 {id:'decent',n:'Decent Sampler',src:'free',t:'Sampler',url:'https://www.decentsamples.com/product/decent-sampler-plugin/',u:'Player for thousands of free libraries (Rhodes, guitars) on Pianobook.'},
 {id:'surge',n:'Surge XT',src:'free',t:'Synth',url:'https://surge-synthesizer.github.io',u:'Open-source synth with thousands of presets.'},
 {id:'dexed',n:'Dexed',src:'free',t:'FM synth',url:'https://asb2m10.github.io/dexed/',u:'DX7 clone. Classic electric pianos and plugg bells.'},
 {id:'tal',n:'TAL-NoiseMaker',src:'free',t:'Synth',url:'https://tal-software.com/products/tal-noisemaker',u:'Light analog-style synth for plucks and pads.'},
 {id:'ample',n:'Ample Guitar M Lite',src:'free',t:'Guitar',url:'https://www.amplesound.net',u:'Free acoustic guitar for R&B chords.'},
 {id:'supermassive',n:'Valhalla Supermassive',src:'free',t:'Reverb / delay',url:'https://valhalladsp.com/shop/reverb/valhalla-supermassive/',u:'Huge washy reverbs. Instant atmosphere.'},
 {id:'ott',n:'Xfer OTT',src:'free',t:'Multiband comp',url:'https://xferrecords.com/freeware',u:'Makes synths bright and in-your-face. Rage leads love it.'},
 {id:'khe',n:'Kilohearts Essentials',src:'free',t:'FX bundle',url:'https://kilohearts.com/products/kilohearts_essentials',u:'Free distortion, bitcrush, chorus, filters.'},
 {id:'nova',n:'TDR Nova',src:'free',t:'Dynamic EQ',url:'https://www.tokyodawn.net/tdr-nova/',u:'Dynamic EQ to tame harsh leads and muddy 808s.'},
 {id:'youlean',n:'Youlean Loudness Meter',src:'free',t:'Meter',url:'https://youlean.co/youlean-loudness-meter/',u:'Shows LUFS so you know how loud your beat really is.'},
 {id:'span',n:'Voxengo SPAN',src:'free',t:'Analyzer',url:'https://www.voxengo.com/product/span/',u:'Spectrum analyzer to see your 808 and kick.'}
];
const P=Object.fromEntries(PLUGINS.map(p=>[p.id,p]));

/* ================= profile ================= */
let prof=store.get('profile',{kb:'mpk4',edition:'producer',have:null,os:'mac'});
function defaultHave(ed){const l=ED.indexOf(ed);return PLUGINS.filter(p=>p.src==='stock'&&ED.indexOf(p.ed)<=l).map(p=>p.id)}
if(!prof.have)prof.have=defaultHave(prof.edition);
const saveProf=()=>store.set('profile',prof);
const has=id=>prof.have.includes(id);
const K=()=>KEYBOARDS[prof.kb]||KEYBOARDS.mpk4;
const midiMode=()=>prof.kb!=='none';
const mod=()=>prof.os==='mac'?'Cmd':'Ctrl';
const alt=()=>prof.os==='mac'?'Option':'Alt';
function pick(list){for(const id of list)if(has(id))return{p:P[id],owned:true};const f=list.find(id=>P[id].src==='free');return{p:P[f||list[0]],owned:false}}
function plug(id){const p=P[id],ok=has(id);return `<a class="pill ${ok?'have':'need'}" href="#plugins" title="${p.u}">${ok?'':'Get '}${p.n}</a>`}
function path(m,n){if(midiMode())return m+(n?`<details class="alt"><summary>No keyboard with you? Do this instead</summary>${n}</details>`:'');return n+(m?`<details class="alt"><summary>When you get a MIDI keyboard</summary>${m}</details>`:'')}
const tip=(h,t)=>`<div class="note"><b class="h">${h}</b>${t}</div>`;
const warn=(h,t)=>`<div class="note warn"><b class="h">${h}</b>${t}</div>`;
const kbd=s=>s.split('+').map(x=>`<kbd>${x}</kbd>`).join('+');

/* ================= notes ================= */
const NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT={Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#',Cb:'B',Fb:'E'};
function midiOf(s){const m=s.match(/^([A-G])([#b]?)(-?\d)$/);let n=m[1]+m[2];if(FLAT[n])n=FLAT[n];return NN.indexOf(n)+12*(+m[3]+1)}
const flName=m=>NN[m%12]+Math.floor(m/12);
const isBlack=m=>[1,3,6,8,10].includes(((m%12)+12)%12);
const freq=m=>440*Math.pow(2,(m-69)/12);
const SCALES={'Natural minor':[0,2,3,5,7,8,10],'Major':[0,2,4,5,7,9,11],'Harmonic minor':[0,2,3,5,7,8,11],'Minor pentatonic':[0,3,5,7,10],'Major pentatonic':[0,2,4,7,9],'Dorian (R&B minor)':[0,2,3,5,7,9,10],'Lydian (plugg)':[0,2,4,6,7,9,11]};

/* ================= recipes ================= */
const RECIPES=[
{id:'rage',name:'Rage anthem',lane:'Rage',ref:'SLAYR lane',bpm:160,key:'F# minor',scale:[6,'Natural minor'],swing:0,
 vibe:'Loud, distorted, euphoric. Detuned supersaw chords, a fuzzed-out 808 and sparse half-time drums.',
 chords:[['F#m','F#3 A3 C#4'],['D','F#3 A3 D4'],['E','G#3 B3 E4'],['C#m','G#3 C#4 E4']],roots:['F#','D','E','C#'],
 drums:{Kick:'x......x..x.....',Snare:'........x.......',Hat:'x.x.x.x.x.x.rrx.',Open:'......x.........'},
 bass:'x......x..x...^.',timbre:'saw',arp:null,
 sounds:[['Lead / chords',['vital','sawer','harmor','sytrus','3xosc'],'Supersaw: 7+ unison voices, wide detune, octave layer. Then OTT and heavy distortion.'],['808',['sampler','kick'],'Long distorted 808, Mono + Porta for slides.'],['Drums',['fpc','sampler'],'Hard punchy kick, crisp snare, tight hats.'],['FX',['ott','fastdist','supermassive','reeverb','grossbeat'],'OTT on the lead, Fast Dist on 808, big reverb send, Gross Beat stutters.']],
 steps:['Set tempo to 160. Load your supersaw and play the 4 chords, one bar each. Hold them long; rage chords sustain.','Program the drums like the Channel Rack tab: kick sparse, snare on beat 3 only, hats in 8ths with a roll at the end.','Record the 808 on the chord roots with a jump up an octave at the end of the bar (Piano roll: 808 tab).','Distort the 808 hard, then low-cut the lead at 150 Hz so they do not fight.','Make the intro with a filtered lead only, then bring everything in on the hook (Playlist tab).'],
 midi:'Play the chords with your right hand and push the joystick up for vibrato on held notes. Link a knob to the lead\'s filter cutoff and ride it into the hook.',
 tips:['Rage leads often play chord notes as a simple 2–3 note riff instead of block chords. Try both.','Use Gross Beat (or automate volume) for gated stutters on the lead.','Keep the kick sparse. The 808 carries the low end.']},
{id:'pluggnb',name:'Pluggnb glow',lane:'Pluggnb',ref:'Bixby lane',bpm:150,key:'Db major',scale:[1,'Major'],swing:0.08,
 vibe:'Soft, glossy, emotional. Major 7th chords from R&B over plugg drums and a bouncy 808.',
 chords:[['Gbmaj7','Gb3 Bb3 Db4 F4'],['Fm7','F3 Ab3 C4 Eb4'],['Ebm7','Eb3 Gb3 Bb3 Db4'],['Ab(add9)','Ab3 C4 Eb4 Bb4']],roots:['Gb','F','Eb','Ab'],
 drums:{Kick:'x.........x.....',Snare:'........x.......',Hat:'x.x.x.x.x.xtx.x.',Perc:'...x.......x...x'},
 bass:'x...x.....x...^.',timbre:'keys',arp:'bell',
 sounds:[['Keys / chords',['labs','decent','flex','flkeys','dexed'],'Soft electric piano or felt piano, a little chorus.'],['Bell / melody',['dexed','flex','sytrus','vital'],'Bright FM bell or glassy pluck, arpeggiated.'],['808',['sampler'],'Clean round 808, short notes that bounce.'],['FX',['supermassive','reeverb','delay3','vchorus','stereo'],'Wide reverb, 1/8 delay on bells, chorus on keys.']],
 steps:['Tempo 150. Play the 4 chords on a soft piano, one bar each.','Copy the chords to a bell sound and arpeggiate them (keyboard arp or Tools → Arpeggiate). Delete notes so it breathes.','Program plugg drums: one kick, half-time snare, steady hats with a triplet roll.','808 follows the roots with short bouncy notes.','Add a vocal-pad or choir layer for the hook.'],
 midi:'Turn on the arp (Up, 1/16, synced to FL) and just hold the chords. Record the result on the bell channel.',
 tips:['Pluggnb lives on maj7 and m7 chords. Borrow progressions from 2000s R&B.','Keep the drums simple. The chords carry the emotion.','Pitch a vocal chop up an octave for an airy top layer.']},
{id:'plugg',name:'Plugg bounce',lane:'Plugg',ref:'classic plugg',bpm:145,key:'C major',scale:[0,'Major'],swing:0.05,
 vibe:'Bright, playful, spacey. Bell melodies, a simple 808 and lots of room.',
 chords:[['Cmaj7','C3 E3 G3 B3'],['Em7','E3 G3 B3 D4'],['Fmaj7','F3 A3 C4 E4'],['G6','G3 B3 D4 E4']],roots:['C','E','F','G'],
 drums:{Kick:'x.....x.........',Snare:'........x.......',Hat:'x.x.x.x.x.x.x.x.',Perc:'..........x...x.'},
 bass:'x.....x...x.....',timbre:'bell',arp:'bell',
 sounds:[['Bells / lead',['dexed','flex','sytrus','vital','3xosc'],'FM bells, music-box or flute presets.'],['Pad',['flex','labs','tal','harmless'],'Quiet airy pad under the bells.'],['808',['sampler'],'Short 808 hits, almost no slide.'],['FX',['delay3','reeverb','supermassive'],'Ping-pong delay on bells.']],
 steps:['Tempo 145. Play a simple 4-note bell riff using chord tones.','Add an airy pad holding the chords underneath, quiet.','Drums: one or two kicks, half-time snare, straight hats.','808: short hits on the root, leave gaps.','Add a vocal chant sample on the snare every 2 bars.'],
 midi:'Play bell riffs in the upper octave (Oct +). Keep them to 3–4 notes and repeat.',
 tips:['Plugg is about space. If it sounds busy, delete something.','Detune the bell a few cents for a dreamy wobble.']},
{id:'darktrap',name:'Dark trap',lane:'Trap',ref:'street / dark',bpm:140,key:'C minor',scale:[0,'Harmonic minor'],swing:0,
 vibe:'Cold piano and strings, hard snares, triplet hat rolls and a long sliding 808.',
 chords:[['Cm','C3 Eb3 G3'],['Ab','C3 Eb3 Ab3'],['Fm','C3 F3 Ab3'],['G','B2 D3 G3']],roots:['C','Ab','F','G'],
 drums:{Kick:'x.....x...x..x..',Snare:'........x.......',Hat:'x.x.xtx.x.x.x.tt',Open:'..............x.'},
 bass:'x.....x...x..x..',timbre:'keys',arp:null,
 sounds:[['Piano',['labs','flex','flkeys'],'Dark felt or grand piano, low register.'],['Strings / choir',['labs','flex','harmor'],'Staccato or long strings doubling the chords.'],['808',['sampler','kick'],'Long 808 with glide on the last note of each bar.'],['FX',['reeverb','supermassive','blood'],'Long dark reverb, overdrive on 808.']],
 steps:['Tempo 140. Play the chords on piano. The G major (from harmonic minor) gives the tension.','Double with strings an octave up, quieter.','Drums: kick pattern from the rack, snare on 3, hats with triplet rolls.','808 on roots with a slide into the next bar.','Arrange with a piano-only intro and a drop-out before the hook.'],
 midi:'Play the low piano notes with velocity, then layer strings with the sustain pedal.',
 tips:['Use harmonic minor (raised 7th) for evil-sounding melodies.','Pitch the last hat roll up for a lift into the next bar.']},
{id:'rnbslow',name:'R&B slow jam',lane:'R&B',ref:'2010s alt-R&B',bpm:70,key:'Eb major',scale:[3,'Major'],swing:0.3,
 vibe:'Late night, warm, lush. Rhodes 7th chords, swung hats, snaps and a deep sub.',
 chords:[['Abmaj7','Ab2 C3 Eb3 G3'],['Gm7','G2 Bb2 D3 F3'],['Fm7','F2 Ab2 C3 Eb3'],['Bb7sus','Bb2 Eb3 F3 Ab3']],roots:['Ab','G','F','Bb'],
 drums:{Kick:'x......x.x......',Snare:'....x.......x...',Hat:'x.xxx.x.x.xxx.xg',Perc:'....x.......x..x'},
 bass:'x......x.x......',timbre:'keys',arp:null,
 sounds:[['Rhodes / keys',['decent','labs','flex','dexed'],'Electric piano with chorus and a little tremolo.'],['Bass',['boobass','sampler','3xosc'],'Round sub or soft 808, notes held long.'],['Pad / guitar',['labs','ample','flex'],'Reverse pad or clean guitar fills.'],['FX',['vchorus','reeverb','supermassive','delay3'],'Chorus on keys, plate reverb on snaps.']],
 steps:['Tempo 70 (or 140 in half-time). Play the 4 seventh chords on Rhodes, letting them ring with sustain.','Drums: kick on 1 and the "and" of 2, snare + finger snap on 2 and 4, swung hats.','Turn swing up to 25–35%.','Sub bass on roots, held long.','Reverse a chord (Sampler → Reverse) leading into each 4 bars.'],
 midi:'This is where a sustain pedal shines. Play chords loosely, then quantize only lightly.',
 tips:['Add the 9th on top of minor chords for instant R&B.','Leave the mids open; that is where the singer goes.']},
{id:'rnbguitar',name:'Bedroom R&B',lane:'R&B',ref:'guitar R&B',bpm:92,key:'A minor',scale:[9,'Dorian (R&B minor)'],swing:0.18,
 vibe:'Intimate and modern. Jazzy guitar or keys on a ii–V–I, crisp drums, round bass.',
 chords:[['Dm9','D3 F3 A3 C4 E4'],['G13','F3 B3 E4'],['Cmaj9','E3 G3 B3 D4'],['Am9','C3 E3 G3 B3']],roots:['D','G','C','A'],
 drums:{Kick:'x.....x...x.....',Snare:'....x.......x...',Hat:'x.x.x.x.x.x.x.x.',Perc:'..x.......x....g'},
 bass:'x.....x...x.....',timbre:'keys',arp:'pluck',
 sounds:[['Guitar / keys',['ample','labs','decent','flex'],'Clean guitar strums or soft piano.'],['Bass',['boobass','sampler','3xosc'],'Warm finger-bass or sub.'],['Drums',['fpc','sampler'],'Tight kick, rim or snare, soft hats.'],['FX',['vchorus','reeverb','delay3'],'Chorus on guitar, short room reverb on drums.']],
 steps:['Tempo 92. Play the ii–V–I–vi chords. In FL, use Tools → Strum on them to sound strummed.','Drums with a rim instead of a snare for the verse.','Bass on roots with a passing note into each chord.','Add a soft pluck melody (Piano roll: melody tab).','Hook: switch rim to full snare and add a pad.'],
 midi:'Play chord tones one at a time (broken chords) instead of all at once. It sounds like fingerpicking.',
 tips:['Rootless voicings (skip the root, let the bass play it) sound pro.','Humanize: Tools → Randomize with small timing and velocity amounts.']}
];
const RMAP=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
const rootMidi=(r,b)=>36+NN.indexOf(FLAT[r.roots[b]]||r.roots[b]);
const LANECOL={Kick:'#ff7a59',Snare:'#ffcf5a',Hat:'#7fd1ff',Open:'#a28bff',Perc:'#7ee08f'};
const ARP=[0,1,2,3,2,1,0,2];
function chordNotes(r){return r.chords.flatMap((c,b)=>c[1].split(' ').map(n=>({m:midiOf(n),s:b*16,l:16,v:.8})))}
function bassNotes(r){const out=[];r.chords.forEach((_,b)=>{const p=r.bass;for(let i=0;i<16;i++){const c=p[i];if(c==='x'||c==='^'){let e=i+1;while(e<16&&p[e]==='.')e++;out.push({m:rootMidi(r,b)+(c==='^'?12:0),s:b*16+i,l:e-i,v:.9,slide:c==='^'})}}});return out}
function arpNotes(r){const out=[];r.chords.forEach((c,b)=>{const ns=c[1].split(' ').map(midiOf);for(let i=0;i<16;i+=2)out.push({m:ns[ARP[(i/2)%8]%ns.length]+12,s:b*16+i,l:2,v:.7})});return out}

/* ================= audio ================= */
const hw={oct:0,vol:store.get('vol',.7),cut:store.get('cut',6000),nr:false,arp:true,knobs:store.get('knobs',[.7,.75,.3,.5,.2,.6,.4,.5])};
let ctx,master,analyser,noiseBuf,limiter,makeup,phoneHP,phoneHP2,phoneLP,conv;const BUS={};
/* live mix state, shared by the mix lab, the 808 lab and normal playback */
const MIXDEF={fader:{Kick:.85,Snare:.75,Hats:.5,'808':.8,Chords:.55,Melody:.6},lowcut:{Kick:0,Snare:120,Hats:350,'808':0,Chords:200,Melody:250},send:{Kick:0,Snare:.08,Hats:0,'808':0,Chords:.2,Melody:.28},cut:{Kick:false,Snare:true,Hats:true,'808':false,Chords:true,Melody:true},sc:true,limit:true,phone:false,drive:.45,glide:.07,len:1,detune:0,solo808:false};
const MIX=JSON.parse(JSON.stringify(MIXDEF));
const LANEBUS={Kick:'Kick',Snare:'Snare',Perc:'Snare',Hat:'Hats',Open:'Hats'};
const BUSNAMES=['Kick','Snare','Hats','808','Chords','Melody'];
function mkBus(name){const b={in:ctx.createGain(),lp:ctx.createBiquadFilter(),hp:ctx.createBiquadFilter(),duck:ctx.createGain(),fader:ctx.createGain(),send:ctx.createGain()};b.lp.type='lowpass';b.lp.frequency.value=(name==='Chords'||name==='Melody')?hw.cut:20000;b.hp.type='highpass';b.hp.Q.value=.7;
 b.in.connect(b.lp);b.lp.connect(b.hp);b.hp.connect(b.duck);b.duck.connect(b.fader);b.fader.connect(master);b.fader.connect(b.send);b.send.connect(conv);return b}
function applyMix(){if(!ctx)return;const t=ctx.currentTime;BUSNAMES.forEach(n=>{const b=BUS[n];b.fader.gain.setTargetAtTime(MIX.fader[n],t,.02);b.hp.frequency.setTargetAtTime(MIX.cut[n]&&MIX.lowcut[n]?MIX.lowcut[n]:10,t,.02);b.send.gain.setTargetAtTime(MIX.send[n],t,.02)});
 limiter.threshold.setValueAtTime(MIX.limit?-9:0,t);limiter.ratio.setValueAtTime(MIX.limit?20:1,t);limiter.knee.setValueAtTime(MIX.limit?2:0,t);makeup.gain.setTargetAtTime(MIX.limit?1.4:1,t,.02);
 phoneHP.frequency.setTargetAtTime(MIX.phone?220:10,t,.02);phoneHP2.frequency.setTargetAtTime(MIX.phone?220:10,t,.02);phoneLP.frequency.setTargetAtTime(MIX.phone?7000:22000,t,.02);dcurve=null}
function setCut(v){hw.cut=v;['Chords','Melody'].forEach(n=>{if(BUS[n])BUS[n].lp.frequency.value=v})}
function audio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=hw.vol;
 phoneHP=ctx.createBiquadFilter();phoneHP.type='highpass';phoneHP.frequency.value=10;phoneLP=ctx.createBiquadFilter();phoneLP.type='lowpass';phoneLP.frequency.value=22000;
 limiter=ctx.createDynamicsCompressor();limiter.attack.value=.002;limiter.release.value=.12;makeup=ctx.createGain();
 analyser=ctx.createAnalyser();analyser.fftSize=4096;analyser.smoothingTimeConstant=.78;
 const safety=ctx.createDynamicsCompressor();safety.threshold.value=-1;safety.ratio.value=20;safety.attack.value=.001;
 phoneHP2=ctx.createBiquadFilter();phoneHP2.type='highpass';phoneHP2.frequency.value=10;master.connect(phoneHP);phoneHP.connect(phoneHP2);phoneHP2.connect(phoneLP);phoneLP.connect(limiter);limiter.connect(makeup);makeup.connect(safety);safety.connect(analyser);analyser.connect(ctx.destination);
 conv=ctx.createConvolver();const len=ctx.sampleRate*2.2,ir=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}conv.buffer=ir;const rv=ctx.createGain();rv.gain.value=.9;const rvhp=ctx.createBiquadFilter();rvhp.type='highpass';rvhp.frequency.value=300;conv.connect(rvhp);rvhp.connect(rv);rv.connect(master);
 BUSNAMES.forEach(n=>BUS[n]=mkBus(n));applyMix();
 noiseBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(ctx.state==='suspended')ctx.resume();return ctx}
const B=lane=>BUS[LANEBUS[lane]||lane].in;
function env(g,t,a,p,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(p,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function noise(t,dur,type,f,p,d,q,out){const s=ctx.createBufferSource();s.buffer=noiseBuf;const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;if(q)fl.Q.value=q;const g=ctx.createGain();env(g,t,.001,p,d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+dur)}
function duck808(t){if(!MIX.sc||!BUS['808'])return;const g=BUS['808'].duck.gain;g.cancelScheduledValues(t);g.setValueAtTime(1,t);g.linearRampToValueAtTime(.2,t+.008);g.linearRampToValueAtTime(1,t+.17)}
const DR={
 Kick(t,v){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(48,t+.1);env(g,t,.002,.9*v,.32);o.connect(g);g.connect(B('Kick'));o.start(t);o.stop(t+.4);noise(t,.02,'highpass',3000,.25*v,.012,0,B('Kick'));duck808(t)},
 Snare(t,v){const out=B('Snare');noise(t,.25,'highpass',1400,.5*v,.18,0,out);const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=190;env(g,t,.001,.35*v,.08);o.connect(g);g.connect(out);o.start(t);o.stop(t+.12);noise(t+.012,.1,'bandpass',1800,.3*v,.06,1,out)},
 Hat(t,v){noise(t,.06,'highpass',7500,.28*v,.035,0,B('Hat'))},
 Open(t,v){noise(t,.3,'highpass',7000,.22*v,.22,0,B('Open'))},
 Perc(t,v){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(600,t+.05);env(g,t,.001,.25*v,.07);o.connect(g);g.connect(B('Perc'));o.start(t);o.stop(t+.1)}
};
let dcurve;function curve(){if(dcurve)return dcurve;const n=2048,c=new Float32Array(n),k=1+MIX.drive*14;for(let i=0;i<n;i++){const x=i*2/n-1;c[i]=Math.tanh(x*k)/Math.tanh(k)}return dcurve=c}
function play808(t,m,dur,from){const o=ctx.createOscillator(),g=ctx.createGain(),ws=ctx.createWaveShaper(),pre=ctx.createGain();ws.curve=curve();ws.oversample='2x';pre.gain.value=.9;o.detune.value=MIX.detune;const f=freq(m);
 if(from&&MIX.glide>0){o.frequency.setValueAtTime(freq(from),t);o.frequency.exponentialRampToValueAtTime(f,t+MIX.glide)}else o.frequency.setValueAtTime(f,t);
 const d=Math.max(.08,dur*MIX.len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.6,t+.004);g.gain.setValueAtTime(.6,t+Math.max(.02,d-.05));g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(pre);pre.connect(ws);ws.connect(g);g.connect(BUS['808'].in);o.start(t);o.stop(t+d+.02)}
function tone(t,m,dur,timbre,vol=1,bus='Chords'){const g=ctx.createGain(),f=freq(m);let ns=[];
 if(timbre==='saw'){const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;for(const d of[-12,0,12]){const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=d;o.connect(lp);ns.push(o)}lp.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06*vol,t+.01);g.gain.setValueAtTime(.06*vol,t+Math.max(.02,dur-.05));g.gain.exponentialRampToValueAtTime(.0001,t+dur)}
 else if(timbre==='bell'){const o=ctx.createOscillator(),o2=ctx.createOscillator(),g2=ctx.createGain();o.frequency.value=f;o2.frequency.value=f*3.5;g2.gain.value=.4;o2.connect(g2);g2.connect(g);o.connect(g);ns=[o,o2];env(g,t,.003,.13*vol,Math.min(dur,1.1))}
 else if(timbre==='pluck'){const o=ctx.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(g);ns=[o];env(g,t,.003,.14*vol,.35)}
 else{const o=ctx.createOscillator(),o2=ctx.createOscillator(),g2=ctx.createGain();o.frequency.value=f;o2.type='triangle';o2.frequency.value=f*2;g2.gain.value=.15;o2.connect(g2);g2.connect(g);o.connect(g);ns=[o,o2];g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.1*vol,t+.008);g.gain.exponentialRampToValueAtTime(.035*vol,t+.4);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.45,dur))}
 g.connect(BUS[bus].in);ns.forEach(o=>{o.start(t);o.stop(t+Math.max(.5,dur)+.05)})}
function playNote(m,timbre='keys'){audio();tone(ctx.currentTime+.01,m,.9,timbre,1,'Melody')}
function scope(){}

/* ================= sequencer ================= */
let cur=JSON.parse(JSON.stringify(RMAP[store.get('beat','rage')]||RECIPES[0]));
const seq={on:false,step:0,next:0,timer:null,last:null,layers:{drums:true,chords:true,arp:true,bass:true}};
const levels={};
function syncBtns(){$('#tPlay').classList.toggle('on',seq.on);$$('.hw-btn[data-b="play"]').forEach(x=>x.classList.toggle('on',seq.on));const pb=$('#playBtn');if(pb)pb.textContent=seq.on?'■ Stop':'▶ Play';const hp=$('#homePlay');if(hp)hp.textContent=(seq.on?'■ Stop ':'▶ Hear ')+cur.name}
function setBeat(id){if(seq.on)stopSeq();cur=JSON.parse(JSON.stringify(RMAP[id]));store.set('beat',id);ddSet('tBeat',id);$('#tBpm').innerHTML=`<b>${cur.bpm}</b> BPM`}
function startSeq(){audio();clearInterval(seq.timer);seq.on=true;seq.step=0;seq.next=ctx.currentTime+.08;seq.last=null;seq.timer=setInterval(tick,25);document.body.classList.add('playing');syncBtns()}
function stopSeq(){seq.on=false;clearInterval(seq.timer);document.body.classList.remove('playing');$$('.st.now').forEach(e=>e.classList.remove('now'));$$('.pr-note.hot').forEach(e=>e.classList.remove('hot'));$('#tPos').innerHTML='Bar <b>1</b> · beat <b>1</b>';litChord([]);syncBtns()}
function tick(){const r=cur,sd=60/r.bpm/4,total=r.chords.length*16;while(seq.next<ctx.currentTime+.12){const s=seq.step%total,bar=Math.floor(s/16),i=s%16,t=seq.next+(i%2?r.swing*sd*.5:0);
 if(seq.layers.drums)for(const[l,p]of Object.entries(r.drums)){if(MIX.solo808&&l!=='Kick')continue;const c=p[i];if(c==='x')DR[l](t,1);else if(c==='g')DR[l](t,.4);else if(c==='r'){DR[l](t,.9);DR[l](t+sd/2,.6)}else if(c==='t'){for(let k=0;k<3;k++)DR[l](t+k*sd/3,.9-k*.15)}}
 const ns=r.chords[bar][1].split(' ').map(midiOf);
 if(i===0&&seq.layers.chords&&!MIX.solo808)ns.forEach(m=>tone(t,m,sd*16*.98,r.timbre,r.timbre==='saw'?1:.8,'Chords'));
 if(r.arp&&seq.layers.arp&&!MIX.solo808&&i%2===0)tone(t,ns[ARP[(i/2)%8]%ns.length]+12,sd*1.8,r.arp,.7,'Melody');
 if(seq.layers.bass){const c=r.bass[i];if(c==='x'||c==='^'){let e=i+1;while(e<16&&r.bass[e]==='.')e++;const m=rootMidi(r,bar)+(c==='^'?12:0);play808(t,m,sd*(e-i)*.95,c==='^'?seq.last:null);seq.last=m}}
 const at=seq.next;setTimeout(()=>vis(s),Math.max(0,(at-ctx.currentTime)*1000));seq.next+=sd;seq.step++}}
function vis(s){if(!seq.on)return;const r=cur,total=r.chords.length*16,i=s%16,bar=Math.floor(s/16);
 $('#tPos').innerHTML=`Bar <b>${bar+1}</b> · beat <b>${Math.floor(i/4)+1}</b>`;
 $$('.st.now').forEach(e=>e.classList.remove('now'));$$(`.cr[data-live] .st[data-i="${i}"]`).forEach(e=>e.classList.add('now'));
 $$('.pr[data-live]').forEach(pr=>{const steps=+pr.dataset.steps||total;pr.querySelector('.pr-ph').style.left=((s%steps)/steps*100)+'%';$$('.pr-note',pr).forEach(n=>{const a=+n.dataset.s,b=a+ +n.dataset.l;n.classList.toggle('hot',s>=a&&s<b)})});
 if(seq.layers.drums)for(const[l,p]of Object.entries(r.drums)){if(p[i]!=='.'){levels[l]=p[i]==='g'?.45:.9;$$(`.hw-pad[data-lane="${l}"]`).forEach(x=>{x.classList.add('lit');setTimeout(()=>x.classList.remove('lit'),90)})}}
 if(r.bass[i]!=='.'&&seq.layers.bass)levels['808']=1;
 if(seq.layers.chords)levels.Chords=Math.max(levels.Chords||0,i===0?.85:.45);
 if(i===0){litChord(r.chords[bar][1].split(' ').map(midiOf));$$('.chordbtn[data-c]').forEach(b=>b.classList.toggle('now',+b.dataset.c===bar))}
 if(r.arp&&seq.layers.arp&&i%2===0)levels.Melody=.7}
function litChord(ms){$$('.hw-keys').forEach(el=>fitHit(el,ms));$$('.qw').forEach(el=>fitHit(el,ms));$$('.pr[data-live] .pr-k').forEach(k=>k.classList.toggle('hit',ms.includes(+k.dataset.m)))}
function fitHit(el,ms){const ks=$$('[data-m]',el);if(!ks.length)return;const vals=ks.map(k=>+k.dataset.m);const lo=Math.min(...vals),hi=Math.max(...vals);const fit=ms.map(m=>{while(m<lo)m+=12;while(m>hi)m-=12;return m});ks.forEach(k=>k.classList.toggle('hit',fit.includes(+k.dataset.m)))}
(function meters(){const ms=$$('.mx-m i[data-l]');if(ms.length){const mx=Math.max(0,...Object.values(levels));ms.forEach(m=>{const l=m.dataset.l;let v=l==='Master'?mx:(levels[l]||0);if(l==='Reverb')v=mx*.4;if(!seq.on)v=Math.max(v,.12+.08*Math.sin(Date.now()/350+ +m.dataset.idle));m.style.height=Math.min(100,v*100)+'%'});for(const k in levels)levels[k]*=.9}requestAnimationFrame(meters)})();

/* ================= fit scaling & figures ================= */
function fit(inner,w){return `<div class="fit" data-w="${w}"><div class="fit-in" style="width:${w}px">${inner}</div></div>`}
function fitAll(){$$('.fit').forEach(f=>{const w=+f.dataset.w,cw=f.clientWidth;if(!cw)return;const s=Math.min(1,(cw-24)/w),inn=f.firstElementChild;inn.style.transform=`scale(${s})`;f.style.height=(inn.offsetHeight*s+24)+'px'})}
addEventListener('resize',fitAll);
let figN=0;
function fig(inner,w,legend,cap){const id='fig'+(++figN);return `<figure class="fig" id="${id}" style="margin-inline:0">${fit(inner,w)}${cap?`<figcaption class="fig-cap">${cap}</figcaption>`:''}${legend&&legend.length?`<ol class="legend">${legend.map((t,i)=>`<li data-n="${i+1}"><span class="n">${i+1}</span><span>${t}</span></li>`).join('')}</ol>`:''}</figure>`}
function mountFigs(root){$$('[data-co]',root).forEach(el=>{if(el.querySelector(':scope>mark.co'))return;const b=document.createElement('mark');b.className='co';b.textContent=el.dataset.co;b.style.setProperty('--k',el.dataset.co);el.appendChild(b)});
 $$('.legend li',root).forEach(li=>{if(li._b)return;li._b=1;const f=li.closest('.fig');if(!f)return;const n=li.dataset.n;const on=v=>{$$(`[data-co="${n}"]`,f).forEach(e=>e.classList.toggle('spot',v));li.classList.toggle('act',v)};li.addEventListener('mouseenter',()=>on(true));li.addEventListener('mouseleave',()=>{if(!li._lock)on(false)});li.addEventListener('click',()=>{const v=!li._lock;$$('.legend li',f).forEach(x=>{if(x._lock){x._lock=false;x.classList.remove('act');$$(`[data-co="${x.dataset.n}"]`,f).forEach(e=>e.classList.remove('spot'))}});li._lock=v;on(v)})})}
const co=(map,k)=>map&&map[k]?` data-co="${map[k]}"`:'';

/* ================= FL mock builders ================= */
const FLICON={"Playlist":'<svg width="14" height="12" viewBox="0 0 14 12"><rect x="0" y="1" width="6" height="3" fill="currentColor"/><rect x="5" y="5" width="8" height="3" fill="currentColor"/><rect x="2" y="9" width="5" height="3" fill="currentColor"/></svg>',"Piano roll":'<svg width="14" height="12" viewBox="0 0 14 12"><rect x="0" y="0" width="3" height="12" fill="currentColor"/><rect x="5" y="2" width="5" height="2" fill="currentColor"/><rect x="7" y="6" width="6" height="2" fill="currentColor"/></svg>',"Browser":'<svg width="14" height="12" viewBox="0 0 14 12"><path d="M0 2h5l1 1h8v8H0z" fill="currentColor"/></svg>',"Channel rack":'<svg width="14" height="12" viewBox="0 0 14 12"><rect x="0" y="0" width="3" height="3" fill="currentColor"/><rect x="5" y="0" width="3" height="3" fill="currentColor"/><rect x="0" y="4.5" width="3" height="3" fill="currentColor"/><rect x="10" y="4.5" width="3" height="3" fill="currentColor"/><rect x="5" y="9" width="3" height="3" fill="currentColor"/></svg>',"Mixer":'<svg width="14" height="12" viewBox="0 0 14 12"><path d="M2 0v12M7 0v12M12 0v12" stroke="currentColor" stroke-width="1.4"/><rect x="0" y="6" width="4" height="2" fill="currentColor"/><rect x="5" y="2" width="4" height="2" fill="currentColor"/><rect x="10" y="8" width="4" height="2" fill="currentColor"/></svg>'};
const win=(title,body,o={})=>`<div class="fl flw" data-ui style="${o.w?'width:'+o.w+'px;':''}"><div class="flw-t"><span class="tt">${title}</span>${o.right||''}<span class="wb"><i></i><i></i><i></i></span></div><div class="flw-b" style="${o.pad===0?'padding:0':''}">${body}</div></div>`;
function toolbar(c={},o={}){const bpm=o.bpm||140;return `<div class="fl fl-tb" data-ui>
<div class="fl-menu"${co(c,'menu')}><span>FILE</span><span>EDIT</span><span>ADD</span><span>PATTERNS</span><span>VIEW</span><span>OPTIONS</span><span>TOOLS</span><span>HELP</span></div>
<div class="fl-grp"${co(c,'patsong')}><span class="fl-b ${o.song?'':'lit'}">PAT</span><span class="fl-b ${o.song?'lit':''}">SONG</span></div>
<div class="fl-grp"${co(c,'transport')}><span class="fl-b go">▶</span><span class="fl-b">■</span><span class="fl-b rec ${o.rec?'lit':''}">●</span></div>
<span class="fl-lcd"${co(c,'tempo')}>${bpm.toFixed(3)}</span>
<div class="fl-grp"${co(c,'metro')}><span class="fl-b" title="Metronome">Metro</span><span class="fl-b" title="Countdown">3·2·1</span><span class="fl-b ${o.typing?'lit':''}" title="Typing keyboard to piano"${co(c,'typing')}>⌨</span></div>
<span class="fl-lcd" style="font-size:13px">1:01:000</span>
<div class="fl-grp"${co(c,'pattern')}><span class="fl-b" style="min-width:110px;justify-content:flex-start">▤ ${o.pattern||'Pattern 1'}</span></div>
<div class="fl-grp"${co(c,'windows')}>${['Playlist','Piano roll','Browser','Channel rack','Mixer'].map((w,i)=>`<span class="fl-b ${o.active===w?'lit':''}" data-win="${w}" title="${w}" aria-label="${w}">${FLICON[w]}</span>`).join('')}</div>
<span class="fl-hint">${o.hint||'Hint bar: hover anything in FL to see what it does'}</span></div>`}
function channelRack(rows,o={}){const c=o.co||{};const sw=o.swing||0;return win(`Channel rack <span style="font-weight:600;color:#9aa3ad;margin-left:8px">${o.pattern||'Pattern 1'}</span>`,`
<div class="cr" ${o.live?'data-live':''}>${rows.map((r,ri)=>`<div class="cr-row"><span class="cr-led"${ri===0?co(c,'led'):''}></span><span class="knob" style="--r:0deg"></span><span class="knob" style="--r:40deg"${ri===0?co(c,'vol'):''}></span><span class="cr-trk"${ri===0?co(c,'trk'):''}>${r.trk??'---'}</span><span class="cr-name" style="--c:${r.color||'#8b94a0'}"${ri===0?co(c,'name'):''}>${r.name}</span><div class="cr-steps"${ri===0?co(c,'steps'):''}>${[0,1,2,3].map(g=>`<div class="g">${[0,1,2,3].map(k=>{const i=g*4+k,ch=r.pat[i]||'.';return `<span class="st ${ch!=='.'?'on':''}" data-lane="${r.lane||r.name}" data-i="${i}">${ch==='r'?'<em>32</em>':ch==='t'?'<em>3</em>':ch==='g'?'<em>·</em>':''}</span>`}).join('')}</div>`).join('')}</div></div>`).join('')}
<div class="cr-foot"><span class="cr-plus"${co(c,'plus')}>+</span><span style="margin-left:auto;display:flex;align-items:center;gap:6px;color:#9aa3ad"${co(c,'swing')}>Swing <span class="knob" style="--r:${-135+sw*270}deg"></span></span></div></div>`,{w:o.w||640,right:`<span style="color:#9aa3ad;font-weight:600;margin-right:8px">All ▾</span>`})}
function pianoRoll(notes,o={}){const c=o.co||{};const bars=o.bars||4,steps=bars*16,W=o.w||860,KW=64,gw=W-KW-2;
 const ms=notes.map(n=>n.m);const lo=o.lo??Math.min(...ms)-2,hi=o.hi??Math.max(...ms)+2;const rows=hi-lo+1,rh=Math.max(12,Math.min(18,Math.floor((o.h||240)/rows))),H=rows*rh;
 const sc=o.scale?SCALES[o.scale[1]].map(x=>(x+o.scale[0])%12):null;const stepW=gw/steps;
 const keys=[],grid=[];for(let m=hi;m>=lo;m--){const y=(hi-m)*rh,blk=isBlack(m),pc=((m%12)+12)%12;
  keys.push(`<div class="pr-k ${blk?'b':'w'} ${pc===0?'c':''} ${pc===5?'f':''}" data-m="${m}" style="top:${y}px;height:${rh}px">${pc===0?`<span>${flName(m)}</span>`:''}</div>`);
  grid.push(`<div class="pr-row ${blk?'b':''} ${pc===0?'c':''} ${sc&&sc.includes(pc)?'sc':''}" style="top:${y}px;height:${rh}px"></div>`)}
 const vlines=[];for(let s=0;s<=steps;s++){const cls=s%16===0?'bar':s%4===0?'beat':'st';vlines.push(`<i class="${cls}" style="left:${(s*stepW).toFixed(1)}px"></i>`)}
 const nh=notes.map((n,k)=>{const w=Math.max(4,n.l*stepW-1);return `<div class="pr-note ${n.slide?'slide':''}" data-s="${n.s}" data-l="${n.l}" style="left:${(n.s*stepW+.5).toFixed(1)}px;width:${w.toFixed(1)}px;top:${(hi-n.m)*rh+1}px;height:${rh-2}px"${k===(o.coNote??-1)?co(c,'note'):''}>${w>=30&&rh>=12?`<span>${flName(n.m)}</span>`:''}</div>`}).join('');
 const vel=notes.map(n=>`<i style="left:${(n.s*stepW+1).toFixed(1)}px;height:${Math.round(n.v*100)}%"></i>`).join('');
 const ruler=Array.from({length:bars},(_,i)=>`<span style="left:${i*16*stepW}px">${(o.barStart||1)+i}</span>`).join('');
 const tools=`<div class="pr-tools"><span class="pr-title">${o.title||'Piano roll'}</span>${[['P','Draw (P)','draw'],['B','Paint (B)','paint'],['D','Delete (D)','del'],['T','Mute (T)',''],['C','Slice (C)','slice'],['E','Select (E)','select'],['Z','Zoom (Z)','']].map(([g,n,k])=>`<span class="fl-b" title="${n}"${co(c,k)}>${g}</span>`).join('')}<span class="fl-b" style="margin-left:8px"${co(c,'snap')}>Snap: ${o.snap||'Step'}</span><span class="fl-b"${co(c,'stamp')}>Stamp ▾</span><span class="fl-b" style="margin-left:auto"${co(c,'menu')}>Tools ▾</span><span class="fl-b"${co(c,'ghost')}>View ▾</span></div>`;
 return win(`Piano roll - ${o.channel||'Channel'}`,`<div class="pr" ${o.live?'data-live':''} data-steps="${steps}">${tools}<div class="pr-body" style="grid-template-columns:${KW}px ${gw}px"><div class="pr-corner"></div><div class="pr-ruler">${ruler}</div><div class="pr-keys" style="height:${H}px"${co(c,'keys')}>${keys.join('')}</div><div class="pr-grid" style="height:${H}px"${co(c,'grid')}>${grid.join('')}<div class="pr-lines">${vlines.join('')}</div>${nh}<div class="pr-ph"></div></div><div class="pr-vlabel">Velocity</div><div class="pr-vel"${co(c,'vel')}>${vel}</div></div></div>`,{w:W,pad:0})}
const ARR=[['Intro',0,8],['Hook',8,16],['Verse 1',24,16],['Hook',40,16],['Verse 2',56,16],['Hook',72,16],['Outro',88,8]];
function playlist(o={}){const c=o.co||{};const bars=96,W=o.w||860,lw=W-110-2,bw=lw/bars;
 const T=[['Melody','#ff9a3c',()=>true],['Chords','#a28bff',()=>true],['Drums','#7fd1ff',s=>!['Intro','Outro'].includes(s)],['Hats','#7ee08f',s=>!['Intro','Outro'].includes(s)],['808','#ff7a8a',s=>!['Intro','Outro'].includes(s)],['FX','#ffcf5a',s=>s==='Hook']];
 const lanes=T.map(([n,col,f],ti)=>`<div class="pl-name"${ti===0?co(c,'track'):''}>${n}</div><div class="pl-lane" style="--bw:${bw*4}px">${ARR.filter(a=>f(a[0])).map(([s,st,len],k)=>{if(n==='FX')return `<div class="pl-blk" style="left:${(st-1)*bw}px;width:${bw*2-1}px;--c:${col}"></div>`;let l=len,label=n;if(n==='Drums'&&s.startsWith('Verse'))label='Drums B';if(n==='808')label=s.startsWith('Verse')?'808 B':'808 A';if(n==='Drums'&&s==='Verse 1')l=len-1;return `<div class="pl-blk" style="left:${st*bw+1}px;width:${l*bw-2}px;--c:${col}"${ti===2&&k===0?co(c,'pattern'):''}>${label}</div>`}).join('')}${ti===2?`<span${co(c,'dropout')} style="position:absolute;left:${39*bw}px;top:4px;width:${bw}px;height:26px;border:1px dashed #ffcf5a;border-radius:3px"></span>`:''}</div>`).join('');
 const ruler=Array.from({length:bars/8},(_,i)=>`<span style="left:${i*8*bw+3}px">${i*8+1}</span>`).join('');
 const mk=ARR.map(([s,st])=>`<span style="left:${st*bw}px">${s}</span>`).join('');
 return win(`Playlist - Arrangement › ${o.name||'My beat'}`,`<div class="pl"><div style="background:#2a2e34"></div><div class="pl-ruler"${co(c,'ruler')}>${ruler}</div><div style="background:#262a2f"></div><div class="pl-mk"${co(c,'marker')}>${mk}</div>${lanes}<div class="pl-phw"><div class="pl-ph"></div></div></div>`,{w:W,pad:0})}
function mixer(o={}){const c=o.co||{};const tr=['Master','Kick','Snare','Hat','Open','808','Chords','Melody','Reverb'];const sel=o.sel||'808';
 const fx=o.fx||[['Fruity Parametric EQ 2',1],['Fruity Fast Dist',1],['Fruity Limiter',1],['(empty)',0],['(empty)',0],['(empty)',0]];
 const strips=tr.map((n,i)=>`<div class="mx-s ${i===0?'master':''} ${n===sel?'sel':''}"${i===0?co(c,'master'):n===sel?co(c,'strip'):''}><span class="mx-n">${i===0?'Master':i+' '+n}</span><span class="knob" style="--r:0deg"></span><div class="mx-io"><div class="mx-m"${n===sel?co(c,'meter'):''}><i data-l="${n}" data-idle="${i}"></i></div><div class="mx-m"><i data-l="${n}" data-idle="${i+.7}"></i></div><div class="mx-f"${n===sel?co(c,'fader'):''} style="--y:${[20,30,38,52,58,28,44,40,60][i]}%"><b></b></div></div><span class="mx-route ${i>0?'on':''}"${n==='Reverb'?co(c,'send'):''}></span></div>`).join('');
 return win('Mixer - '+sel,`<div class="mx">${strips}<div class="mx-fx"${co(c,'fx')}><div class="h">Insert ${tr.indexOf(sel)} - ${sel}</div>${fx.map(([n,on],i)=>`<div class="slot ${on?'on':''}">${i+1}. ${n}</div>`).join('')}<div style="margin-top:8px;display:flex;gap:10px;align-items:center;color:#9aa3ad">Mix <span class="knob" style="--r:135deg"></span> Out <span class="knob" style="--r:20deg"></span></div></div></div>`,{w:o.w||860})}
function browser(hl){const items=[['Current project',0],['Recent files',0],['Plugin database',0],['Plugin presets',0],['Channel presets',0],['Packs',0],['Drums',1],['Kick 01.wav',2,'f'],['Snare 04.wav',2,'f'],['Instruments',1],['Loops',1],['Samples (yours)',0],['Drum kits (yours)',0]];
 return win('Browser - All',`<div class="fl-br">${items.map(([n,d,f])=>`<div class="${f||''} ${n===hl?'hl':''}" style="--d:${d}">${n}</div>`).join('')}</div>`,{w:220})}
function dlgMidi(o={}){const c=o.co||{};const kb=K().short==='My keyboard'?'USB MIDI Keyboard':K().short==='Full-size keys'?'USB Keyboard 61':K().short;
 if(o.mpk4)return win('Settings - MIDI input / output',`<div class="dlg-tabs"><span class="on">MIDI</span><span>Audio</span><span>General</span><span>File</span><span>Project</span><span>Info</span></div>
<div class="dlg-sec">Output</div><div class="dlg-list"><div>MPK mini IV MIDI Port<b>port 1</b></div><div class="sel">MPK mini IV DAW Port<b>port 2</b></div></div>
<div class="dlg-row"><span class="cb on"${co(c,'sync')}><i></i>Send master sync</span><span style="margin-left:auto">Port</span><span class="dd" style="min-width:50px">2</span></div>
<div class="dlg-sec">Input</div><div class="dlg-list"><div class="sel"${co(c,'input')}>MPK mini IV MIDI Port<b>AKAI MPK Mini IV MIDI · port 1</b></div><div${co(c,'dawrow')}>MPK mini IV DAW Port<b>AKAI MPK Mini IV DAW · port 2</b></div></div>
<div class="dlg-row"><span class="cb on"${co(c,'enable')}><i></i>Enable</span><span>Controller type</span><span class="dd" style="min-width:200px"${co(c,'type')}>AKAI MPK Mini IV MIDI</span><span>Port</span><span class="dd" style="min-width:50px">1</span></div>
<div class="dlg-row"><span style="color:#9aa3ad">DAW port row:</span><span class="dd" style="min-width:200px"${co(c,'daw')}>AKAI MPK Mini IV DAW</span><span>Port</span><span class="dd" style="min-width:50px">2</span></div>`,{w:o.w||600});
 return win('Settings - MIDI input / output',`<div class="dlg-tabs"><span class="on">MIDI</span><span>Audio</span><span>General</span><span>File</span><span>Project</span><span>Info</span></div>
<div class="dlg-sec">Output</div><div class="dlg-list"><div class="sel">${kb}<b>port 1</b></div></div>
<div class="dlg-row"><span class="cb on"${co(c,'sync')}><i></i>Send master sync</span><span style="margin-left:auto">Port</span><span class="dd" style="min-width:50px">1</span></div>
<div class="dlg-sec">Input</div><div class="dlg-list"${co(c,'input')}><div class="sel">${kb}<b>(generic controller)</b></div><div>${prof.os==='mac'?'IAC Driver Bus 1':'loopMIDI Port'}</div></div>
<div class="dlg-row"><span class="cb on"${co(c,'enable')}><i></i>Enable</span><span>Controller type</span><span class="dd"${co(c,'type')}>(generic controller)</span><span>Port</span><span class="dd" style="min-width:50px">1</span></div>
<div class="dlg-row"><span class="fl-b" style="padding:0 10px"${co(c,'rescan')}>Rescan devices</span><span class="cb on"><i></i>Auto accept detected controller</span></div>`,{w:o.w||560})}
function dlgAudio(o={}){const c=o.co||{};const mac=prof.os==='mac';return win('Settings - Audio',`<div class="dlg-tabs"${co(c,'tabs')}><span>MIDI</span><span class="on">Audio</span><span>General</span><span>File</span><span>Project</span></div>
<div class="dlg-sec">Input / output</div><div class="dlg-row"><span>Device</span><span class="dd" style="min-width:300px"${co(c,'device')}>${mac?'Core Audio: External Headphones':'FL Studio ASIO'}</span></div>
<div class="dlg-row"><span>Sample rate (Hz)</span><span class="dd" style="min-width:90px"${co(c,'rate')}>44100</span></div>
<div class="dlg-sec">Buffer</div><div class="dlg-row"><span>Buffer length</span><span class="slider" style="--x:28%"${co(c,'buffer')}><b></b></span><span style="color:var(--accent);font-weight:700">256 smp (5.8 ms)</span></div>
<div class="dlg-row"><span class="cb"><i></i>Triple buffer</span><span class="cb on"><i></i>Safe overloads</span></div>`,{w:o.w||560})}
function menuLink(o={}){const c=o.co||{};return `<div class="fl" data-ui style="display:flex;gap:16px;align-items:flex-start"><div class="flw" style="padding:14px;display:grid;place-items:center;gap:6px"><span class="knob" style="width:40px;height:40px;--r:60deg"${co(c,'knob')}></span><span style="font-weight:700">CUTOFF</span><span style="color:#9aa3ad">right-click</span></div><div class="menu"${co(c,'menu')}><div>Edit events</div><div>Edit events in new window</div><div>Init song with this position</div><hr><div>Create automation clip</div><div class="hl"${co(c,'link')}>Link to controller...</div><hr><div>Copy value</div><div>Paste value</div><div>Reset</div></div><div class="flw" style="padding:10px;width:250px"${co(c,'dlg')}><div style="font-weight:700;margin-bottom:6px">Remote control settings</div><div style="color:#9aa3ad">Move a control on your keyboard…</div><div style="margin-top:8px">Ctrl <b style="color:var(--accent)">#71</b> · Channel 1</div><div class="dlg-row"><span class="cb on"><i></i>Auto detect</span><span class="fl-b" style="margin-left:auto;padding:0 10px"${co(c,'accept')}>Accept</span></div></div></div>`}
function menuRec(o={}){const c=o.co||{};return `<div data-ui style="display:flex;flex-direction:column;gap:12px">${toolbar({transport:1,metro:2},{rec:true,hint:'Record: press R or click the record button'})}<div class="fl menu" style="width:440px;margin-left:160px"${co(c,'menu')}><div style="font-weight:700;color:#fff">What would you like to record?</div><hr><div>Audio, into the Edison audio editor / recorder</div><div>Audio, into the playlist as an audio clip</div><div class="hl"${co(c,'notes')}>✓ Notes</div><div class="hl" style="margin-top:2px">✓ Automation</div><div>Audio</div></div></div>`}
function chSettings(o={}){const c=o.co||{};return win('Channel settings - 808',`<div style="display:flex;gap:4px;margin-bottom:8px"><span class="fl-b">SMP</span><span class="fl-b"${co(c,'ins')}>INS</span><span class="fl-b lit"${co(c,'func')}>MISC</span></div>
<div class="dlg-sec">Polyphony</div><div class="dlg-row"><span class="cb on"${co(c,'mono')}><i></i>Mono</span><span class="cb on"${co(c,'porta')}><i></i>Porta</span><span style="margin-left:14px">Slide</span><span class="knob" style="--r:-40deg"${co(c,'slide')}></span><span>Max <b>1</b></span></div>
<div class="dlg-sec">Root note</div><div class="dlg-row" style="gap:1px"${co(c,'root')}>${Array.from({length:24},(_,i)=>`<span style="width:14px;height:34px;border-radius:0 0 3px 3px;background:${i===6?'var(--accent)':isBlack(i)?'#222':'#e9ecef'}"></span>`).join('')}<span style="margin-left:8px;color:var(--accent);font-weight:700">Root: F#5</span></div>`,{w:o.w||480})}
function dlgExport(o={}){const c=o.co||{};return win('Rendering - beatname_160bpm_F#m',`<div class="dlg-sec">Project type</div><div class="dlg-row"${co(c,'mode')}><span class="cb"><i></i>Pattern</span><span class="cb on"><i></i>Song</span><span style="margin-left:14px">Tail</span><span class="dd"${co(c,'tail')}>Leave remainder</span></div>
<div class="dlg-sec">Output format</div><div class="dlg-row"${co(c,'fmt')}><span class="cb on"><i></i>WAV</span><span class="cb on"><i></i>MP3</span><span class="cb"><i></i>OGG</span><span class="cb"><i></i>FLAC</span><span class="cb"><i></i>MIDI</span></div>
<div class="dlg-row"><span>WAV bit depth</span><span class="dd" style="min-width:110px">24Bit int</span><span>MP3 bitrate</span><span class="dd" style="min-width:90px">320 kbps</span></div>
<div class="dlg-sec">Miscellaneous</div><div class="dlg-row"><span class="cb on"${co(c,'split')}><i></i>Split mixer tracks</span><span class="cb"><i></i>Save playlist markers</span></div>
<div class="dlg-row" style="justify-content:flex-end"><span class="fl-b lit" style="padding:0 18px;height:28px"${co(c,'start')}>Start</span></div>`,{w:o.w||560})}

/* ================= hardware drawings ================= */
const PADMAP=['Kick','Snare','Hat','Open','Kick','Snare','Perc','Open','Kick','Snare','Hat','Open','Perc','Hat','Snare','Kick'];
const hwState={latch:false,bank:'A'};
const HWCO={down:'oct',arp:'arp',nr:'nr',daw:'daw',bank:'bank',play:'transport',shift:'shift'};
function hwOn(id){return (id==='arp'&&hw.arp)||(id==='nr'&&hw.nr)||(id==='latch'&&hwState.latch)||(id==='play'&&seq.on)||(id==='daw')}
function keyCenters(start,count){const wh=[];for(let m=start;m<start+count;m++)if(!isBlack(m))wh.push(m);const ww=100/wh.length;let wi=0;const out=[];for(let m=start;m<start+count;m++){if(isBlack(m))out.push(wi*ww);else{out.push(wi*ww+ww/2);wi++}}return out}
function hardware(o={}){const k=K(),h=k.hw,c=o.co||{};if(h.model==='none')return qwerty(o);
 const btn=([l,sh,id])=>`<div class="hw-btn ${id&&hwOn(id)?'on':''} ${id==='play'?'grn':''}" data-b="${id||''}" role="button" tabindex="-1"${id&&HWCO[id]?co(c,HWCO[id]):''}><span>${l}</span>${sh?`<em>${sh}</em>`:'<em>&nbsp;</em>'}</div>`;
 const pitch=h.pitch==='wheels'?`<div class="hw-wheels"${co(c,'pitch')}><div class="hw-wheel" data-w="pitch" aria-label="Pitch wheel"><i></i><b></b></div><div class="hw-wheel" data-w="mod" aria-label="Mod wheel"><i></i><b></b></div></div>`
  :h.pitch==='joystick'?`<div class="hw-joy"${co(c,'pitch')}><b></b></div>`
  :`<div class="hw-strips"${co(c,'pitch')}><div class="hw-strip" data-w="pitch"><i></i></div><div class="hw-strip" data-w="mod"><i></i></div></div>`;
 const left=`<div class="hw-sec" style="min-width:132px"><div class="hw-name">${k.short}<small>${h.keys} keys${h.pads?' · '+h.pads+' pads':''}${h.knobs.length?' · '+h.knobs.length+' knobs':''}</small></div>${pitch}<div class="hw-btns" style="grid-template-columns:repeat(2,auto);justify-content:start">${h.left.map(btn).join('')}</div></div>`;
 let pads='';if(h.pads){const cols=h.padCols,rows=h.pads/cols;const order=[];for(let r=rows-1;r>=0;r--)for(let i=0;i<cols;i++)order.push(r*cols+i);
  pads=`<div class="hw-sec"><div class="hw-pads ${h.pads===16?'p16':''}" style="grid-template-columns:repeat(${cols},auto)"${co(c,'pads')}>${order.map(i=>`<div class="hw-pad" data-lane="${PADMAP[i]}" style="--glow:${(h.glow||[])[i]||'#ff9a3c'}" aria-label="Pad ${i+1}: ${PADMAP[i]}"><span class="pn">${h.padLabels?h.padLabels[i]:''}${h.padShift&&h.padShift[i]?` <span class="ps">${h.padShift[i]}</span>`:''}</span><span class="pl">${PADMAP[i]}</span></div>`).join('')}</div>${h.under.length?`<div class="hw-btns" style="grid-template-columns:repeat(${h.under.length},auto)">${h.under.map(btn).join('')}</div>`:''}</div>`}
 const centre=h.screen?`<div class="hw-sec" style="align-items:center"><div class="hw-screen ${h.oled?'oled':''}"${co(c,'screen')}><span class="hd">${h.screen.hd}</span><b class="hw-bpm">${h.screen.l1}</b><span>${h.screen.l2||cur.bpm+' BPM'}</span></div>${h.encoder?`<div class="hw-enc" aria-hidden="true"></div>`:''}${h.centre?`<div class="hw-btns" style="grid-template-columns:repeat(2,auto)">${h.centre.map(btn).join('')}</div>`:''}</div>`:'';
 const knobs=h.knobs.length?`<div class="hw-knobs" style="grid-template-columns:repeat(${h.knobRow?8:4},auto)"${co(c,'knobs')}>${h.knobs.map((l,i)=>`<div class="hw-kn" data-k="${i}" aria-label="Knob ${i+1}"><i style="--r:${-135+hw.knobs[i]*270}deg"></i><span class="kl">${i+1}${h.knobsShift?` <em>${l}</em>`:''}</span></div>`).join('')}</div>`:'';
 const faders=h.faders?`<div class="hw-faders">${Array.from({length:h.faders},(_,i)=>`<div class="hw-fader" style="--y:${[30,55,20,45][i]}%"><b></b></div>`).join('')}</div>`:'';
 const right=(knobs||h.transport)?`<div class="hw-sec" style="margin-left:auto"><div style="display:flex;gap:14px;align-items:flex-start">${knobs}${faders}</div>${h.transport?`<div class="hw-btns" style="grid-template-columns:repeat(${h.transport.length},auto);margin-top:4px">${h.transport.map(btn).join('')}</div>`:''}</div>`:'';
 const base=(h.keys===49?36:48)+hw.oct*12;
 const labels=h.keyLabels?`<div class="hw-klabels">${keyCenters(48,h.keys).map((x,i)=>`<span class="${i<8?'':'sh'}" style="left:${x}%">${h.keyLabels[i]}</span>`).join('')}</div>`:'';
 return `<div data-ui class="hw ${h.trim?'trim':''}" data-model="${h.model}"><div class="hw-top">${left}${pads}${centre}${right}</div>${labels}<div class="hw-keys" style="${labels?'margin-top:4px':''}"${co(c,'keys')}>${keysHtml(base,h.keys,true)}</div></div>`}
const TYPE={48:'Z',49:'S',50:'X',51:'D',52:'C',53:'V',54:'G',55:'B',56:'H',57:'N',58:'J',59:'M',60:'Q',61:'2',62:'W',63:'3',64:'E',65:'R',66:'5',67:'T',68:'6',69:'Y',70:'7',71:'U',72:'I'};
const KEYOF=Object.fromEntries(Object.entries(TYPE).map(([m,k])=>[k.toLowerCase(),+m]));
function keysHtml(start,count,label){const wh=[];for(let m=start;m<start+count;m++)if(!isBlack(m))wh.push(m);const ww=100/wh.length;let wi=0,h='';for(let m=start;m<start+count;m++){if(isBlack(m))h+=`<div class="b" data-m="${m}" style="left:calc(${wi*ww}% - ${ww*.3}%);width:${ww*.6}%"></div>`;else{h+=`<div class="w" data-m="${m}" style="left:${wi*ww}%;width:${ww}%">${label&&m%12===0?`<span class="lbl">C${Math.floor(m/12)-1}</span>`:''}</div>`;wi++}}return h}
function qwerty(o={}){const c=o.co||{};const rows=[['1','2','3','4','5','6','7','8','9','0'],['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M',',','.']];
 return `<div class="qw" data-ui>${rows.map((r,ri)=>`<div class="qw-r" style="padding-left:${[0,26,40,62][ri]}px"${ri===1?co(c,'upper'):ri===3?co(c,'lower'):''}>${r.map(k=>{const m=KEYOF[k.toLowerCase()];return `<div class="qk ${m===undefined?'':isBlack(m)?'bk':'wk'}" ${m!==undefined?`data-m="${m}"`:''}>${k}<small>${m!==undefined?flName(m):''}</small></div>`}).join('')}</div>`).join('')}</div>`}
function dragY(el,onMove,spring){el.addEventListener('pointerdown',e=>{e.preventDefault();const y0=e.clientY;const mv=ev=>onMove(Math.max(-30,Math.min(30,ev.clientY-y0)));const up=()=>{if(spring)onMove(0);removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)})}
function bindHW(root){
 $$('.hw-pad',root).forEach(p=>{if(p._b)return;p._b=1;p.addEventListener('pointerdown',e=>{e.preventDefault();audio();const fire=()=>{DR[p.dataset.lane](ctx.currentTime,hwState.full?1:.85);p.classList.add('lit');setTimeout(()=>p.classList.remove('lit'),90)};fire();let rt=null;if(hw.nr)rt=setInterval(fire,60/cur.bpm/4*1000);const up=()=>{clearInterval(rt);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};addEventListener('pointerup',up);addEventListener('pointercancel',up)})});
 bindKeys(root);
 $$('.hw-kn',root).forEach(kn=>{if(kn._b)return;kn._b=1;kn.addEventListener('pointerdown',e=>{e.preventDefault();const i=+kn.dataset.k,y0=e.clientY,v0=hw.knobs[i];const mv=ev=>{const v=Math.max(0,Math.min(1,v0+(y0-ev.clientY)/150));hw.knobs[i]=v;$$(`.hw-kn[data-k="${i}"] i`).forEach(x=>x.style.setProperty('--r',(-135+v*270)+'deg'));if(i===0){hw.vol=v;if(master)master.gain.value=v}if(i===1){hw.cut=200*Math.pow(60,v);setCut(hw.cut)}};const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);store.set('knobs',hw.knobs);store.set('vol',hw.vol);store.set('cut',hw.cut)};addEventListener('pointermove',mv);addEventListener('pointerup',up)})});
 $$('.hw-wheel,.hw-strip',root).forEach(w=>{if(w._b)return;w._b=1;dragY(w,y=>{w.style.setProperty('--wy',y+'px')},w.dataset.w==='pitch')});
 $$('.hw-joy',root).forEach(j=>{if(j._b)return;j._b=1;j.addEventListener('pointerdown',e=>{e.preventDefault();const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const mv=ev=>{j.style.setProperty('--jx',Math.max(-14,Math.min(14,ev.clientX-cx))+'px');j.style.setProperty('--jy',Math.max(-14,Math.min(14,ev.clientY-cy))+'px')};mv(e);const up=()=>{j.style.setProperty('--jx','0px');j.style.setProperty('--jy','0px');removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)})});
 $$('.hw-btn',root).forEach(b=>{if(b._b)return;b._b=1;b.addEventListener('click',()=>{const k=b.dataset.b;const all=id=>$$(`.hw-btn[data-b="${id}"]`);
  const msg={undo:'In FL (DAW mode) this is Undo; Shift + it is Redo',loop:'Loop toggles FL\'s loop recording in DAW mode',rec:'Record arms FL\'s recording; Shift + it quantizes',auto:'Automation: records knob moves into FL',shift:'Shift: hold it to reach the red labels',daw:'Plugin/DAW lit red = DAW mode, needed for FL\'s transport and screen',tap:'Tap tempo: tap to set the arp speed',full:'Full Level: every pad hit at full velocity',bank:'Bank A/B switches the pads between two sets of 8'};
  if(k==='arp'){hw.arp=!hw.arp;seq.layers.arp=hw.arp;all('arp').forEach(x=>x.classList.toggle('on',hw.arp));toast(hw.arp?'Arp on: the melody layer plays':'Arp off')}
  else if(k==='nr'){hw.nr=!hw.nr;all('nr').forEach(x=>x.classList.toggle('on',hw.nr));toast(hw.nr?'Note Repeat on: hold a pad to roll it':'Note Repeat off')}
  else if(k==='latch'){hwState.latch=!hwState.latch;all('latch').forEach(x=>x.classList.toggle('on',hwState.latch));toast(hwState.latch?'Latch on: the arp keeps running after you let go':'Latch off')}
  else if(k==='play'){seq.on?stopSeq():startSeq()}
  else if(k==='full'){hwState.full=!hwState.full;all('full').forEach(x=>x.classList.toggle('on',!!hwState.full));toast(msg.full)}
  else if(k==='up'||k==='down'){hw.oct=Math.max(-2,Math.min(2,hw.oct+(k==='up'?1:-1)));$$('.hw').forEach(h=>{const kk=h.querySelector('.hw-keys');const badge=kk.querySelector(':scope>mark.co');const n=$$('[data-m]',kk).length;kk.innerHTML=keysHtml((n===49?36:48)+hw.oct*12,n,true);if(badge)kk.appendChild(badge);bindKeys(h)});toast('Keys now start at C'+(3+hw.oct))}
  else if(msg[k])toast(msg[k])})})}
function bindKeys(root){$$('.hw-keys [data-m],.qk[data-m]',root).forEach(k=>{if(k._b)return;k._b=1;k.addEventListener('pointerdown',e=>{e.preventDefault();playNote(+k.dataset.m,cur.timbre==='saw'?'saw':'keys');k.classList.add('hit');setTimeout(()=>k.classList.remove('hit'),260)})})}
addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.repeat||/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(document.activeElement.tagName))return;
 const q=$('.qw');if(q){const m=KEYOF[e.key.toLowerCase()];if(m!==undefined){playNote(m);$$(`.qk[data-m="${m}"]`).forEach(el=>{el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),200)});return}}
 const sim=$('.sim');if(sim){const map={F5:'Playlist',F6:'Channel rack',F7:'Piano roll',F9:'Mixer'};if(map[e.key]){e.preventDefault();simShow(sim,map[e.key]);return}}
 const sp=$('.slicepads');if(sp&&/^[1-8]$/.test(e.key)){playSlice(+e.key-1);return}
 if(e.code==='Space'){e.preventDefault();seq.on?stopSeq():startSeq()}});

function hwFig(){const k=K(),h=k.hw;
 if(h.model==='none')return fig(qwerty({co:{lower:1,upper:2}}),760,['Bottom rows (Z to M): the lower octave, with S D G H J as black keys.','Top rows (Q to I): the upper octave, with 2 3 5 6 7 as black keys. Type on your keyboard to play.'],'FL\'s typing-keyboard layout. Type to play.');
 const btns=[...(h.left||[]),...(h.under||[]),...(h.centre||[]),...(h.transport||[])];const hasB=id=>btns.some(b=>b[2]===id);
 const m4=h.model==='mpk4';const items=[];const add=(key,cond,text)=>{if(cond)items.push([key,text])};
 add('pitch',1,h.pitch==='wheels'?(m4?'Pitch and mod wheels. Pitch springs back to the middle; mod stays where you leave it.':'Pitch and mod wheels.'):h.pitch==='joystick'?'Joystick: left/right bends pitch, up adds modulation.':'Pitch and mod touch strips: slide a finger up or down.');
 add('oct',hasB('down'),m4?'Oct − / Oct +: move the keys up for melodies, down for 808s. With Shift they are Prog edit and Save.':'Octave buttons: move the keys up for melodies, down for 808s.');
 add('pads',h.pads,m4?'Pads 1–8 in two banks (Bank A/B). The red labels are Shift functions: Prog chng, CC#, Notes, Chords, Chords config, Scales, Scales config.':`${h.pads} pads for drums and samples. Tap them here.`);
 add('arp',hasB('arp'),m4?'Arp (Shift: Config). Latch keeps it running after you let go.':'Arp: turns held chords into patterns.');
 add('nr',hasB('nr'),'Note Repeat: hold it with a pad to roll hi-hats. Try it here: turn it on, then hold a pad.');
 add('screen',!!h.screen,m4?'Screen and push encoder: the program, the last control you touched and its value.':'Screen: shows what you touched and its value.');
 add('daw',hasB('daw'),'Plugin/DAW: lit red means DAW mode, which FL needs for the transport buttons and the screen.');
 add('knobs',h.knobs.length,m4?'8 knobs. Their red Shift labels set the arp: Division, Swing, Mode, Oct, Latch, Sync, Gate, BPM. Here knob 1 is volume and knob 2 filter cutoff for the preview.':'Knobs: link them to anything in FL. Here knob 1 is volume and knob 2 filter cutoff for the preview.');
 add('transport',hasB('play'),m4?'Transport: Undo (Redo), Loop (Global), Stop/Play (Continue), Record (Quantize), Automation. ▶ plays the beat here.':'Transport: start, stop and record FL from the keyboard. ▶ plays the beat here.');
 add('keys',1,m4?'25 keys. The labels above them are Shift functions: arp rate (1/4 to 1/32T), arp mode (Up to Chord), arp octaves 1–4, then Swing, Pattern, Edit, Mutate, Freeze, Sync.':`${h.keys} keys. Tap them to play the current sound.`);
 const c={};items.forEach(([key],i)=>c[key]=i+1);
 return fig(hardware({co:c}),1060,items.map(x=>x[1]),k.short+' (drawing). Everything on it is playable.')}
function controller(o={}){return midiMode()?fit(hardware(o),1060):fit(qwerty(o),760)}

/* ================= mixing & 808: plugin drawings ================= */
const fx=x=>Math.log10(x/20)/Math.log10(1000); // 20 Hz..20 kHz -> 0..1
function eqCurve(w,h,bands){const pts=[];for(let i=0;i<=w;i+=3){const f=20*Math.pow(1000,i/w);let db=0;bands.forEach(b=>{if(b.t==='hp'){db+=-12*Math.log2(Math.max(1,b.f/f))*(f<b.f?1.4:0)}else if(b.t==='bell'){const o=Math.log2(f/b.f);db+=b.g*Math.exp(-(o*o)/(2*b.q*b.q))}else if(b.t==='shelf'){db+=b.g/(1+Math.pow(b.f/f,2))}});pts.push(`${i},${(h/2-db*h/36).toFixed(1)}`)}return pts.join(' ')}
function peq2Mock(o={}){const c=o.co||{},W=620,H=200;const bands=o.bands||[{t:'hp',f:150,n:1},{t:'bell',f:320,g:-4,q:.6,n:3},{t:'bell',f:3000,g:2,q:.7,n:5}];const grid=[50,100,200,500,1000,2000,5000,10000].map(f=>`<line x1="${fx(f)*W}" x2="${fx(f)*W}" y1="0" y2="${H}" stroke="#3a4048"/><text x="${fx(f)*W+3}" y="${H-5}" fill="#9aa3ad" font-family="Barlow Condensed,sans-serif" font-size="12">${f>=1000?f/1000+'k':f}</text>`).join('');
 const dots=bands.map(b=>{const x=fx(b.f)*W,y=H/2-(b.t==='bell'?b.g:b.t==='hp'?-3:b.g)*H/36;return `<circle cx="${x}" cy="${y}" r="8" fill="${['#ff6b6b','#ffb347','#ffe066','#7ee08f','#5fd0ff','#7f8cff','#d68cff'][b.n-1]}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="12" font-weight="700" fill="#111">${b.n}</text>`}).join('');
 return win('Fruity Parametric EQ 2 - '+(o.track||'Chords'),`<div style="background:#1d2024;border-radius:4px;position:relative"${co(c,'graph')}><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block">${grid}<line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" stroke="#555c66"/><polyline points="${eqCurve(W,H,bands)}" fill="none" stroke="#ffb066" stroke-width="2.5"/>${dots}</svg></div>
<div style="display:flex;gap:6px;margin-top:8px;align-items:center">${[1,2,3,4,5,6,7].map(n=>`<span class="fl-b ${bands.some(b=>b.n===n)?'lit':''}" style="min-width:34px"${n===1?co(c,'band'):''}>${n}</span>`).join('')}<span style="margin-left:12px;color:#9aa3ad"${co(c,'type')}>Band 1 type: <b style="color:#fff">High pass</b></span><span style="margin-left:auto;display:flex;gap:6px;align-items:center;color:#9aa3ad"${co(c,'out')}>Output <span class="knob" style="--r:0deg"></span></span></div>`,{w:o.w||660})}
function limiterMock(o={}){const c=o.co||{};const kn=(l,r,k)=>`<span style="display:flex;flex-direction:column;align-items:center;gap:4px"${co(c,k)}><span class="knob" style="width:30px;height:30px;--r:${r}deg"></span><span style="color:#c9ced5;font-weight:700">${l}</span></span>`;
 return win('Fruity Limiter - 808',`<div style="display:flex;gap:4px;margin-bottom:10px"><span class="fl-b">LIMIT</span><span class="fl-b lit"${co(c,'mode')}>COMP</span></div>
<div style="display:flex;gap:16px;align-items:flex-start"><div style="display:flex;gap:16px">${kn('THRESH',-60,'thres')}${kn('RATIO',70,'ratio')}${kn('KNEE',-90,'')}${kn('ATT',-120,'att')}${kn('REL',-30,'rel')}</div>
<div style="margin-left:auto;display:flex;flex-direction:column;gap:6px;align-items:flex-end"><span style="color:#9aa3ad">SIDECHAIN</span><span class="dd" style="min-width:70px"${co(c,'sc')}>1 (Kick)</span></div></div>
<div style="margin-top:10px;background:#1d2024;border-radius:4px;padding:6px"${co(c,'gr')}><svg width="560" height="56" viewBox="0 0 560 56" style="display:block">${Array.from({length:8},(_,i)=>`<path d="M${i*70} 6 L${i*70+4} 44 L${i*70+40} 8 L${i*70+70} 6" fill="none" stroke="#ff6b6b" stroke-width="2"/>`).join('')}<text x="4" y="54" fill="#9aa3ad" font-family="Barlow Condensed,sans-serif" font-size="12">gain reduction: the 808 dips each time the kick hits</text></svg></div>`,{w:o.w||600})}
function fastDistMock(o={}){const c=o.co||{};const kn=(l,r,k)=>`<span style="display:flex;flex-direction:column;align-items:center;gap:4px"${co(c,k)}><span class="knob" style="width:34px;height:34px;--r:${r}deg"></span><span style="color:#c9ced5;font-weight:700">${l}</span></span>`;
 return win('Fruity Fast Dist - 808',`<div style="display:flex;gap:22px;align-items:center;padding:6px 4px">${kn('PRE',40,'pre')}${kn('THRES',-40,'thres')}<span style="display:flex;flex-direction:column;gap:4px;align-items:center"${co(c,'type')}><span class="fl-b lit" style="min-width:30px">A</span><span class="fl-b" style="min-width:30px">B</span><span style="color:#c9ced5;font-weight:700">TYPE</span></span>${kn('MIX',60,'mix')}${kn('POST',-50,'post')}</div>`,{w:o.w||420})}
function meterMock(o={}){const c=o.co||{};return win('Loudness meter (for example Youlean) - Master',`<div style="display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap"><div${co(c,'int')}><div style="color:#9aa3ad">Integrated</div><div style="font:600 34px var(--ui);color:#fff">-8.2 <span style="font-size:15px;color:#9aa3ad">LUFS</span></div></div><div${co(c,'short')}><div style="color:#9aa3ad">Short-term</div><div style="font:600 22px var(--ui);color:#7ee08f">-7.4</div></div><div${co(c,'tp')}><div style="color:#9aa3ad">True peak</div><div style="font:600 22px var(--ui);color:#ffb347">-1.0 dBTP</div></div><div><div style="color:#9aa3ad">Range</div><div style="font:600 22px var(--ui);color:#fff">4.1 LU</div></div></div>
<div style="margin-top:10px;background:#1d2024;border-radius:4px;padding:6px"${co(c,'hist')}><svg width="560" height="60" viewBox="0 0 560 60" style="display:block"><line x1="0" x2="560" y1="16" y2="16" stroke="#ffb347" stroke-dasharray="4 4"/><polyline points="${Array.from({length:57},(_,i)=>`${i*10},${(26+Math.sin(i*.7)*6+(i<8?20-i*2.5:0)).toFixed(0)}`).join(' ')}" fill="none" stroke="#7ee08f" stroke-width="2"/></svg></div>`,{w:o.w||600})}
function sidechainMock(o={}){const c=o.co||{};const strip=(n,i,sel)=>`<div class="mx-s ${sel?'sel':''}" style="width:64px"${i===1?co(c,'kick'):''}><span class="mx-n">${i} ${n}</span><div class="mx-io" style="height:90px"><div class="mx-m"><i style="height:${[0,70,40,30,55][i]}%"></i></div><div class="mx-f" style="--y:30%"><b></b></div></div><span class="mx-route on"${i===4?co(c,'arrow'):''}></span></div>`;
 return `<div class="fl" data-ui style="display:flex;gap:18px;align-items:flex-start">${win('Mixer',`<div class="mx">${['','Kick','Snare','Hats','808'].slice(1).map((n,k)=>strip(n,k+1,k===0)).join('')}</div>`,{w:320})}<div class="menu" style="width:250px;margin-top:70px"${co(c,'menu')}><div>Route to this track only</div><div class="hl"${co(c,'side')}>Sidechain to this track</div><hr><div>Rename, color and icon</div></div></div>`}

/* ================= spectrum + level meter (live) ================= */
let specRAF=null;const fbuf={};
function drawSpec(){const cvs=$$('canvas.spec');const meters=$$('.lvl');if(!cvs.length&&!meters.length){specRAF=null;return}
 if(analyser){if(!fbuf.f||fbuf.f.length!==analyser.frequencyBinCount){fbuf.f=new Float32Array(analyser.frequencyBinCount);fbuf.t=new Float32Array(analyser.fftSize)}analyser.getFloatFrequencyData(fbuf.f);analyser.getFloatTimeDomainData(fbuf.t)}
 const ny=ctx?ctx.sampleRate/2:22050;const live=seq.on||(typeof lb!=='undefined'&&lb.on);
 cvs.forEach(cv=>{const dpr=devicePixelRatio||1,W=cv.clientWidth*dpr,Hh=cv.clientHeight*dpr;if(cv.width!==W)cv.width=W;if(cv.height!==Hh)cv.height=Hh;const g=cv.getContext('2d');const H=Hh-22*dpr;
  g.clearRect(0,0,W,Hh);g.fillStyle='#ffffff';g.fillRect(0,0,W,Hh);
  const ph=fx(150)*W;g.fillStyle='#f1f3f5';g.fillRect(0,0,ph,H);
  g.fillStyle='#e6e8eb';for(const f of [30,60,100,250,500,1000,2500,5000,10000]){g.fillRect(Math.round(fx(f)*W),0,1,H)}g.fillRect(0,H,W,1);
  g.font=`500 ${12*dpr}px "IBM Plex Sans",sans-serif`;g.fillStyle='#5d5f63';g.textBaseline='top';for(const f of [30,60,100,250,500,1000,2500,5000,10000]){const s=f>=1000?f/1000+'k':String(f);g.fillText(s,fx(f)*W+3*dpr,H+5*dpr)}
  g.fillStyle='#8a5a2b';g.fillText('Phones barely play this',6*dpr,6*dpr);
  if(fbuf.f&&live){g.beginPath();for(let x=0;x<=W;x+=2){const f=20*Math.pow(1000,x/W);const bin=Math.min(fbuf.f.length-1,Math.round(f/ny*fbuf.f.length));const db=fbuf.f[bin];const y=H-Math.max(0,Math.min(1,(db+100)/90))*H;x?g.lineTo(x,y):g.moveTo(x,y)}
   g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fillStyle='rgba(194,95,0,.14)';g.fill();g.strokeStyle='#c25f00';g.lineWidth=2*dpr;g.stroke()}
  else{g.fillStyle='#5d5f63';g.textAlign='center';g.font=`500 ${14*dpr}px "IBM Plex Sans",sans-serif`;g.fillText('Press Play to see where the sound sits, from bass to treble',W/2,H/2-8*dpr);g.textAlign='left'}});
 meters.forEach(m=>{let rms=0,pk=0;if(fbuf.t){for(const v of fbuf.t){rms+=v*v;pk=Math.max(pk,Math.abs(v))}rms=Math.sqrt(rms/fbuf.t.length)}const db=rms>0?20*Math.log10(rms):-90,pdb=pk>0?20*Math.log10(pk):-90;m._hold=Math.max(pdb,(m._hold??-90)-.3);
  m.querySelector('.lvl-bar i').style.width=Math.max(0,Math.min(100,(db+40)/40*100))+'%';m.querySelector('.lvl-pk').style.left=Math.max(0,Math.min(100,(m._hold+40)/40*100))+'%';m.querySelector('.lvl-txt').textContent=live?`level ${db.toFixed(1)} dB · peak ${m._hold.toFixed(1)} dB`:'press play to measure'});
 specRAF=requestAnimationFrame(drawSpec)}
function startSpec(){if(!specRAF)specRAF=requestAnimationFrame(drawSpec)}
const specBox=()=>`<canvas class="spec" style="display:block;width:100%;height:150px;border-radius:6px" aria-label="Live frequency spectrum of the preview"></canvas>`;
const levelBox=()=>`<div class="lvl" style="margin-top:10px"><div class="lvl-bar" style="position:relative;height:10px;border-radius:5px;background:var(--active);overflow:hidden"><i style="display:block;height:100%;width:0;background:var(--positive)"></i><b class="lvl-pk" style="position:absolute;top:0;bottom:0;width:2px;background:var(--text);left:0"></b></div><div class="small muted lvl-txt tnum" style="margin-top:4px">press play to measure</div></div>`;

/* ================= 808 lab ================= */
function lab808(){return `<div class="lab" id="lab808"><div class="lab-head"><b>808 lab</b><span class="small muted">Kick and 808 from ${cur.name} at ${cur.bpm} BPM. Change one thing at a time and listen.</span></div>
${specBox()}
<div class="lab-grid">
<label class="lab-ctl"><span>Distortion <b id="v-drive" class="tnum"></b></span><input type="range" id="l-drive" min="0" max="1" step=".01"><small>More harmonics: the 808 starts to show up above 150 Hz, where phones can play it.</small></label>
<label class="lab-ctl"><span>Glide <b id="v-glide" class="tnum"></b></span><input type="range" id="l-glide" min="0" max=".2" step=".005"><small>How long the slide into the octave note takes (Porta's slide time).</small></label>
<label class="lab-ctl"><span>Length <b id="v-len" class="tnum"></b></span><input type="range" id="l-len" min=".2" max="1" step=".05"><small>Short 808s bounce (plugg); long ones carry the low end (rage, trap).</small></label>
<label class="lab-ctl"><span>Tuning <b id="v-det" class="tnum"></b></span><input type="range" id="l-det" min="-60" max="60" step="5"><small>Push it off and hear the low end go muddy against the chords.</small></label>
</div>
<div class="row" style="margin-top:12px"><button class="btn primary" id="l-play">Play</button><label class="chip"><input type="checkbox" id="l-solo"> Kick + 808 only</label><label class="chip"><input type="checkbox" id="l-sc"> Sidechain 808 to kick</label><label class="chip"><input type="checkbox" id="l-phone"> Phone speaker</label><button class="btn" id="l-reset">Reset</button></div></div>`}
function bindLab808(){const L=$('#lab808');if(!L)return;const set=()=>{$('#l-drive').value=MIX.drive;$('#l-glide').value=MIX.glide;$('#l-len').value=MIX.len;$('#l-det').value=MIX.detune;$('#l-solo').checked=MIX.solo808;$('#l-sc').checked=MIX.sc;$('#l-phone').checked=MIX.phone;$('#v-drive').textContent=Math.round(MIX.drive*100)+'%';$('#v-glide').textContent=Math.round(MIX.glide*1000)+' ms';$('#v-len').textContent=Math.round(MIX.len*100)+'%';$('#v-det').textContent=(MIX.detune>0?'+':'')+MIX.detune+' cents'};set();
 const on=(id,k,f)=>$(id).addEventListener('input',e=>{MIX[k]=f(e.target);dcurve=null;audio();applyMix();set()});
 on('#l-drive','drive',t=>+t.value);on('#l-glide','glide',t=>+t.value);on('#l-len','len',t=>+t.value);on('#l-det','detune',t=>+t.value);on('#l-solo','solo808',t=>t.checked);on('#l-sc','sc',t=>t.checked);on('#l-phone','phone',t=>t.checked);
 $('#l-play').onclick=()=>{seq.on?stopSeq():startSeq();$('#l-play').textContent=seq.on?'Stop':'Play';startSpec()};$('#l-reset').onclick=()=>{['drive','glide','len','detune','sc','phone','solo808'].forEach(k=>MIX[k]=MIXDEF[k]);audio();applyMix();set();toast('808 lab reset')};startSpec()}

/* ================= mix lab ================= */
const ROUGH={fader:{Kick:.95,Snare:.95,Hats:.95,'808':.95,Chords:.95,Melody:.95},cut:{Kick:false,Snare:false,Hats:false,'808':false,Chords:false,Melody:false},send:{Kick:0,Snare:0,Hats:0,'808':0,Chords:0,Melody:0},sc:false,limit:false};
function mixLab(){return `<div class="lab" id="mixlab"><div class="lab-head"><b>Mix lab</b><span class="small muted">The ${cur.name} beat on six mixer tracks. Start from the rough mix, then fix it one move at a time.</span></div>
<div class="row" style="margin-bottom:10px"><button class="btn primary" id="m-play">Play</button><button class="btn" id="m-rough">Load rough mix</button><button class="btn" id="m-fin">Load finished mix</button><label class="chip"><input type="checkbox" id="m-phone"> Phone speaker</label></div>
<div class="tablewrap"><table class="mixtable"><thead><tr><th>Track</th><th>Fader</th><th>Low cut</th><th>Reverb send</th></tr></thead><tbody>${BUSNAMES.map(n=>`<tr><td><b>${n}</b></td><td><input type="range" min="0" max="1" step=".01" data-f="${n}" aria-label="${n} fader"> <span class="tnum small muted" data-fv="${n}"></span></td><td>${MIX.lowcut[n]?`<label><input type="checkbox" data-c="${n}"> ${MIX.lowcut[n]} Hz</label>`:'<span class="muted small">keep the lows</span>'}</td><td><input type="range" min="0" max=".5" step=".01" data-s="${n}" aria-label="${n} reverb send"></td></tr>`).join('')}</tbody></table></div>
<div class="row" style="margin-top:10px"><label class="chip"><input type="checkbox" id="m-sc"> Sidechain 808 to kick</label><label class="chip"><input type="checkbox" id="m-lim"> Master limiter</label></div>
<div style="margin-top:12px">${specBox()}${levelBox()}</div></div>`}
function bindMixLab(){const L=$('#mixlab');if(!L)return;const sync=()=>{$$('[data-f]',L).forEach(i=>{i.value=MIX.fader[i.dataset.f];L.querySelector(`[data-fv="${i.dataset.f}"]`).textContent=(MIX.fader[i.dataset.f]>0?(20*Math.log10(MIX.fader[i.dataset.f])).toFixed(1):'-∞')+' dB'});$$('[data-c]',L).forEach(i=>i.checked=MIX.cut[i.dataset.c]);$$('[data-s]',L).forEach(i=>i.value=MIX.send[i.dataset.s]);$('#m-sc').checked=MIX.sc;$('#m-lim').checked=MIX.limit;$('#m-phone').checked=MIX.phone};sync();
 const upd=()=>{audio();applyMix();sync()};
 $$('[data-f]',L).forEach(i=>i.addEventListener('input',()=>{MIX.fader[i.dataset.f]=+i.value;upd()}));$$('[data-c]',L).forEach(i=>i.addEventListener('change',()=>{MIX.cut[i.dataset.c]=i.checked;upd()}));$$('[data-s]',L).forEach(i=>i.addEventListener('input',()=>{MIX.send[i.dataset.s]=+i.value;upd()}));
 $('#m-sc').onchange=e=>{MIX.sc=e.target.checked;upd()};$('#m-lim').onchange=e=>{MIX.limit=e.target.checked;upd()};$('#m-phone').onchange=e=>{MIX.phone=e.target.checked;upd()};
 $('#m-rough').onclick=()=>{Object.assign(MIX,JSON.parse(JSON.stringify(ROUGH)));upd();toast('Rough mix: everything loud, nothing cut')};
 $('#m-fin').onclick=()=>{['fader','cut','send','sc','limit'].forEach(k=>MIX[k]=JSON.parse(JSON.stringify(MIXDEF[k])));upd();toast('Finished mix loaded')};
 $('#m-play').onclick=()=>{MIX.solo808=false;seq.on?stopSeq():startSeq();$('#m-play').textContent=seq.on?'Stop':'Play';startSpec()};startSpec()}
function bindLabs(){bindLab808();bindMixLab();if($('canvas.spec'))startSpec()}
function delayTable(bpm){const q=60000/bpm;const rows=[['1/4 note',q],['1/8 note',q/2],['Dotted 1/8',q*.75],['1/8 triplet',q/3],['1/16 note',q/4],['1 bar',q*4]];return `<div class="tablewrap"><table><thead><tr><th>Note value at ${bpm} BPM</th><th class="num">Milliseconds</th><th>Use it for</th></tr></thead><tbody>${rows.map(([n,ms],i)=>`<tr><td>${n}</td><td class="num">${ms.toFixed(0)} ms</td><td class="muted">${['Slow echoes on a lead, delay throws on vocals','The standard echo for bells and plucks','Bouncy echoes that fill gaps','Rolling, swung echoes','Short slap on snares and claps','Reverb decay that clears before the next bar'][i]}</td></tr>`).join('')}</tbody></table></div>`}

/* ================= site dropdown (listbox) =================
   Button + popover list, keyboard accessible: Enter/Space/Arrow opens, arrows move, Enter selects, Esc closes. */
const DDH={};
function ddHtml(id,opts,cls=''){const s=opts.find(o=>o.sel)||opts[0];return `<div class="dd2 ${cls}" data-dd="${id}" data-v="${s.v}"><button type="button" class="dd2-btn" id="dd-${id}" aria-haspopup="listbox" aria-expanded="false"><span class="dd2-l">${s.l}</span><svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><ul class="dd2-list" role="listbox" aria-labelledby="dd-${id}" tabindex="-1" hidden>${opts.map((o,i)=>`<li role="option" id="dd-${id}-${i}" data-v="${o.v}" aria-selected="${o===s}">${o.l}</li>`).join('')}</ul></div>`}
const ddEl=id=>document.querySelector(`[data-dd="${id}"]`);
function ddVal(id){return ddEl(id)?.dataset.v}
function ddOn(id,f){DDH[id]=f}
function ddSet(id,v,fire){const el=ddEl(id);if(!el)return;const li=el.querySelector(`li[data-v="${CSS.escape(String(v))}"]`);if(!li)return;el.dataset.v=String(v);el.querySelector('.dd2-l').textContent=li.textContent;$$('li',el).forEach(x=>x.setAttribute('aria-selected',x===li));if(fire&&DDH[id])DDH[id](String(v))}
function ddClose(el,focus){if(!el)return;const list=el.querySelector('.dd2-list'),btn=el.querySelector('.dd2-btn');list.hidden=true;btn.setAttribute('aria-expanded','false');el.classList.remove('open');if(focus)btn.focus()}
function ddOpen(el){$$('.dd2.open').forEach(o=>o!==el&&ddClose(o));const list=el.querySelector('.dd2-list'),btn=el.querySelector('.dd2-btn');list.hidden=false;btn.setAttribute('aria-expanded','true');el.classList.add('open');
 const r=btn.getBoundingClientRect();el.classList.toggle('up',window.innerHeight-r.bottom<Math.min(320,list.scrollHeight+16)&&r.top>window.innerHeight/2);
 const cur=list.querySelector('[aria-selected="true"]')||list.querySelector('li');ddFocus(el,cur);list.focus({preventScroll:true});cur&&cur.scrollIntoView({block:'nearest'})}
function ddFocus(el,li){$$('li',el).forEach(x=>x.classList.toggle('act',x===li));if(li){el.querySelector('.dd2-list').setAttribute('aria-activedescendant',li.id);li.scrollIntoView({block:'nearest'})}}
document.addEventListener('click',e=>{const btn=e.target.closest('.dd2-btn');const li=e.target.closest('.dd2-list li');const el=e.target.closest('.dd2');
 if(btn){const d=btn.closest('.dd2');d.classList.contains('open')?ddClose(d):ddOpen(d);return}
 if(li&&el){ddSet(el.dataset.dd,li.dataset.v,true);ddClose(el,true);return}
 $$('.dd2.open').forEach(o=>ddClose(o))});
document.addEventListener('keydown',e=>{const el=e.target.closest&&e.target.closest('.dd2');if(!el)return;const open=el.classList.contains('open');const items=$$('li',el);const act=el.querySelector('li.act');const i=items.indexOf(act);
 if(!open&&e.target.classList.contains('dd2-btn')&&['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();ddOpen(el);return}
 if(!open)return;
 if(e.key==='ArrowDown'){e.preventDefault();ddFocus(el,items[Math.min(items.length-1,i+1)])}else if(e.key==='ArrowUp'){e.preventDefault();ddFocus(el,items[Math.max(0,i-1)])}
 else if(e.key==='Home'){e.preventDefault();ddFocus(el,items[0])}else if(e.key==='End'){e.preventDefault();ddFocus(el,items[items.length-1])}
 else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(act){ddSet(el.dataset.dd,act.dataset.v,true)}ddClose(el,true)}
 else if(e.key==='Escape'||e.key==='Tab'){if(e.key==='Escape')e.preventDefault();ddClose(el,e.key==='Escape')}
 else if(e.key.length===1){const k=e.key.toLowerCase();const hit=items.find((x,j)=>j>i&&x.textContent.toLowerCase().startsWith(k))||items.find(x=>x.textContent.toLowerCase().startsWith(k));if(hit)ddFocus(el,hit)}},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-midi-connect]');if(b){e.preventDefault();midiConnect()}});

/* ================= MIDI keyboard input (Web MIDI) =================
   Chrome, Edge and Opera support Web MIDI; Safari does not. Input is routed to: the practice engine when it is
   listening, otherwise straight to sound (keys -> synth, pads -> drums) and to the drawings on screen. */
const MIDI={access:null,inputs:[],state:'off',listeners:new Set(),ccMap:store.get('ccMap',{}),down:new Set()};
const midiSupported=()=>!!navigator.requestMIDIAccess;
function midiStatusText(){if(!midiSupported())return'Keyboard input needs Chrome or Edge';if(MIDI.state==='on'&&MIDI.inputs.length)return MIDI.inputs.map(i=>i.name).join(', ');if(MIDI.state==='on')return'No keyboard found. Plug it in';if(MIDI.state==='denied')return'Keyboard access was blocked';return'Connect your keyboard'}
function midiUI(){$$('[data-midi-status]').forEach(el=>{el.textContent=midiStatusText();el.closest('.midi-pill')?.classList.toggle('on',MIDI.state==='on'&&MIDI.inputs.length>0)})}
async function midiConnect(){if(!midiSupported()){toast('Use Chrome or Edge to play along with your keyboard');midiUI();return}
 try{MIDI.access=await navigator.requestMIDIAccess({sysex:false});MIDI.state='on';const bind=()=>{MIDI.inputs=[...MIDI.access.inputs.values()];MIDI.inputs.forEach(i=>i.onmidimessage=midiMessage);midiUI()};bind();MIDI.access.onstatechange=bind;
  toast(MIDI.inputs.length?'Connected: '+MIDI.inputs.map(i=>i.name).join(', '):'Allowed. Plug in your keyboard')}catch(e){MIDI.state='denied';midiUI();toast('Keyboard access was blocked. Allow MIDI for this site in the browser settings')}}
/* pads: MIDI channel 10, or notes 36-51 sent by a pad bank, map to drum lanes */
const PAD_LANES=['Kick','Snare','Hat','Open','Kick','Snare','Perc','Open','Kick','Snare','Hat','Open','Perc','Hat','Snare','Kick'];
const isPadMsg=(ch,note)=>ch===9||(prof.kb!=='big'&&note>=36&&note<=51&&MIDI.padMode);
MIDI.padMode=false;
function midiMessage(e){const [st,a,b]=e.data;const type=st&0xf0,ch=st&0x0f;
 if(type===0x90&&b>0)return inputNote({note:a,vel:b/127,ch,src:'midi',pad:isPadMsg(ch,a)});
 if(type===0x80||(type===0x90&&b===0))return inputNoteOff({note:a,ch,src:'midi',pad:isPadMsg(ch,a)});
 if(type===0xb0)return inputCC(a,b/127);
 if(type===0xe0){const v=((b<<7)|a)/8192-1;$$('.hw-wheel[data-w="pitch"],.hw-strip[data-w="pitch"]').forEach(w=>w.style.setProperty('--wy',(-v*24)+'px'));$$('.hw-joy').forEach(j=>j.style.setProperty('--jx',(v*14)+'px'))}}
function inputNote(n){for(const l of MIDI.listeners)if(l.onNote&&l.onNote(n)===true)return;MIDI.down.add(n.note);audio();
 if(n.pad){const lane=PAD_LANES[(n.note-36+160)%16]||'Kick';DR[lane](ctx.currentTime,.5+.5*n.vel);$$(`.hw-pad[data-lane="${lane}"]`).slice(0,1).forEach(x=>{x.classList.add('lit');setTimeout(()=>x.classList.remove('lit'),110)})}
 else{tone(ctx.currentTime+.005,n.note,.9,cur.timbre==='saw'?'saw':'keys',.6+.6*n.vel,'Melody');$$(`.hw-keys [data-m="${n.note}"],.qk[data-m="${n.note}"],.pr-k[data-m="${n.note}"]`).forEach(k=>k.classList.add('hit'))}}
function inputNoteOff(n){MIDI.down.delete(n.note);for(const l of MIDI.listeners)if(l.onNoteOff&&l.onNoteOff(n)===true)return;$$(`.hw-keys [data-m="${n.note}"],.qk[data-m="${n.note}"],.pr-k[data-m="${n.note}"]`).forEach(k=>k.classList.remove('hit'))}
/* knobs: the first eight CC numbers a controller sends become knobs 1-8 (learned, saved) */
function inputCC(cc,v){if(cc===64)return;let idx=MIDI.ccMap[cc];if(idx==null){const used=Object.values(MIDI.ccMap);for(let i=0;i<8;i++)if(!used.includes(i)){idx=i;break}if(idx==null)return;MIDI.ccMap[cc]=idx;store.set('ccMap',MIDI.ccMap)}
 hw.knobs[idx]=v;$$(`.hw-kn[data-k="${idx}"] i`).forEach(x=>x.style.setProperty('--r',(-135+v*270)+'deg'));if(idx===0){hw.vol=v;if(master)master.gain.value=v}if(idx===1){setCut(200*Math.pow(60,v))}}
/* computer keyboard as a fallback instrument everywhere (when not typing in a field) */
const QWERTY_PADS={a:0,s:1,d:2,f:3,g:4,h:5,j:6,k:7};

/* ================= music theory unit (interactive) ================= */
const kbWidget=(id,start=48,count=25)=>fit(`<div class="hw" data-ui style="width:880px;padding:12px"><div class="hw-keys kbw" id="${id}" style="margin:0">${keysHtml(start,count,true)}</div></div>`,880);
function kbShow(id,ms,labels){const el=document.getElementById(id);if(!el)return;$$('[data-m]',el).forEach(k=>{const m=+k.dataset.m;k.classList.toggle('hit',ms.includes(m));const old=k.querySelector('.nl');if(old)old.remove();if(labels&&ms.includes(m)){const s=document.createElement('span');s.className='nl';s.textContent=typeof labels==='function'?labels(m):NN[m%12];k.appendChild(s)}})}
function playMs(ms,spread=0,dur=1.1){audio();ms.forEach((m,i)=>tone(ctx.currentTime+.01+i*spread,m,dur,'keys',.9,'Melody'))}
const QUAL={'Major':[0,4,7],'Minor':[0,3,7],'Diminished':[0,3,6],'Major 7':[0,4,7,11],'Minor 7':[0,3,7,10],'Dominant 7':[0,4,7,10],'Minor 9':[0,3,7,10,14],'Major 9':[0,4,7,11,14]};
const QSYM={'Major':'','Minor':'m','Diminished':'dim','Major 7':'maj7','Minor 7':'m7','Dominant 7':'7','Minor 9':'m9','Major 9':'maj9'};
const ddOpts=(arr,val)=>arr.map(([v,l])=>({v:String(v),l,sel:String(v)===String(val)}));
const THEORY=[
{id:'notes',mod:'Music theory',title:()=>'Notes and the keyboard',min:15,practice:['find-c'],body:()=>`
<p>Music uses 12 notes, then repeats them higher and lower. On a keyboard the pattern is easy to see: groups of two and three black keys. <b>C</b> is always the white key just left of a group of two black keys.</p>
${kbWidget('kbNotes')}
<div class="row" style="margin-top:8px"><button class="btn" data-show="white">Show the white keys</button><button class="btn" data-show="black">Show the black keys</button><button class="btn" data-show="c">Show every C</button></div>
<h2>Names</h2><p>The white keys are C D E F G A B. A black key is named after its neighbours: the one above C is <b>C#</b> (C sharp), which is the same key as <b>Db</b> (D flat). FL Studio uses sharps.</p>
<p>From one C to the next is an <b>octave</b>. Notes an octave apart sound like the same note, higher or lower. That is why an 808 an octave below a chord still fits.</p>
<h2>Octave numbers: FL is different</h2><p>Most keyboards and music books call middle C <b>C4</b>. FL Studio calls the same key <b>C5</b>. Same note, different label: if a tutorial says C4 and FL shows C5, nothing is wrong. This site uses FL's names inside the FL drawings.</p>
<h2>Half steps and whole steps</h2><p>Moving to the very next key, black or white, is a <b>half step</b> (a semitone). Two half steps make a <b>whole step</b>. E to F and B to C are half steps with no black key between them. Scales and chords are built from these steps.</p>`},
{id:'scales',mod:'Music theory',title:()=>'Scales and keys',min:20,practice:['c-major','a-minor'],body:()=>`
<p>A <b>scale</b> is a set of notes that sound right together. The song's <b>key</b> is the scale it uses plus its home note (the root). Stay in the key and nothing clashes.</p>
<div class="row" id="scaleCtl"><span class="small muted">Root</span>${ddHtml('scRoot',ddOpts(NN.map((n,i)=>[i,n]),0))}<span class="small muted">Scale</span>${ddHtml('scType',ddOpts([['Major','Major'],['Natural minor','Natural minor'],['Harmonic minor','Harmonic minor'],['Dorian (R&B minor)','Dorian'],['Minor pentatonic','Minor pentatonic']],'Major'))}<button class="btn primary" id="scPlay">Play it</button></div>
${kbWidget('kbScale')}
<p class="small muted" id="scSteps"></p>
<h2>The two you will use most</h2>
<div class="tablewrap"><table><thead><tr><th>Scale</th><th>Steps from the root</th><th>Sound</th></tr></thead><tbody><tr><td>Major</td><td class="mono">W W H W W W H</td><td>Bright, happy: plugg, some R&B</td></tr><tr><td>Natural minor</td><td class="mono">W H W W H W W</td><td>Dark, serious: trap, rage, drill</td></tr></tbody></table></div>
<p>W is a whole step, H a half step. C major is all the white keys from C; A minor is the same white keys starting from A. Keys that share notes like this are <b>relative</b> major and minor.</p>
<h2>Three more for flavour</h2><ul><li><b>Harmonic minor</b>: natural minor with the 7th raised a half step. That one note gives the sinister, eastern sound in a lot of dark trap.</li><li><b>Dorian</b>: natural minor with the 6th raised. Minor but warmer: a lot of R&B lives here.</li><li><b>Minor pentatonic</b>: five notes, no clashes possible. The safest scale for a first melody.</li></ul>
${tip('In FL','Piano roll → View → Helpers → Scale highlighting. Pick the same root and scale and FL shades the in-key rows, so every note you draw on a shaded row is in key.')}`},
{id:'chords',mod:'Music theory',title:()=>'Chords',min:25,practice:['triads'],body:()=>`
<p>A chord is three or more notes played together. Build one by stacking every other note of the scale: the root, the 3rd and the 5th make a <b>triad</b>.</p>
<div class="row" id="chCtl"><span class="small muted">Root</span>${ddHtml('chRoot',ddOpts(NN.map((n,i)=>[i,n]),9))}<span class="small muted">Type</span>${ddHtml('chQual',ddOpts(Object.keys(QUAL).map(q=>[q,q]),'Minor'))}<span class="small muted">Inversion</span>${ddHtml('chInv',ddOpts([[0,'Root position'],[1,'1st inversion'],[2,'2nd inversion']],0))}<button class="btn primary" id="chPlay">Play it</button></div>
${kbWidget('kbChord')}
<p id="chInfo" class="small muted"></p>
<h2>Major vs minor</h2><p>The difference is one note. A <b>major</b> triad is root, 4 half steps up, then 3 more (C E G). A <b>minor</b> triad is root, 3 half steps, then 4 (C Eb G). Try switching between them above: the middle note moves and the mood flips.</p>
<h2>Sevenths and ninths</h2><p>Keep stacking and you get 7th and 9th chords. They sound softer and more complex: <b>minor 7</b> and <b>major 7</b> chords are the sound of R&B and pluggnb. Rage and trap usually stay with plain triads, which hit harder under distortion.</p>
<h2>Inversions keep your hand still</h2><p>An <b>inversion</b> moves the bottom note to the top. The chord keeps its name but changes shape, which lets you go from one chord to the next by moving each finger as little as possible. On 25 keys that matters.</p>`},
{id:'progressions',mod:'Music theory',title:()=>'Chord progressions',min:25,practice:['am-f-c-g','pluggnb-chords'],body:()=>`
<p>A <b>progression</b> is a chain of chords that repeats under the beat. Every key has seven chords that come from its scale. Musicians number them with Roman numerals, so the same pattern works in any key: upper case is major, lower case is minor, ° is diminished.</p>
<div class="row"><span class="small muted">Key</span>${ddHtml('pgRoot',ddOpts(NN.map((n,i)=>[i,n]),9))}${ddHtml('pgType',ddOpts([['Natural minor','Minor'],['Major','Major']],'Natural minor'))}</div>
<div class="chordrow" id="pgChords"></div>
${kbWidget('kbProg')}
<h2>Progressions to start from</h2><p>These show up across a lot of music. They are starting points, not rules: tap one to hear it in the key above.</p>
<div class="list" id="pgCommon"></div>
<h2>Why some chords lead to others</h2><p>The <b>V</b> chord pulls back to <b>I</b> (or <b>v</b> to <b>i</b> in minor); that pull is what makes a progression feel like it resolves. Harmonic minor turns v into a major V, which makes the pull much stronger. That is the G major in the Dark trap recipe (key of C minor).</p>`},
{id:'rhythm',mod:'Music theory',title:()=>'Rhythm and melody',min:25,practice:['hook','half-time'],body:()=>`
<p>A bar of 4/4 has four beats. Each beat splits into four 16th notes, counted <b>1 e & a, 2 e & a, 3 e & a, 4 e & a</b>. That is the 16-step grid in FL's Channel Rack: one step is one 16th.</p>
<div class="rgrid" id="rgGrid">${Array.from({length:16},(_,i)=>`<button class="rg ${[0,8].includes(i)?'on':''}" data-i="${i}" aria-pressed="${[0,8].includes(i)}"><b>${['1','e','&','a'][i%4]==='1'?(i/4+1):['1','e','&','a'][i%4]}</b></button>`).join('')}</div>
<div class="row" style="margin-top:10px"><button class="btn primary" id="rgPlay">Play</button><label class="small muted" for="rgSwing">Swing</label><input type="range" id="rgSwing" min="0" max=".6" step=".05" value="0" style="accent-color:var(--hue)"><span class="small muted">BPM</span>${ddHtml('rgBpm',ddOpts([[70,'70'],[90,'90'],[140,'140'],[160,'160']],140))}</div>
<p class="small muted">Click steps to place hits. Steps 1 and 9 (beats 1 and 3) are on: at 140 BPM that is the half-time trap feel.</p>
<h2>Half-time, triplets and swing</h2><ul><li><b>Half-time</b>: at 140–160 BPM, putting the snare on beat 3 instead of 2 and 4 makes the beat feel half as fast. Trap and rage live here.</li><li><b>Triplets</b>: three even notes in the space of two. Hi-hat triplet rolls are the classic trap move: in FL's piano roll set the snap to 1/3 step.</li><li><b>Swing</b>: delays every second 16th a little. Drag the slider above and listen to the grid loosen up. FL's Channel Rack has the same Swing knob.</li></ul>
<h2>Writing a melody</h2><ol class="steps"><li>Stay in the key: use the shaded rows (View → Helpers → Scale highlighting).</li><li>Put <b>chord notes</b> on the strong beats (1 and 3). Notes between them can pass through other scale notes.</li><li>Keep it short: two bars is plenty. Repeat it.</li><li><b>Call and answer</b>: play the phrase, then repeat it with a different ending. Most hooks work like this.</li><li>Leave space. Rests are part of the melody, and they leave room for the artist.</li></ol>`}
];
function bindTheory(){
 if($('#kbNotes')){$$('[data-show]').forEach(b=>b.onclick=()=>{const t=b.dataset.show;const ms=[];for(let m=48;m<=72;m++){if(t==='white'&&!isBlack(m))ms.push(m);if(t==='black'&&isBlack(m))ms.push(m);if(t==='c'&&m%12===0)ms.push(m)}kbShow('kbNotes',ms,true);playMs(t==='c'?ms:ms.slice(0,8),.12,.5)})}
 if($('#kbScale')){const show=play=>{const r=+ddVal('scRoot'),sc=SCALES[ddVal('scType')];const ms=sc.map(x=>48+r+x).concat([60+r]).map(m=>m>72?m-12:m);kbShow('kbScale',ms,true);const steps=[];const full=sc.concat([12]);for(let i=1;i<full.length;i++){const d=full[i]-full[i-1];steps.push(d===1?'H':d===2?'W':d===3?'W+H':d+'')}$('#scSteps').textContent=`${NN[r]} ${ddVal('scType')}: ${sc.map(x=>NN[(r+x)%12]).join(' ')}  ·  steps ${steps.join(' ')}`;if(play)playMs(sc.map(x=>60+r+x).concat([72+r]),.22,.4)};show(false);['scRoot','scType'].forEach(i=>ddOn(i,()=>show(true)));$('#scPlay').onclick=()=>show(true)}
 if($('#kbChord')){const show=play=>{const r=+ddVal('chRoot'),q=ddVal('chQual'),inv=+ddVal('chInv');let ms=QUAL[q].map(x=>57+((r-9+12)%12)+x);for(let i=0;i<inv;i++){ms.push(ms.shift()+12)}while(Math.max(...ms)>72)ms=ms.map(m=>m-12);while(Math.min(...ms)<48)ms=ms.map(m=>m+12);kbShow('kbChord',ms,true);
   $('#chInfo').textContent=`${NN[r]}${QSYM[q]}: ${ms.map(m=>NN[m%12]).join(' ')}. Half steps from the root: ${QUAL[q].join(', ')}.`;if(play)playMs(ms,0,1.4)};show(false);['chRoot','chQual','chInv'].forEach(i=>ddOn(i,()=>show(true)));$('#chPlay').onclick=()=>show(true)}
 if($('#pgChords')){const COMMON={'Natural minor':[['i – VI – III – VII',[0,5,2,6],'Dark and driving: a lot of trap and rage'],['i – iv – v',[0,3,4],'Bare and moody'],['i – VII – VI – VII',[0,6,5,6],'Rocking back and forth']],'Major':[['I – V – vi – IV',[0,4,5,3],'Pop and plugg'],['IV – iii – ii – I',[3,2,1,0],'Soft and descending: pluggnb with 7ths'],['ii – V – I',[1,4,0],'Jazz and R&B resolution']]};
  const chordsIn=()=>{const r=+ddVal('pgRoot'),t=ddVal('pgType'),sc=SCALES[t];return sc.map((_,d)=>{const ns=[0,2,4].map(o=>{const ix=d+o;return r+sc[ix%7]+12*Math.floor(ix/7)});const iv=[ns[1]-ns[0],ns[2]-ns[0]];const q=iv[0]===4?'':iv[1]===6?'°':'m';const rn=['I','II','III','IV','V','VI','VII'][d];return{name:NN[ns[0]%12]+(q==='m'?'m':q==='°'?'dim':''),rn:q===''?rn:rn.toLowerCase()+(q==='°'?'°':''),ms:ns.map(m=>{let x=m+48;while(x>67)x-=12;return x})}})};
  const draw=()=>{const cs=chordsIn();const box=$('#pgChords');box.innerHTML=cs.map((c,i)=>`<button class="chordbtn" data-pg="${i}">${c.name}<small>${c.rn}</small></button>`).join('');$$('[data-pg]',box).forEach(b=>b.onclick=()=>{const c=cs[+b.dataset.pg];kbShow('kbProg',c.ms,true);playMs(c.ms,0,1.2);$$('.chordbtn',box).forEach(x=>x.classList.toggle('now',x===b))});
   const t=ddVal('pgType');$('#pgCommon').innerHTML=COMMON[t].map(([n,idx,d],k)=>`<button class="lrow" data-cp="${k}" style="width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--rule);font:inherit;cursor:pointer"><span class="t">${n}</span><span class="d">${idx.map(i=>cs[i].name).join(' – ')} · ${d}</span><span class="r">Play</span></button>`).join('');
   $$('[data-cp]').forEach(b=>b.onclick=()=>{const idx=COMMON[t][+b.dataset.cp][1];audio();idx.forEach((ci,k)=>{const c=cs[ci];setTimeout(()=>{kbShow('kbProg',c.ms,true);playMs(c.ms,0,1)},k*1000)})})};draw();['pgRoot','pgType'].forEach(i=>ddOn(i,draw))}
 if($('#rgGrid')){const lane=$('#rgGrid');let on=false,timer=null;$$('.rg',lane).forEach(b=>b.onclick=()=>{b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));audio();DR.Snare(ctx.currentTime,.7)});
  $('#rgPlay').onclick=()=>{if(on){clearInterval(timer);on=false;$('#rgPlay').textContent='Play';$$('.rg',lane).forEach(x=>x.classList.remove('now'));return}audio();on=true;$('#rgPlay').textContent='Stop';let step=0,next=ctx.currentTime+.05;timer=setInterval(()=>{const bpm=+ddVal('rgBpm'),sd=60/bpm/4,sw=+$('#rgSwing').value;while(next<ctx.currentTime+.1){const i=step%16;const t=next+(i%2?sw*sd*.5:0);const btns=$$('.rg',lane);if(btns[i]&&btns[i].classList.contains('on'))DR[i%8===0&&i===0?'Kick':'Snare'](t,1);DR.Hat(t,i%2?.35:.6);const ii=i;setTimeout(()=>{$$('.rg',lane).forEach((x,k)=>x.classList.toggle('now',k===ii))},Math.max(0,(t-ctx.currentTime)*1000));next+=sd;step++}},25)}}
}

/* ================= lessons ================= */
const demoDrums=[{name:'Kick',lane:'Kick',pat:'x.....x...x.....',color:'#ff7a59',trk:1},{name:'Clap',lane:'Snare',pat:'........x.......',color:'#ffcf5a',trk:2},{name:'Hat',lane:'Hat',pat:'x.x.x.x.x.x.rrx.',color:'#7fd1ff',trk:3},{name:'Open hat',lane:'Open',pat:'..............x.',color:'#a28bff',trk:4}];
const amChords=[['A3','C4','E4'],['F3','A3','C4'],['E3','G3','C4'],['D3','G3','B3']].flatMap((ns,b)=>ns.map(n=>({m:midiOf(n),s:b*16,l:16,v:.75})));
const hatRoll=(()=>{const o=[];for(let i=0;i<26;i+=2)o.push({m:66,s:i,l:1,v:i%4?.55:.95});for(let k=0;k<6;k++)o.push({m:66+Math.floor(k/2),s:26+k*(2/3),l:.6,v:.5+k*.08});return o})();
const LESSONS=[
{id:'start',mod:'Start',title:()=>'Start here',min:5,body:()=>`
<p>This course takes you from an empty FL Studio project to a finished, mixed, exported beat. Every lesson is written for <b>${K().name}</b>${midiMode()?'':' (no-keyboard path)'}. Change it any time in <a href="#setup">My setup</a>.</p>
${hwFig()}
<h2>How the course works</h2>
<ol class="steps">
<li><b>Set up</b> FL Studio, audio and ${midiMode()?'your keyboard':'the typing keyboard'} (lessons 1–2).</li>
<li><b>Learn the windows</b> with drawn FL screens that point at every button you need (lesson 3), then just enough theory to play chords on 25 keys (lesson 4).</li>
<li><b>Build each layer</b>: drums, 808s, melodies, arrangement and mixing (lessons 5–9).</li>
<li><b>Make real beats</b> with the <a href="#beats">Beat recipes</a>: each one opens as FL windows that play, using sounds from your plugins.</li>
</ol>
<h2>What you need</h2>
<ul><li>FL Studio (any edition; the trial works but cannot reopen saved projects until you buy).</li><li>Wired headphones or speakers.</li><li>${midiMode()?`Your ${K().short} and its USB cable.`:'Nothing else. A $50–$120 mini keyboard later speeds you up a lot.'}</li><li>The free plugins you want from the <a href="#plugins">Plugins</a> page. Every recipe also works with stock FL plugins.</li></ul>
${tip('Why a keyboard matters','Clicking notes in gives you beats that sound clicked in. Playing parts in, even badly, gives you human timing and velocity, and you find melodies by accident.')}
<div class="row" style="margin-top:20px"><a class="btn primary" href="#setup">Set my keyboard & plugins</a><a class="btn" href="#lesson-install">Go to lesson 1</a></div>`},

{id:'install',mod:'Setup',title:()=>'Install FL Studio and set up audio',min:15,body:()=>`
<ol class="steps">
<li>Download FL Studio from <a href="https://www.image-line.com/fl-studio-download/" target="_blank" rel="noopener">image-line.com</a> and install it. ${prof.os==='mac'?'On Mac it installs as one app with VST and AU support.':'On Windows, keep the defaults (it installs the FL Studio ASIO driver).'}</li>
<li>Open FL and go to <b>Options → Audio settings</b> (or press ${kbd('F10')} and click the Audio tab). You get this window:</li></ol>
${fig(dlgAudio({co:{device:1,buffer:2,rate:3,tabs:4}}),560,[prof.os==='mac'?'Device: choose your headphones or audio interface (Core Audio).':'Device: choose <b>FL Studio ASIO</b>, or your interface\'s own ASIO driver.','Buffer length: start at about 256 samples. Lower = keys feel tighter; higher = fewer crackles. Raise it to 512–1024 when mixing big projects.','Sample rate: 44,100 or 48,000 Hz. Pick one and keep it.','Tabs: MIDI is where your keyboard goes in the next lesson.'],'Settings → Audio (drawing of the FL window)')}
<ol class="steps" start="3">
<li>Go to <b>Options → File settings</b>. Note the <b>Backup</b> folder: FL autosaves there, which is where you find a lost beat.</li>
<li>Make a folder <code>Beats/</code> with <code>Projects</code>, <code>Exports</code>, <code>Samples</code>, <code>Drum kits</code>. In File settings, add Samples and Drum kits under <b>Browser extra search folders</b> so they show in the Browser (lesson 3).</li>
</ol>
${tip('Bluetooth headphones','Bluetooth adds delay, so playing keys feels late. Use wired headphones or speakers while recording.')}
<h2>Install free plugins</h2>
<ol class="steps"><li>Pick plugins on the <a href="#plugins">Plugins</a> page and install them (${prof.os==='mac'?'AU or VST3':'VST3, default folder'}).</li><li>In FL: <b>Options → Manage plugins</b>, tick <b>Verify plugins</b>, then click <b>Find plugins</b>. Star the ones you use.</li><li>Check: Channel Rack → <b>+</b>, and your new synth is in the list.</li></ol>
<ul class="check"><li><input type="checkbox" id="c-install-1"><label for="c-install-1">FL makes sound through my headphones</label></li><li><input type="checkbox" id="c-install-2"><label for="c-install-2">Buffer is set, no crackles</label></li><li><input type="checkbox" id="c-install-3"><label for="c-install-3">My Samples folder shows in the Browser</label></li></ul>`},

{id:'midi',mod:'Setup',title:()=>midiMode()?`Connect your ${K().short}`:'Play notes without a keyboard',min:20,body:()=>{const k=K();return path(`
<p>${k.summary}</p>
${hwFig()}
<h2>Connect it</h2>
${k.hw.model==='mpk4'?`<ol class="steps"><li>Update to <b>FL Studio 2024 or newer</b>. Akai's guide says earlier versions do not support the Mini IV.</li><li>Install Akai's <b>MPK mini IV FL Studio script</b> from the <b>inMusic Software Center</b> (Hardware tab), with FL closed.</li><li>Plug the keyboard in with USB-C, open FL and go to <b>Options → MIDI settings</b> (${kbd('F10')}, MIDI tab). The Mini IV appears twice: a MIDI port and a DAW port.</li></ol>
${fig(dlgMidi({mpk4:true,co:{input:1,enable:2,type:3,dawrow:4,daw:5,sync:6}}),600,['Select the <b>MIDI</b> port in the Input list.','Click <b>Enable</b>.','Set its Controller type to <b>AKAI MPK Mini IV MIDI</b> and give it a port number (1). Its Output entry uses the same number.','Select the <b>DAW</b> port in the Input list and Enable it.','Set its Controller type to <b>AKAI MPK Mini IV DAW</b> with a different port number (2), and the same number on its Output entry.','Leave Send master sync on for the DAW output so the arp and Note Repeat follow FL\'s tempo.'],'Settings → MIDI for the MPK Mini IV (drawing). Older guide versions call the DAW port MIDIIN2 / MIDIOUT2.')}
<ol class="steps" start="4"><li>On the keyboard, press <b>Plugin/DAW</b> until it lights <b>red</b> (DAW mode).</li><li>Unplug and replug the keyboard, then reopen FL. The transport buttons now start, stop and record FL, and the screen follows what you touch.</li><li>Add <b>FLEX</b> to the Channel Rack (<b>+</b>), click it so it is selected, and play a key. FL plays whatever channel is selected.</li></ol>`
:`<ol class="steps"><li>Plug it in with USB. It is class-compliant, so no driver is needed.</li><li>In FL open <b>Options → MIDI settings</b> (${kbd('F10')}, then the MIDI tab).</li></ol>
${fig(dlgMidi({co:{input:1,enable:2,type:3,rescan:4,sync:5}}),560,[`Input list: click <b>${k.short}</b>.`,'Click <b>Enable</b>.','Controller type: pick your model if FL lists it (some makers publish an FL script), otherwise <b>(generic controller)</b>. Notes, pads and pitch work either way.','Not listed? Click <b>Rescan devices</b>, or replug the keyboard and restart FL.','Output: pick the keyboard, set a port number, and tick <b>Send master sync</b> so its arp follows FL\'s tempo.'],'Settings → MIDI (drawing)')}
<ol class="steps" start="3"><li>Add <b>FLEX</b> to the Channel Rack (<b>+</b> button), click it so it is selected, and play a key. FL plays whatever channel is selected.</li></ol>`}
${warn('No sound?','Check the channel is selected (its name is highlighted), the Input row is enabled, and no other app (like the maker\'s editor) is holding the keyboard. Unplug, close FL, plug in, reopen.')}
<h2>Pads → drums with FPC</h2>
<ol class="steps"><li>Add <b>FPC</b> to the Channel Rack. It loads with a default kit.</li><li>Hit the pads. ${k.padNote}</li><li>Drag your own kick, snare and hats from the Browser onto FPC's pads.</li><li>Pad plays nothing? It is probably on the other bank. Switch banks.</li></ol>
<h2>Knobs → anything</h2>
${fig(menuLink({co:{knob:1,link:2,dlg:3,accept:4}}),720,['Right-click any knob in FL (a synth\'s cutoff, a mixer fader).','Choose <b>Link to controller…</b>','Turn a physical knob. FL detects it (here CC #71).','Click <b>Accept</b>. That knob now moves that control.'],'Linking a knob (drawing of the FL menus)')}
<p>For many controls at once: press ${kbd(mod()+'+J')} (<i>Multilink to controllers</i>), wiggle each FL control and then each knob, and press ${kbd(mod()+'+J')} again. Good first mappings: lead filter cutoff, reverb send, 808 volume.</p>
<h2>Pitch, mod, octaves, sustain</h2>
<p>${k.pitch[0].toUpperCase()+k.pitch.slice(1)} works right away on instruments that respond to pitch bend. 25 keys is two octaves: use ${k.oct} to move up for melodies and down for bass. ${k.sustain}</p>
<h2>Note Repeat & arpeggiator</h2><p>${k.repeat} Try it on the drawing in <a href="#lesson-start">Start here</a>: turn on <b>Note rpt</b> and hold a pad.</p>
${tip('Velocity','Pads and keys are velocity-sensitive. For drums that should hit the same every time, turn on Full Level, or flatten velocities in the piano roll afterwards.')}
<h2>Test it in the browser</h2><p>Press keys on your keyboard. If this viewer allows Web MIDI (Chrome works best) the keys below light up. FL does not need this.</p>
<div class="row"><button class="btn" id="midiTest">Listen for my keyboard</button><span class="muted small" id="midiStatus"></span></div>${fit(`<div class="hw" data-ui style="width:880px;padding:12px"><div class="hw-keys" id="testKeys" style="margin:0">${keysHtml(48,25,true)}</div></div>`,880)}
`,`
<h2>Typing keyboard</h2>
${fig(toolbar({typing:1},{typing:true,hint:'Typing keyboard to piano keyboard'}),1080,['Click the keyboard icon or press '+kbd(mod()+'+T')+' to turn on <b>Typing keyboard to piano</b>.'],'FL toolbar (drawing)')}
${fig(qwerty({co:{lower:1,upper:2}}),760,['Lower octave: Z X C V B N M are white keys, S D G H J are black keys.','Upper octave: Q W E R T Y U I are white keys, 2 3 5 6 7 are black keys.'],'Type on your keyboard to hear it')}
<p>Select an instrument in the Channel Rack and type. You can record exactly like with a MIDI keyboard. All notes come in at one velocity, so vary them afterwards in the piano roll.</p>
<h2>Drums without pads</h2><p>Use the step sequencer in the Channel Rack (click steps on) and the piano roll. Many producers program drums this way anyway.</p>
<h2>Faster mouse work</h2><ul><li>Piano roll tools: <kbd>P</kbd> draw, <kbd>B</kbd> paint, <kbd>D</kbd> delete, <kbd>C</kbd> slice, <kbd>E</kbd> select.</li><li>The <b>Stamp</b> tool places whole chords with one click (lesson 4).</li><li>Right-click a knob → <b>Create automation clip</b> to move it over time.</li></ul>`)}},

{id:'tour',mod:'FL Studio basics',title:()=>'Find your way around FL',min:25,body:()=>`
<p>FL has five windows you will use all the time. This is a working stand-in: click the window buttons on the toolbar (item 6), or press <kbd>F5</kbd> <kbd>F6</kbd> <kbd>F7</kbd> <kbd>F9</kbd>, to switch windows like in FL. Press <kbd>Space</kbd> to play.</p>
<div class="sim">${fig(toolbar({menu:1,patsong:2,transport:3,tempo:4,pattern:5,windows:6,metro:7},{active:'Channel rack'}),1080,['Menus: File (save, export), Options (audio and MIDI settings), Tools.','<b>PAT / SONG</b>: Play loops the current pattern, or plays the whole Playlist. Toggle with <kbd>L</kbd>. Most "why won\'t it play?" moments are this switch.','Play, stop, record. <kbd>Space</kbd> plays/stops; <kbd>R</kbd> arms recording.','Tempo (BPM). Drag up/down or double-click to type.','Pattern selector: pick or name patterns (F2 renames).','Window buttons: Playlist, Piano roll, Browser, Channel rack, Mixer. Click them.','Metronome, countdown before recording, typing keyboard.'],'FL toolbar (drawing)')}
<div class="sim-area"><div>${fit(browser('Packs'),220)}<p class="small muted" style="margin:6px 0 0"><b>Browser</b> (${kbd(alt()+'+F8')}): <b>Packs</b> holds FL's sounds; <b>Samples (yours)</b> is the folder you added in lesson 1. Drag sounds into the Channel Rack.</p></div><div class="sim-win"></div></div>
<div class="panel sim-text small" style="margin-top:6px"></div></div>
<h2>Patterns: the idea that unlocks FL</h2>
<p>A <b>pattern</b> is a block of notes for any channels (say 4 bars of drums). Make patterns, then paint them into the Playlist to build the song. Keep one pattern per part: <i>Drums A</i>, <i>808 A</i>, <i>Chords</i>, <i>Melody</i>. Name and colour them.</p>
<h2>Your first 10 minutes</h2>
<ol class="steps"><li><b>File → New from template → Minimal → Empty</b>.</li><li>Set tempo to 140.</li><li>Drag a kick, clap and hat from <b>Packs</b> into the Channel Rack.</li><li>Click steps: kick on 1, 7 and 11; clap on 9; hats on every odd step. Press <kbd>Space</kbd>.</li><li>Save with ${kbd(mod()+'+S')}, named with BPM and key, e.g. <code>rage_160_F#m.flp</code>.</li></ol>
${tip('Give each sound its own mixer track','Select all channels in the Channel Rack and press '+kbd(mod()+'+L')+'. Each gets its own mixer insert; the number box on each row shows which.')}`},

{id:'drums',mod:'Building the beat',title:()=>'Drums and hi-hat rolls',min:35,body:()=>`
<h2>Choose a kit</h2><p>Drums are samples. FL's Packs work; for modern sounds add free kits (check each licence before selling). You want 2–3 kicks, a snare and clap, closed and open hats, percs, an 808, crashes and FX.</p>
<h2>The Channel Rack</h2>
${fig(channelRack(demoDrums,{co:{led:1,vol:2,trk:3,name:4,steps:5,plus:6,swing:7}}),640,['Mute light: click to mute/unmute a channel.','Pan and volume knobs for that channel.','Mixer insert number: which mixer track the sound goes to.','Channel name: click to open the sound; right-click → Piano roll.','Step buttons: 16 per bar. Click on/off. The colour groups are beats 1–4.','<b>+</b>: add instruments (FPC, FLEX, your plugins).','<b>Swing</b>: delays every second 16th for groove.'],'Channel Rack (drawing). A basic trap pattern.')}
<h2>Program the groove</h2>
${path(`<ol class="steps"><li>Load your kit into <b>FPC</b> (drag samples onto pads).</li><li>Turn on the metronome (${kbd(mod()+'+M')}) and the recording count-in (${kbd(mod()+'+P')}).</li><li>Right-click the record button and make sure <b>Notes</b> and <b>Automation</b> are ticked, press <kbd>R</kbd> to arm recording, press Play, and play kick and snare on the pads for 4 bars.</li><li>Stop. Open the piano roll and press ${prof.os==='mac'?kbd('Opt+Cmd+Q'):kbd('Ctrl+Q')} to quick-quantize. Leave hats a little loose.</li><li>Turn on <b>Recording Blend</b> on the toolbar (${kbd(mod()+'+B')}) so a second pass adds notes instead of replacing them, then record the hats.</li></ol>`,`<ol class="steps"><li>Drag kick, snare and hat into the Channel Rack.</li><li>Click steps like the drawing above.</li><li>For detail, right-click a channel → <b>Piano roll</b> and draw with a finer snap (1/2 step = 32nds, 1/3 step = triplets).</li></ol>`)}
<h2>Half-time: why trap snares sit on beat 3</h2><p>At 140–165 BPM, put the snare on <b>step 9</b> (beat 3), not on 2 and 4. It feels half as fast, which leaves room for fast hats and flows.</p>
<h2>Hi-hat rolls in the piano roll</h2>
${fig(pianoRoll(hatRoll,{channel:'Hat',bars:2,lo:62,hi:71,h:150,snap:'1/3 step',co:{snap:1,slice:2,vel:3,grid:4}}),860,['Snap: set to <b>1/3 step</b> for triplets or <b>1/2 step</b> for 32nds before drawing rolls.','Slice / Chop: cut one long hat note into equal pieces (Tools → Chop).','Velocity: lower offbeat hats so the groove breathes.','The roll at the end of bar 2 steps up in pitch. Select notes and press Shift+↑ to raise them a semitone.'],'Hat roll in the piano roll (drawing)')}
${midiMode()?tip('On your '+K().short,K().repeat):''}
${tip('Layering','A clap layered over the snare, both at the same time, gives a fuller backbeat. EQ each so one gives crack and one gives body.')}`},

{id:'808',mod:'Building the beat',title:()=>'808s: tune, glide, distort, fit',min:50,body:()=>`
<p>The 808 is a long, low sine-like tone with a punchy start. Its main note, the <b>fundamental</b>, sits around 30–60 Hz. That is the part you feel in a car, and the part a phone speaker cannot play at all. Getting an 808 right means four things: it is <b>in tune</b>, it <b>moves</b> with the song, it is <b>heard on small speakers</b>, and it <b>does not fight the kick</b>.</p>
${lab808()}
<h2>Pick the right 808</h2>
<div class="tablewrap"><table><thead><tr><th>Style</th><th>808 to choose</th><th>Why</th></tr></thead><tbody>
<tr><td>Rage, trap</td><td>Long, distorted, with a hard attack</td><td>It carries the whole low end and the hook's energy</td></tr>
<tr><td>Plugg, pluggnb</td><td>Short, round, clean</td><td>Quick bouncy notes leave space for bells and chords</td></tr>
<tr><td>R&B</td><td>Soft sub or a bass guitar sound</td><td>Warmth without the boom covering the vocal</td></tr>
</tbody></table></div>
<p>Most 808 samples have their note in the file name ("808 Boom (F#)"). If not, you will find it in the next step.</p>
<h2>Tune it</h2>
<ol class="steps"><li>Drag the 808 into the Channel Rack and open the channel (click its name).</li><li>Load a piano on another channel. Play the 808's lowest note together with piano notes until one sounds like the same note, not a wobble. That is its real pitch.</li><li>If FL plays it on the wrong key, open the channel's MISC tab and right-click the matching key on the preview keyboard: that sets the root note. Now the C key plays a C, and the 808 follows your chords.</li><li>Check it against the chords: in the 808 lab above, move <b>Tuning</b> off and back. An out-of-tune 808 sounds like mud, not like a wrong note, which is why people miss it.</li></ol>
<h2>Make it glide</h2>
${fig(chSettings({co:{func:1,mono:2,porta:3,slide:4,root:5,ins:6}}),480,['Open the MISC (miscellaneous) tab of the 808 channel settings.','<b>Mono</b>: one 808 note at a time. Overlapping notes never stack into mud.','<b>Porta</b>: overlapping notes glide from one pitch to the next.','Slide time: how long the glide takes. The 808 lab\'s Glide slider is this knob.','Root note: the key that plays the sample at its real pitch.','INS tab: the volume envelope. A short release stops the 808 cleanly at the end of each note.'],'Sampler channel settings (drawing)')}
<p>With Mono and Porta on, a glide happens whenever two notes overlap in the piano roll. Three moves cover most trap and rage basslines:</p>
<ul><li><b>Octave jump</b>: the root, then the same note an octave up on the last 8th of the bar, sliding back down.</li><li><b>Slide into the downbeat</b>: a short note a few semitones below the next chord's root, overlapping into it.</li><li><b>Dive</b>: the last note of a phrase bent down an octave with ${K().pitch}, recorded as automation.</li></ul>
${fig(pianoRoll(bassNotes(RMAP.rage),{channel:'808',co:{grid:1,note:2,ghost:3},coNote:4,lo:34,hi:52,h:180}),860,['Each note sits on the chord\'s root, mostly with the kick.','Pink note: the octave jump. With Porta on it slides there and back.','Turn on ghost channels (View → Helpers, Alt+V) to see the chords behind the 808 while you write.'],'808 line from the Rage recipe (drawing)')}
<h2>Make it heard on phones</h2>
<p>Distortion adds harmonics: copies of the note at 2×, 3×, 4× its pitch. A 45 Hz 808 gains energy at 90, 135 and 180 Hz, which phone speakers can play. Your ear fills in the missing low note. Turn on <b>Phone speaker</b> in the 808 lab, then move Distortion from 0 to 60% and watch the green shape grow out of the red zone.</p>
${fig(fastDistMock({co:{pre:1,thres:2,type:3,mix:4,post:5}}),420,['PRE: how hard you push into the distortion.','THRES: lower = more clipping.','TYPE A or B: two distortion shapes. Pick by ear.','MIX: blend clean and distorted. 40–70% keeps the weight and adds the bite.','POST: bring the level back down after distorting.'],'Fruity Fast Dist on the 808 track (drawing)')}
<p>Other good options: ${plug('blood')} (warmer), ${plug('soundgood')} (quick and loud), or the distortion in ${plug('khe')}. Put the distortion <b>before</b> any EQ on the 808 track.</p>
<h2>Stop the kick and 808 fighting</h2>
<p>Both live in the same low frequencies. When they hit at once they either add up and clip, or cancel and go thin. Three fixes, from simplest:</p>
<ol class="steps"><li><b>Arrange it</b>: start 808 notes with the kick and make the kick short; or put the 808 between kicks.</li><li><b>Pick partners</b>: a kick with a high click and little boom works with a long 808; a big boomy kick works with a short 808.</li><li><b>Sidechain</b>: the 808 ducks for a moment every time the kick hits. Try it in the 808 lab and listen to the start of each kick.</li></ol>
${fig(sidechainMock({co:{kick:1,arrow:2,side:3}}),620,['Select the <b>Kick</b> mixer track.','Right-click the routing arrow at the bottom of the <b>808</b> track.','Choose <b>Sidechain to this track</b>. The kick now feeds the 808 track without being heard on it.'],'Sending the kick to the 808 track as a sidechain (drawing)')}
${fig(limiterMock({co:{mode:1,thres:2,ratio:3,att:4,rel:5,sc:6,gr:7}}),600,['On the 808 track, open Fruity Limiter and switch to <b>COMP</b>.','THRES: lower it until the 808 visibly dips on each kick.','RATIO: 4:1 to 10:1. Higher ducks harder.','ATT: as fast as it goes, so the duck starts with the kick.','REL: 80–150 ms. Too long and the 808 pumps; too short and it clicks.','SIDECHAIN: pick the Kick track number here. Without this, it ducks on itself.','The gain reduction graph should dip in time with the kick.'],'Fruity Limiter in COMP mode, keyed by the kick (drawing)')}
<h2>Finish the 808 track</h2>
<ul><li><b>Mono</b>: turn the 808 track's stereo separation fully to mono. Low end must be centred or it disappears on club systems and phones.</li><li><b>EQ</b>: a high-pass at about 25 Hz removes rumble nobody hears but the limiter reacts to. Do not boost the lows; turn the track up instead.</li><li><b>Level</b>: the 808 is often the loudest thing in the mix. Peak around −6 dB on its track and let the kick poke through on top.</li><li><b>Check</b>: put ${plug('wavecandy')} or ${plug('span')} on the master and look for one clean low bump, not two.</li></ul>
<div class="tablewrap"><table><thead><tr><th>Problem</th><th>Likely cause</th><th>Fix</th></tr></thead><tbody>
<tr><td>Low end sounds muddy</td><td>808 out of tune with the chords</td><td>Set the root note; check against a piano</td></tr>
<tr><td>808 disappears on phones</td><td>Pure sub, no harmonics</td><td>Add distortion, 40–70% mix</td></tr>
<tr><td>Kick vanishes when the 808 plays</td><td>Both fighting at 40–80 Hz</td><td>Sidechain, a clickier kick, or a shorter 808</td></tr>
<tr><td>Clicks at note starts</td><td>Sample starts mid-wave, or very short attack</td><td>Small fade-in on the sample, or a 1–2 ms attack</td></tr>
<tr><td>Notes overlap into a drone</td><td>Mono off</td><td>Turn on Mono, set Max to 1</td></tr>
<tr><td>Master limiter pumping</td><td>Too much sub rumble</td><td>High-pass the 808 at 25 Hz, lower its track</td></tr>
</tbody></table></div>`},

{id:'melody',mod:'Building the beat',title:()=>'Melodies, chords and sound choice',min:40,body:()=>{const lead=pick(['vital','sytrus','harmor','sawer','3xosc']);const keys=pick(['labs','decent','flex','flkeys']);return `
<h2>Choose sounds first</h2><p>Best lead option for you: <b>${lead.p.n}</b>${lead.owned?'':' (free download)'}. Keys and pianos: <b>${keys.p.n}</b>${keys.owned?'':' (free download)'}. FLEX is the shortcut to good presets: browse by category, preview, and stop when something makes you want to play.</p>
<h2>Record a part</h2>
${fig(menuRec({co:{menu:3,notes:4}}),1080,['Record button (or <kbd>R</kbd>).','Metronome and countdown: turn both on before recording.','Right-click the record button for the recording filter.','Tick <b>Notes</b> and <b>Automation</b> for a MIDI keyboard.'],'Recording (drawing)')}
${path(`<ol class="steps"><li>Select the instrument, check the record filter has Notes ticked (right-click the record button), press <kbd>R</kbd>, then Play.</li><li>Play the recipe chords. Loop recording keeps the pattern going so you can try again.</li><li>Open the piano roll, delete bad takes, ${prof.os==='mac'?kbd('Opt+Cmd+Q'):kbd('Ctrl+Q')} to tighten timing (quick quantize).</li><li>Melody: a 2-bar phrase using chord notes. Repeat it and change the last 2 notes the second time. That call-and-answer is most hooks.</li><li>Turn knobs while recording and FL records them as automation.</li></ol>
<h3>Use the arpeggiator</h3><p>Hold a chord with the ${K().short}'s arp on (Up, 1/16) and you get an instant plugg or rage melody. FL records the notes it outputs. Or use <b>piano roll → Tools → Arpeggiate</b> on chords you already wrote, which gives you this:</p>`,
`<ol class="steps"><li>Draw chords with <b>Stamp</b>, or type them and record.</li><li>Draw a melody using notes from the chord under it (ghost channels help: View → Helpers, Alt+V).</li><li><b>Tools → Arpeggiate</b> on chords to generate a melody, then delete notes so it breathes. Result below.</li><li>Drag velocities so it does not sound robotic.</li></ol>`)}
${fig(pianoRoll(arpNotes(RMAP.pluggnb),{channel:'Bell',co:{grid:1,vel:2}}),860,['The Pluggnb chords broken into single notes in 1/8s.','Velocity: all at 70% here. Vary them by hand for feel.'],'Arpeggiated melody (drawing)')}
<h2>Quick sound design: a rage lead</h2><ol class="steps"><li>${lead.p.n==='Vital'?'In Vital: oscillator 1 = saw, unison <b>7 voices</b>, detune about 30%; oscillator 2 an octave up, quieter.':lead.p.n==='3x Osc'?'In 3x Osc: all three oscillators on saw, detune 2 and 3 slightly, one an octave up.':'Init patch with two detuned saws, one an octave up.'}</li><li>Low-pass at 60–70%, a little reverb and distortion.</li><li>${plug('ott')} or ${plug('soundgood')} to push it forward; ${plug('supermassive')} or ${plug('reeverb')} on a send.</li><li>Mono-legato with a little glide for sliding rage leads.</li></ol>
<h2>Chops</h2><p>Drag a vocal or melody loop into ${plug('slicex')} or ${plug('slicer')}. Each slice maps to a key or pad, so you can ${midiMode()?'finger-drum':'sequence'} chops. Use only samples you have rights to if you sell.</p>`}},

{id:'arrange',mod:'Building the beat',title:()=>'Arrange a full beat',min:30,body:()=>`
<p>A loop is not a beat. An artist needs sections that change. Switch to <b>SONG</b> mode and build it in the Playlist (${kbd('F5')}).</p>
${fig(playlist({co:{ruler:1,marker:2,track:3,pattern:4,dropout:5}}),860,['Bar numbers. This beat is 96 bars, about 2:25 at 160 BPM.','Markers: Playlist menu → Time markers → Add time marker (Alt+T). Name them Hook, Verse.','Tracks: one per part (Melody, Drums, 808…) keeps it readable.','Pattern clips: select a pattern and paint it in with the brush.','Drop-out (dashed box): drums gone for one bar before the second hook. That is what makes a hook land.'],'Playlist arrangement (drawing)')}
<div class="tablewrap"><table><thead><tr><th>Section</th><th>Bars</th><th>What plays</th></tr></thead><tbody><tr><td>Intro</td><td>8</td><td>Melody/chords only, filtered. Producer tag here.</td></tr><tr><td>Hook</td><td>16</td><td>Everything.</td></tr><tr><td>Verse</td><td>16</td><td>Thinner melody, drum variation (Drums B), bouncier 808 (808 B).</td></tr><tr><td>Hook / Verse / Hook</td><td>16 each</td><td>Repeat with new fills and drop-outs.</td></tr><tr><td>Outro</td><td>8</td><td>Strip back to the intro.</td></tr></tbody></table></div>
<ol class="steps"><li>Make patterns: <i>Melody</i>, <i>Drums</i>, <i>Drums B</i>, <i>808 A</i>, <i>808 B</i>, <i>FX</i>.</li><li>Paint them in like the drawing.</li><li>Transitions: reversed crash into the hook, a riser, a filter sweep (automate ${plug('loveph')}), or ${has('grossbeat')?plug('grossbeat')+' tape-stop presets.':'a tape stop with '+plug('grossbeat')+' (Signature) or by automating pitch.'}</li></ol>
${tip('Keep it moving','Change something every 4 or 8 bars: a hat pattern, an 808 variation, a counter-melody, a fill.')}`},

{id:'mix',mod:'Finishing',title:()=>'Mixing in depth',min:70,body:()=>`
<p>Mixing is making every part audible at once. Most of a good mix is levels and cuts; plugins only finish the job. Work through this page in order, in the mix lab first, then in FL.</p>
${mixLab()}
<h2>1. Route everything</h2>
<p>Select all channels in the Channel Rack and press ${kbd(mod()+'+L')}: each sound gets its own mixer track. Name and colour them. Then route all drums to one <b>drum bus</b> track (select the drum tracks, right-click the bus's routing arrow → <b>Route to this track only</b>) so you can process and turn them up together.</p>
${fig(mixer({co:{strip:1,meter:2,fader:3,fx:4,send:5,master:6}}),860,['Each sound on its own mixer track.','Meters: green is fine; red at the top means that track is too loud.','Fader: the level. Do most of the mix here.','Effect slots run top to bottom: EQ, then compression, then saturation, then anything else.','Routing arrows: send a track to a bus or the reverb track.','Master: everything ends here.'],'Mixer (drawing). Meters move with the preview.')}
<h2>2. Levels first, and leave headroom</h2>
<ol class="steps"><li>Pull every fader down. Bring up the kick to around −10 dB on its meter.</li><li>Bring in the 808 until kick and 808 feel like one hit, then the snare, then the main melody, then everything else.</li><li>The master should peak around −6 dB before any master plugins. That space is headroom for the limiter.</li><li>In the mix lab, load the <b>rough mix</b>: everything at full volume, nothing cut. Hear how the hats and chords bury the 808. Pull the hats and chords down first.</li></ol>
<h2>3. EQ: cut space, then shape</h2>
<p>Each sound gets a range of frequencies to itself. Cut what a sound does not need before boosting anything.</p>
${fig(peq2Mock({track:'Chords',co:{graph:1,band:2,type:3,out:4}}),660,['The curve. Bands are the numbered dots: drag them.','Band 1 set as a high-pass: removes everything below about 150 Hz from the chords, so the 808 owns it.','Band types: high-pass, low shelf, peak, high shelf, low-pass. Pick per band.','Output: keep the level the same before and after so you judge the change, not the volume.'],'Fruity Parametric EQ 2 on the chords (drawing): low cut at 150 Hz, a small dip at 320 Hz, a small lift at 3 kHz')}
<div class="tablewrap"><table><thead><tr><th>Sound</th><th>Low cut</th><th>Cut if muddy or harsh</th><th>Lift for character</th></tr></thead><tbody>
<tr><td>Kick</td><td>Around 30 Hz</td><td>250–400 Hz (boxy)</td><td>50–80 Hz thump, 2–5 kHz click</td></tr>
<tr><td>808</td><td>Around 25 Hz</td><td>200–400 Hz if distortion gets messy</td><td>Use distortion, not EQ boosts</td></tr>
<tr><td>Snare, clap</td><td>100–150 Hz</td><td>400–800 Hz (honky)</td><td>200 Hz body, 2–5 kHz crack</td></tr>
<tr><td>Hats, percs</td><td>300–500 Hz</td><td>3–5 kHz (harsh)</td><td>8–12 kHz air</td></tr>
<tr><td>Chords, pads</td><td>150–250 Hz</td><td>250–500 Hz (mud)</td><td>2–4 kHz presence</td></tr>
<tr><td>Lead, bells</td><td>200–300 Hz</td><td>2–4 kHz if it pokes too hard</td><td>4–6 kHz shine</td></tr>
<tr><td>Space for a vocal</td><td colspan="3">Keep 1–4 kHz calm in everything else, so a rapper or singer sits on top</td></tr>
</tbody></table></div>
<p>In the mix lab, turn the low cuts on one by one with the 808 playing and watch the spectrum: the low area clears and the 808 gets louder without touching its fader.</p>
<h2>4. Compression: control and glue</h2>
<div class="tablewrap"><table><thead><tr><th>Control</th><th>What it does</th><th>Drum bus start</th></tr></thead><tbody>
<tr><td>Threshold</td><td>Level where squashing starts</td><td>Lower until it reduces 2–4 dB on hits</td></tr>
<tr><td>Ratio</td><td>How hard it squashes above the threshold</td><td>2:1 to 4:1</td></tr>
<tr><td>Attack</td><td>How fast it grabs a hit</td><td>10–30 ms: lets the punch through first</td></tr>
<tr><td>Release</td><td>How fast it lets go</td><td>Time it to breathe with the beat (60–150 ms)</td></tr>
</tbody></table></div>
<p>Use ${plug('comp')} or ${plug('limiter')} in COMP mode on the drum bus. If the drums lose their snap, the attack is too fast. For melodies, ${plug('ott')} is a popular shortcut for bright, upfront synths; use it at 20–40% depth.</p>
<h2>5. Space: reverb and delay on sends</h2>
<p>Make one <b>Reverb</b> track and one <b>Delay</b> track, then send sounds to them with the send knobs, rather than loading a reverb on every track. Everything then sits in the same room, and you save CPU. Keep the kick and 808 dry.</p>
${delayTable(cur.bpm)}
<p>The table uses the current beat's tempo (${cur.bpm} BPM). Fruity Delay 3 syncs to tempo on its own; use these numbers for reverb pre-delay (a 1/16 or 1/32 keeps the vocal clear) and decay (about a bar, so it clears in time). In the mix lab, raise the chords' and melody's reverb sends to about 0.2–0.3 and hear them sit behind the drums.</p>
<h2>6. Width</h2>
<ul><li>Centre: kick, 808, snare, main vocal and the main hook.</li><li>Wide: pads, chords, background vocals, FX. Use ${plug('stereo')} or a chorus.</li><li>Check in mono now and then (Wave Candy or a mono button on the master): if a sound vanishes, it is too wide.</li></ul>
<h2>7. The master: loud enough, not crushed</h2>
${fig(meterMock({co:{int:1,short:2,tp:3,hist:4}}),600,['Integrated loudness over the whole song. Rap and trap beats usually land around −9 to −6 LUFS; R&B a little quieter, −11 to −8.','Short-term loudness: watch it on the hook.','True peak: keep it at or below −1 dB so it does not distort after conversion to MP3 or streaming.','Loudness over time: the hook should be the loudest part.'],'Loudness meter on the master (drawing)')}
<ol class="steps"><li>Last on the master: ${plug('limiter')} (or ${plug('maximus')}). Set its ceiling to −1 dB.</li><li>Raise its gain until the meter reaches your target. Stop when the 808 starts to crackle or the kick loses its punch.</li><li>Streaming services turn loud songs down to around −14 LUFS, so pushing past about −7 LUFS mostly costs punch.</li><li>In the mix lab, switch the <b>Master limiter</b> off and on and watch the level meter.</li></ol>
<h2>8. Check like an engineer</h2>
<ul><li><b>Reference</b>: drop a song you like into the Playlist on a muted track and A/B at the same volume.</li><li><b>Phone check</b>: switch on Phone speaker in the labs, then check on your real phone. If the 808 vanishes, add distortion.</li><li><b>Fresh ears</b>: mix at a low volume, take breaks, and finish the next day.</li><li><b>Export a test</b> and listen in the car.</li></ul>
${warn('Clipping','A red meter on a track means that track is too loud. Fix it with its fader or plugin output, not with the master.')}`},


{id:'export',mod:'Finishing',title:()=>'Export, tag and sell',min:20,body:()=>`
<p>Switch to SONG mode and press ${kbd(mod()+'+R')}.</p>
${fig(dlgExport({co:{mode:1,tail:2,fmt:3,split:4,start:5}}),560,['Mode: Song (not Pattern), so the whole Playlist renders.','Tail: <b>Leave remainder</b> so reverb tails are not cut off.','Formats: WAV (24-bit) to sell, MP3 (320 kbps) for previews.','<b>Split mixer tracks</b> exports stems: every mixer track as its own WAV.','Start.'],'Export window (drawing)')}
<ol class="steps"><li>Name mixer tracks first so stems have useful names.</li><li><b>Producer tag:</b> on the MP3 preview only, in the intro and every 30–45 s. Never on the WAV you sell.</li><li>File names: <code>BeatName_160bpm_F#m.wav</code>. Artists search by BPM and key.</li><li>Upload. The common title is <i>[Artist] Type Beat – "Name"</i>. That describes the style; the beat must be your own work.</li><li>Back up with <b>File → Export → Zipped loop package</b> (project + every sample).</li></ol>
${tip('Selling basics','Use a licence (lease vs exclusive). Only sell beats where every sample is royalty-free or yours.')}`},

{id:'drills',mod:'Finishing',title:()=>'Daily drills',min:15,body:()=>`
<p>One per day. Speed comes from repetition, not more plugins.</p>
<ol class="steps"><li><b>10-minute beat.</b> Timer on. Drums, 808, one melody. Export no matter what.</li><li><b>Chord copy.</b> Find a song's chords by ear on ${midiMode()?'your keyboard':'the typing keyboard'}; check with the <a href="#keys">Key finder</a>.</li><li><b>One recipe, three ways.</b> Keep a <a href="#beats">recipe</a>'s chords, change tempo and drums into another style.</li><li><b>Pad drumming.</b> ${midiMode()?'Play a whole drum pattern live, no quantize. Fix only what is clearly wrong.':'Program a pattern where no bar is exactly like the last.'}</li><li><b>3 leads from scratch</b> in ${pick(['vital','sytrus','3xosc']).p.n}. Save them as presets.</li><li><b>Mix someone else's stems.</b> Free stem packs teach mixing fast.</li></ol>`}
];
LESSONS.splice(LESSONS.findIndex(l=>l.id==='drums'),0,...THEORY);
const LMAP=Object.fromEntries(LESSONS.map(l=>[l.id,l]));
let done=store.get('done',{});

function viewPlugins(){const row=p=>`<tr><td><label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" data-p="${p.id}" id="pl-${p.id}" ${has(p.id)?'checked':''} style="margin-top:5px;accent-color:var(--led)"><b>${p.n}</b></label></td><td>${p.t}</td><td>${p.src==='stock'?`<span class="pill stock">${EDNAME[p.ed]}+</span>`:`<a class="pill free" href="${p.url}" target="_blank" rel="noopener">Free ↗</a>`}</td><td class="muted">${p.u}</td></tr>`;
 render(`<div class="eyebrow">Plugins</div><h1>Which plugins do you have?</h1><p class="lede">Tick what is installed. Recipes pick the best sound from your list and point to the free download when something is missing.</p>
<div class="row" style="margin-top:12px"><button class="btn" id="plAllFree">Tick all free picks</button><button class="btn" id="plReset">Reset to my edition</button></div>
${fig(mixer({sel:'Chords',fx:[['Fruity Parametric EQ 2',1],[has('vchorus')?'Vintage Chorus':'Fruity Stereo Shaper',1],[has('supermassive')?'Valhalla Supermassive':'Fruity Reeverb 2',1],['(empty)',0],['(empty)',0],['(empty)',0]],co:{fx:1}}),860,['Effect plugins go in these mixer slots. Instruments (synths, samplers) go in the Channel Rack instead.'],'Where plugins live in FL (drawing)')}
<h2>Stock FL Studio plugins</h2><p class="muted small">Edition labels are a guide; Image-Line changes edition contents between versions. Check <b>Options → Manage plugins</b> for what you really have.</p>
<div class="tablewrap"><table><thead><tr><th>Plugin</th><th>Type</th><th>Edition</th><th>Use it for</th></tr></thead><tbody>${PLUGINS.filter(p=>p.src==='stock').map(row).join('')}</tbody></table></div>
<h2>Free plugins worth installing</h2><p class="muted small">Free from the makers' own sites (some ask for an email). After installing, open <b>Options → Manage plugins</b> and click <b>Find plugins</b>.</p>
<div class="tablewrap"><table><thead><tr><th>Plugin</th><th>Type</th><th>Get it</th><th>Use it for</th></tr></thead><tbody>${PLUGINS.filter(p=>p.src==='free').map(row).join('')}</tbody></table></div>
${tip('If you install only three','<b>Vital</b> for leads, <b>Splice INSTRUMENT</b> (formerly Spitfire LABS) for pianos and strings, <b>Valhalla Supermassive</b> for reverb. Add <b>OTT</b> if you make rage.')}
<h2>Free sounds</h2><ul><li>FL's <b>Packs</b> in the Browser, plus FLEX's free downloadable packs.</li><li><b>Decent Sampler</b> libraries on <a href="https://www.pianobook.co.uk" target="_blank" rel="noopener">Pianobook</a>.</li><li>Producer-made free drum kits. Read the licence before selling.</li><li><a href="https://freesound.org" target="_blank" rel="noopener">Freesound</a> for FX; each sound lists its licence.</li></ul>`);
 $$('input[data-p]').forEach(i=>i.addEventListener('change',()=>{const id=i.dataset.p;prof.have=i.checked?[...new Set([...prof.have,id])]:prof.have.filter(x=>x!==id);saveProf();renderNav()}));
 $('#plAllFree').onclick=()=>{prof.have=[...new Set([...prof.have,...PLUGINS.filter(p=>p.src==='free').map(p=>p.id)])];saveProf();viewPlugins();toast('Free plugins ticked')};
 $('#plReset').onclick=()=>{prof.have=defaultHave(prof.edition);saveProf();viewPlugins();toast('Reset to '+EDNAME[prof.edition])}}

const SIMTXT={'Channel rack':'<b>Channel Rack (F6)</b>: your instruments. Each row is one sound and the 16 boxes are the step sequencer. Click steps to change the beat while it plays.','Piano roll':'<b>Piano Roll (F7)</b>: notes for the selected channel. Chords, melodies and 808 lines live here. These are the '+'chords of the current beat.','Playlist':'<b>Playlist (F5)</b>: the song timeline. Paint patterns here to build intro, hook and verse. Needs SONG mode.','Mixer':'<b>Mixer (F9)</b>: volume, EQ and effects for each sound. Meters move when the preview plays.'};
function simShow(sim,w){if(w==='Browser'){toast('The Browser is on the left');return}$$('[data-win]',sim).forEach(b=>b.classList.toggle('lit',b.dataset.win===w));const area=sim.querySelector('.sim-win');let html;
 if(w==='Channel rack')html=fit(channelRack(rackRows(cur),{live:true,pattern:cur.name,swing:cur.swing}),640);
 else if(w==='Piano roll')html=fit(pianoRoll(chordNotes(cur),{live:true,channel:'Chords',scale:cur.scale}),860);
 else if(w==='Playlist')html=fit(playlist({name:cur.name}),860);else html=fit(mixer({}),860);
 area.innerHTML=html;area.style.animation='none';void area.offsetWidth;area.style.animation='rise .35s cubic-bezier(.2,.8,.2,1)';sim.querySelector('.sim-text').innerHTML=SIMTXT[w];bindRack(area);fitAll()}
function bindRack(root){$$('.cr[data-live] .st',root).forEach(s=>{if(s._b)return;s._b=1;s.addEventListener('click',()=>{const l=s.dataset.lane,i=+s.dataset.i;if(!cur.drums[l]){toast('Write the 808 in its piano roll');return}const p=[...cur.drums[l]];p[i]=p[i]==='.'?'x':'.';cur.drums[l]=p.join('');s.classList.toggle('on',p[i]!=='.');s.innerHTML='';audio();if(p[i]!=='.')DR[l](ctx.currentTime,1)})})}
let beatTab='rack';
const TABWIN={rack:'Channel rack',chords:'Piano roll',bass:'Piano roll',arp:'Piano roll',mixer:'Mixer',playlist:'Playlist'};
function viewBeat(id){const base=RMAP[id];if(!base)return viewBeats();if(cur.id!==id)setBeat(id);const r=cur,k=K();if(beatTab==='arp'&&!r.arp)beatTab='rack';
 const sounds=r.sounds.map(([role,list,desc])=>{const b=pick(list);return `<div class="sound"><div class="role">${role}</div><div><div class="row" style="gap:6px">${plug(b.p.id)}${b.owned?'':`<span class="muted small">not ticked: <a href="${b.p.url||'#plugins'}" ${b.p.url?'target="_blank" rel="noopener"':''}>get it free</a> or use another option</span>`}</div><div class="muted small" style="margin-top:4px">${desc}</div><div class="row" style="gap:6px;margin-top:6px">${list.filter(x=>x!==b.p.id).map(plug).join(' ')}</div></div></div>`}).join('');
 render(`<div class="eyebrow">${r.lane} · ${r.ref}</div><h1>${r.name}</h1><p class="lede">${r.vibe}</p>
<div class="chips"><span class="chip"><b>${r.bpm}</b> BPM</span><span class="chip">Key <b>${r.key}</b></span><span class="chip">Swing <b>${Math.round(r.swing*100)}%</b></span><span class="chip">${r.chords.length}-bar loop</span></div>
<div class="row" style="margin-top:14px"><button class="btn primary" id="playBtn">${seq.on?'■ Stop':'▶ Play'}</button>${['drums','chords','bass'].concat(r.arp?['arp']:[]).map(l=>`<label class="chip" style="cursor:pointer"><input type="checkbox" id="ly-${l}" data-l="${l}" ${seq.layers[l]?'checked':''} style="accent-color:var(--accent)"> ${l==='bass'?'808':l==='arp'?'melody':l}</label>`).join('')}<button class="btn" id="resetBtn">Reset drums</button></div>
<div id="beatTb">${fit(toolbar({},{bpm:r.bpm,pattern:r.name,active:TABWIN[beatTab],hint:'Set tempo to '+r.bpm+' · key '+r.key}),1080)}</div>
<div class="tabs" role="tablist">${[['rack','Channel rack'],['chords','Piano roll: chords'],['bass','Piano roll: 808']].concat(r.arp?[['arp','Piano roll: melody']]:[]).concat([['mixer','Mixer'],['playlist','Playlist']]).map(([t,n])=>`<button class="tab ${beatTab===t?'on':''}" data-t="${t}" role="tab">${n}</button>`).join('')}</div>
<div id="beatWin"></div>
<p class="muted small" id="beatNote"></p>
<h2>Chords: one bar each</h2><div class="chordrow">${r.chords.map(([n,v],i)=>`<button class="chordbtn" data-c="${i}">${n}<small>${v}</small></button>`).join('')}</div>
<p class="muted small">${midiMode()?`Lit keys on your ${k.short} = the chord. They follow the preview. Use Oct −/+ if your keys start elsewhere.`:'Lit keys = the chord. Letters are the typing-keyboard keys.'}</p>
${controller({})}
<h2>Sounds from your plugins</h2><div class="panel">${sounds}</div>
<h2>Build it in FL</h2><ol class="steps">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
${midiMode()?tip('On your '+k.short,r.midi):tip('No keyboard',`Stamp tool for chords (pick the chord type, click the root), click the drum steps exactly like the rack, and draw 808 notes on each bar's root: ${r.roots.join(', ')}.`)}
<h2>Pro tips</h2><ul>${r.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
<h2>Arrange & finish</h2><p>Follow <a href="#lesson-arrange">Arrange a full beat</a> (see the Playlist tab), mix with <a href="#lesson-mix">the mix lesson</a>, and export with <b>${r.bpm} BPM, ${r.key}</b> in the file name.</p>
<div class="lessonnav"><a class="btn" href="#beats">← All recipes</a>${(()=>{const n=RECIPES[(RECIPES.indexOf(base)+1)%RECIPES.length];return `<a class="btn primary" href="#beat-${n.id}">Next: ${n.name} →</a>`})()}</div>`);
 const showTab=()=>{const w=$('#beatWin');let h,note='';
  if(beatTab==='rack'){h=fit(channelRack(rackRows(r).concat([{name:'808',lane:'808',pat:r.bass.replace(/\^/g,'x'),color:'#ff7a8a',trk:5}]),{live:true,pattern:r.name,swing:r.swing}),640);note='Click drum steps to change the beat while it plays. <b>32</b> = 32nd roll, <b>3</b> = triplet roll, <b>·</b> = soft ghost hit. The 808 row shows where it hits; write its notes in the piano roll (808 tab).'}
  else if(beatTab==='chords'){h=fit(pianoRoll(chordNotes(r),{live:true,channel:'Chords',scale:r.scale}),860);note='Lit rows are in '+r.key+'. FL names middle C "C5", so these read one octave higher than on most keyboards.'}
  else if(beatTab==='bass'){h=fit(pianoRoll(bassNotes(r),{live:true,channel:'808',lo:34,hi:52,h:200}),860);note='Pink notes jump up an octave. With Mono + Porta on, the 808 slides into them.'}
  else if(beatTab==='arp'){h=fit(pianoRoll(arpNotes(r),{live:true,channel:'Melody'}),860);note='The chords broken into 1/8 notes, like Tools → Arpeggiate or your keyboard\'s arp.'}
  else if(beatTab==='mixer'){h=fit(mixer({sel:'808',fx:[['Fruity Parametric EQ 2',1],[has('fastdist')?'Fruity Fast Dist':'Fruity Blood Overdrive',1],['Fruity Limiter (sidechain)',1],['(empty)',0],['(empty)',0],['(empty)',0]]}),860);note='Meters follow the preview: kick, snare, hats, 808, chords and melody each on their own insert.'}
  else{h=fit(playlist({name:r.name}),860);note='The full arrangement: 8-bar intro, hooks and verses, with a drum drop-out before the second hook.'}
  w.innerHTML=h;w.style.animation='none';void w.offsetWidth;w.style.animation='rise .35s cubic-bezier(.2,.8,.2,1)';$('#beatNote').innerHTML=note;bindRack(w);
  $$('#beatTb [data-win]').forEach(b=>b.classList.toggle('lit',b.dataset.win===TABWIN[beatTab]));$$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.t===beatTab));fitAll()};
 showTab();$$('.tab').forEach(t=>t.addEventListener('click',()=>{beatTab=t.dataset.t;showTab()}));
 $$('#beatTb [data-win]').forEach(b=>b.addEventListener('click',()=>{const m={'Channel rack':'rack','Piano roll':'chords','Mixer':'mixer','Playlist':'playlist'}[b.dataset.win];if(m){beatTab=m;showTab()}else toast('Browser: where you find sounds (lesson 3)')}));
 $('#playBtn').onclick=()=>{seq.on?stopSeq():startSeq()};
 $('#resetBtn').onclick=()=>{cur.drums=JSON.parse(JSON.stringify(base.drums));showTab();toast('Drums reset')};
 $$('[data-l]').forEach(c=>c.addEventListener('change',()=>{seq.layers[c.dataset.l]=c.checked;if(c.dataset.l==='arp'){hw.arp=c.checked;$$('.hw-btn[data-b="arp"]').forEach(x=>x.classList.toggle('on',hw.arp))}}));
 $$('.chordbtn').forEach(b=>b.addEventListener('click',()=>{audio();const ms=r.chords[+b.dataset.c][1].split(' ').map(midiOf);ms.forEach(m=>tone(ctx.currentTime+.01,m,1.4,r.timbre==='saw'?'saw':'keys'));litChord(ms);$$('.chordbtn').forEach(x=>x.classList.toggle('now',x===b))}))}

function viewKeys(){const kf=store.get('kf',{root:9,scale:'Natural minor',sev:true});render(`<div class="eyebrow">Key finder</div><h1>Scales and chords on 25 keys</h1><p class="lede">Choose a key. In-key rows light up in the piano roll. Click a chord to hear it and see it on ${midiMode()?'your controller':'the typing keyboard'}.</p>
<div class="panel"><div class="row"><span class="tlabel">Root</span>${ddHtml('kfRoot',ddOpts(NN.map((n,i)=>[i,n]),kf.root))}<span class="tlabel">Scale</span>${ddHtml('kfScale',ddOpts(Object.keys(SCALES).map(s=>[s,s]),kf.scale))}<label class="chip" style="cursor:pointer"><input type="checkbox" id="kfSev" ${kf.sev?'checked':''} style="accent-color:var(--accent)"> 7th chords</label></div>
<h3>Chords in this key</h3><div class="chordrow" id="kfChords"></div><p class="muted small" id="kfNote"></p></div>
<div id="kfPR"></div>${controller({})}
${tip('Use it in FL','Set the same root and scale in the piano roll (View → Helpers → Scale highlighting), and every note on a lit row stays in key.')}`);
 const draw=()=>{const sc=SCALES[kf.scale];const box=$('#kfChords');box.innerHTML='';const chords=[];
  if(sc.length<7){$('#kfNote').textContent='Pentatonic scales are for melodies. Pick a 7-note scale to see chords.'}else{$('#kfNote').textContent='Upper case = major, lower case = minor, ° = diminished.';
   const roman=['I','II','III','IV','V','VI','VII'];sc.forEach((_,d)=>{const notes=[0,2,4].concat(kf.sev?[6]:[]).map(o=>{const ix=d+o;return kf.root+sc[ix%7]+12*Math.floor(ix/7)});const iv=notes.map(n=>n-notes[0]);const q=iv[1]===4?(iv[2]===8?'+':''):(iv[2]===6?'°':'m');const rootN=NN[notes[0]%12];let name=rootN+(q==='m'?'m':q==='°'?'dim':q==='+'?'aug':'');if(kf.sev){const s=iv[3];name=rootN+(q==='m'?(s===10?'m7':'m(maj7)'):q==='°'?(s===10?'m7b5':'dim7'):q==='+'?'aug7':(s===11?'maj7':'7'))}let rn=roman[d];if(q==='m'||q==='°')rn=rn.toLowerCase();if(q==='°')rn+='°';if(q==='+')rn+='+';const b0=48+(notes[0]%12);const ms=notes.map(n=>n-notes[0]+b0);chords.push(ms);const b=document.createElement('button');b.className='chordbtn';b.innerHTML=`${name}<small>${rn} · ${ms.map(m=>NN[m%12]).join(' ')}</small>`;b.onclick=()=>{audio();ms.forEach(m=>tone(ctx.currentTime+.01,m,1.3,'keys'));litChord(ms);box.querySelectorAll('.chordbtn').forEach(x=>x.classList.toggle('now',x===b))};box.appendChild(b)})}
  let notes=chords.flatMap((ms,i)=>ms.map(m=>({m,s:i*8,l:7,v:.7})));if(!notes.length){const sn=[];for(let m=57;m<=81;m++)if(sc.includes((m-kf.root+120)%12))sn.push(m);notes=sn.map((m,i)=>({m,s:i*2,l:2,v:.6}))}
  $('#kfPR').innerHTML=fig(pianoRoll(notes,{channel:'Key finder',scale:[kf.root,kf.scale],bars:4,lo:47,hi:85,h:300}),860,null,chords.length?'Every chord in '+NN[kf.root]+' '+kf.scale+', two beats each. Lit rows = in key.':'The '+NN[kf.root]+' '+kf.scale+' scale going up. Lit rows = in key.');fitAll()};
 draw();const sv=()=>store.set('kf',kf);ddOn('kfRoot',v=>{kf.root=+v;sv();draw()});ddOn('kfScale',v=>{kf.scale=v;sv();draw()});$('#kfSev').onchange=e=>{kf.sev=e.target.checked;sv();draw()}}

function viewShortcuts(){const M=mod(),A=alt();const rows=[['Transport','Play / stop','Space'],['Transport','Pattern / Song mode','L'],['Transport','Record','R'],['Transport','Metronome',M+'+M'],['Transport','Typing keyboard to piano',M+'+T'],['Windows','Playlist','F5'],['Windows','Channel Rack','F6'],['Windows','Piano Roll','F7'],['Windows','Plugin picker','F8'],['Windows','Mixer','F9'],['Windows','MIDI settings (Audio is the next tab)','F10'],['Windows','Browser',A+'+F8'],['Piano roll','Quick quantize',prof.os==='mac'?'Opt+Cmd+Q':'Ctrl+Q'],['Piano roll','Duplicate selection',M+'+B'],['Piano roll','Move notes a semitone','Shift+↑'],['Piano roll','Move notes an octave',M+'+↑'],['Piano roll','Draw / Paint / Delete / Slice / Select','P / B / D / C / E'],['Piano roll','Randomize tool',A+'+R'],['Channel Rack','Route selected channels to free mixer tracks',M+'+L'],['Controllers','Multilink to controllers',M+'+J'],['Project','Save',M+'+S'],['Project','Export WAV',M+'+R'],['Project','Export MP3',M+'+Shift+R'],['Project','Undo / redo toggle',M+'+Z'],['Project','Step back in undo history',M+'+'+A+'+Z']];
 render(`<div class="eyebrow">Cheat sheet</div><h1>Shortcuts</h1><p class="lede">${prof.os==='mac'?'Mac':'Windows'} keys. On Mac, Ctrl becomes Cmd and Alt becomes Option. On a MacBook, F5–F10 need the Fn key unless function keys are set as standard keys in System Settings.</p>
${fig(toolbar({windows:1,patsong:2,transport:3,metro:4},{active:'Piano roll'}),1080,['F5 Playlist · F7 Piano roll · '+A+'+F8 Browser · F6 Channel rack · F9 Mixer','<kbd>L</kbd> toggles PAT / SONG','<kbd>Space</kbd> play/stop, <kbd>R</kbd> record','Metronome '+M+'+M, typing keyboard '+M+'+T'],'Where the shortcuts live on the toolbar (drawing)')}
<div class="tablewrap"><table><thead><tr><th>Area</th><th>Action</th><th>Keys</th></tr></thead><tbody>${rows.map(([a,b,c])=>`<tr><td class="muted">${a}</td><td>${b}</td><td>${c.includes(' / ')?c.split(' / ').map(x=>`<kbd>${x}</kbd>`).join(' '):kbd(c)}</td></tr>`).join('')}</tbody></table></div>
<h2>Recording settings that matter</h2><ul><li><b>Count-in before recording</b>: the Recording Count-in button on the toolbar (${kbd(mod()+'+P')}). Right-click it to choose how many bars.</li><li><b>Loop recording</b>: the pattern loops so you can overdub layers.</li><li><b>Recording Blend</b> (${kbd(mod()+'+B')}): on, new notes are added; off, they replace what was there.</li><li><b>Recording filter</b> (right-click the record button): tick Notes and Automation for a MIDI keyboard.</li></ul>`)}

async function webMidi(){const st=$('#midiStatus');if(!navigator.requestMIDIAccess){st.textContent='This browser has no Web MIDI. Try Chrome; FL works regardless.';return}try{const acc=await navigator.requestMIDIAccess();const ins=[...acc.inputs.values()];st.textContent=ins.length?'Listening to: '+ins.map(i=>i.name).join(', '):'No MIDI devices found. Is it plugged in?';ins.forEach(i=>i.onmidimessage=e=>{const[s,n,v]=e.data;const k=document.querySelector(`#testKeys [data-m="${n}"]`);if((s&0xf0)===0x90&&v>0){playNote(n);if(k)k.classList.add('hit')}else if((s&0xf0)===0x80||(s&0xf0)===0x90){if(k)k.classList.remove('hit')}})}catch(e){st.textContent='This viewer blocks MIDI access. Test in FL instead: the channel\'s mini keyboard lights up as you play.'}}
/* ================= sampling: drawings + chop tool ================= */
function waveSvg(w,h,seed,markers,sel){let s=seed||7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;const pts=[];const n=Math.floor(w/3);for(let i=0;i<n;i++){const t=i/n;const beat=Math.pow(1-((t*8)%1),3);const a=(0.18+0.55*beat+0.25*rnd())*h/2;pts.push([i*3,a])}
 const top=pts.map(([x,a])=>`${x},${(h/2-a).toFixed(1)}`).join(' '),bot=pts.slice().reverse().map(([x,a])=>`${x},${(h/2+a).toFixed(1)}`).join(' ');
 return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">${sel?`<rect x="${sel[0]*w}" y="0" width="${(sel[1]-sel[0])*w}" height="${h}" fill="#3b4a5a"/>`:''}<polygon points="${top} ${bot}" fill="#7fd1ff" opacity=".85"/>${(markers||[]).map((m,i)=>`<line x1="${m*w}" x2="${m*w}" y1="0" y2="${h}" stroke="#ffb066" stroke-width="1.5"/><text x="${m*w+4}" y="13" fill="#ffb066" font-family="Barlow Condensed,sans-serif" font-size="12" font-weight="700">${i+1}</text>`).join('')}</svg>`}
function edisonMock(o={}){const c=o.co||{};return win('Edison - sample.wav',`<div style="display:flex;gap:4px;margin-bottom:6px">${[['Trim','trim'],['Fade','fade'],['Reverse','rev'],['Normalize',''],['Noise reduction','nr'],['Drag to channel','drag']].map(([l,k])=>`<span class="fl-b" style="padding:0 8px"${co(c,k)}>${l}</span>`).join('')}</div><div style="background:#1d2024;border-radius:4px;padding:6px"${co(c,'sel')}>${waveSvg(700,110,11,null,[.25,.5])}</div><div style="display:flex;justify-content:space-between;color:#b4bcc6;font:600 11px var(--ui);margin-top:4px"><span>0:00.000</span><span>selection 0:01.200 – 0:02.400</span><span>0:04.800</span></div>`,{w:o.w||740})}
function slicexMock(o={}){const c=o.co||{};const marks=[0,.125,.25,.375,.5,.625,.75,.875];return win('Slicex - chop.wav',`<div style="display:flex;gap:4px;margin-bottom:6px;align-items:center"><span class="fl-b" style="padding:0 8px"${co(c,'auto')}>Slicing ▾ Auto-slice</span><span class="fl-b" style="padding:0 8px"${co(c,'stretch')}>Time stretch</span><span style="margin-left:auto;color:#9aa3ad">8 slices</span></div><div style="background:#1d2024;border-radius:4px;padding:6px"${co(c,'wave')}>${waveSvg(700,110,5,marks)}</div><div style="display:flex;gap:2px;margin-top:8px"${co(c,'map')}>${marks.map((m,i)=>`<div style="flex:1;height:34px;border-radius:0 0 4px 4px;background:#e9ecef;color:#333;font:700 11px var(--ui);display:flex;align-items:flex-end;justify-content:center;padding-bottom:3px;line-height:1.1;text-align:center">${flName(60+[0,2,4,5,7,9,11,12][i])}<br>slice ${i+1}</div>`).join('')}</div>`,{w:o.w||740})}
function samplerMock(o={}){const c=o.co||{};return win('Channel settings - sample.wav',`<div style="display:flex;gap:4px;margin-bottom:8px"><span class="fl-b lit">SMP</span><span class="fl-b">INS</span><span class="fl-b">MISC</span></div><div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><span class="cb on"${co(c,'rev')}><i></i>Reverse</span><span style="display:flex;align-items:center;gap:6px"${co(c,'pitch')}>Pitch <span class="knob" style="--r:40deg"></span> <b style="color:var(--fl-hot)">+3 st</b></span><span style="display:flex;align-items:center;gap:6px"${co(c,'time')}>Time stretch <span class="dd" style="min-width:130px">Resample</span></span><span style="display:flex;align-items:center;gap:6px"${co(c,'mul')}>Mul <span class="knob" style="--r:-60deg"></span> <b style="color:var(--fl-hot)">50%</b></span></div>`,{w:o.w||640})}

const chop={buf:null,rev:null,slices:8,pitch:0,speed:1,reverse:false,src:null};
async function renderChopSource(){const r=cur,sd=60/r.bpm/4,len=sd*32,rate=44100;const oc=new OfflineAudioContext(1,Math.ceil(len*rate),rate);const out=oc.createGain();out.gain.value=.8;out.connect(oc.destination);
 const note=(t,m,d,type,v)=>{const o=oc.createOscillator(),g=oc.createGain();o.type=type;o.frequency.value=freq(m);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05)};
 for(let b=0;b<2;b++){const ns=r.chords[b][1].split(' ').map(midiOf);ns.forEach(m=>note(b*16*sd,m,16*sd,'triangle',.08));for(let i=0;i<16;i+=2)note((b*16+i)*sd,ns[ARP[(i/2)%8]%ns.length]+12,sd*1.6,'sine',.14);
  for(let i=0;i<16;i+=4){const o=oc.createOscillator(),g=oc.createGain(),t=(b*16+i)*sd;o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(50,t+.1);g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.0001,t+.25);o.connect(g);g.connect(out);o.start(t);o.stop(t+.3)}}
 chop.buf=await oc.startRendering();const rv=new AudioBuffer({length:chop.buf.length,sampleRate:rate,numberOfChannels:1});const a=chop.buf.getChannelData(0),d=rv.getChannelData(0);for(let i=0;i<a.length;i++)d[i]=a[a.length-1-i];chop.rev=rv;drawChop()}
function drawChop(hi){const cv=$('#chopWave');if(!cv||!chop.buf)return;const g=cv.getContext('2d'),W=cv.width=cv.clientWidth*devicePixelRatio,H=cv.height=120*devicePixelRatio;const data=(chop.reverse?chop.rev:chop.buf).getChannelData(0);g.clearRect(0,0,W,H);const step=Math.floor(data.length/W);
 for(let s=0;s<chop.slices;s++){if(s===hi){g.fillStyle='rgba(255,176,102,.22)';g.fillRect(s*W/chop.slices,0,W/chop.slices,H)}}
 g.fillStyle='#7fd1ff';for(let x=0;x<W;x++){let mx=0;for(let j=0;j<step;j+=8){const v=Math.abs(data[x*step+j]||0);if(v>mx)mx=v}const h=Math.max(1,mx*H*.9);g.fillRect(x,(H-h)/2,1,h)}
 g.strokeStyle='#ffb066';g.lineWidth=1.5*devicePixelRatio;g.fillStyle='#ffb066';g.font=`700 ${12*devicePixelRatio}px "Barlow Condensed",sans-serif`;for(let s=0;s<chop.slices;s++){const x=s*W/chop.slices;g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,H);g.stroke();g.fillText(String(s+1),x+5*devicePixelRatio,14*devicePixelRatio)}}
function playSlice(i){if(!chop.buf)return;audio();const b=chop.reverse?chop.rev:chop.buf,len=b.duration/chop.slices;const s=ctx.createBufferSource();s.buffer=b;s.playbackRate.value=Math.pow(2,chop.pitch/12)*chop.speed;const g=ctx.createGain();g.gain.value=.9;s.connect(g);g.connect(master);s.start(ctx.currentTime+.005,i*len,len);drawChop(i);const pads=$$('.slicepads button');pads.forEach((p,k)=>p.classList.toggle('lit',k===i));setTimeout(()=>{pads[i]&&pads[i].classList.remove('lit')},150)}
function chopTool(){return `<div class="note" style="background:var(--surface);border:1px solid var(--border)"><b class="h">Chop it yourself</b><p class="small muted" style="margin:2px 0 10px">The app records two bars of the current beat (${cur.name}, ${cur.bpm} BPM) into a sample and cuts it into 8 equal slices, the way Slicex slices on the grid. Tap the pads or press 1–8 to play the slices in a new order.</p>
<canvas id="chopWave" class="wave" aria-label="Waveform of the sample with 8 slice markers"></canvas>
<div class="slicepads">${Array.from({length:8},(_,i)=>`<button data-s="${i}" aria-label="Play slice ${i+1}">${i+1}</button>`).join('')}</div>
<div class="ctrls"><label for="chPitch">Pitch <input type="range" id="chPitch" min="-12" max="12" step="1" value="0"> <b id="chPitchV" class="tnum">0 st</b></label><label><input type="checkbox" id="chHalf"> Half speed</label><label><input type="checkbox" id="chRev"> Reverse</label><button class="btn" id="chNew">Re-sample current beat</button></div></div>`}
function bindChop(){if(!$('#chopWave'))return;renderChopSource();$$('.slicepads button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();playSlice(+b.dataset.s)}));
 $('#chPitch').oninput=e=>{chop.pitch=+e.target.value;$('#chPitchV').textContent=(chop.pitch>0?'+':'')+chop.pitch+' st'};$('#chHalf').onchange=e=>{chop.speed=e.target.checked?.5:1};$('#chRev').onchange=e=>{chop.reverse=e.target.checked;drawChop()};$('#chNew').onclick=()=>{renderChopSource();toast('Sampled 2 bars of '+cur.name)}}
let droneNodes=[];
function drone(pc,label){audio();droneNodes.forEach(n=>{try{n.stop()}catch(e){}});droneNodes=[];if(pc===null)return;[0,7,12].forEach((iv,k)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=k?'sine':'triangle';o.frequency.value=freq(48+pc+iv);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(k?.05:.09,ctx.currentTime+.3);o.connect(g);g.connect(master);o.start();droneNodes.push(o)});toast('Drone: '+label)}

const SAMPLING={id:'sampling',mod:'Building the beat',title:()=>'Sampling, chops and flips',min:40,body:()=>`
<p>Sampling means building part of a beat from existing audio. Producers sample everything: old records, TV themes, vocals, internet clips, even their own older songs. There are four ways to do it, and FL has a tool for each.</p>
<div class="tablewrap"><table><thead><tr><th>Type</th><th>What it is</th><th>FL tools</th></tr></thead><tbody>
<tr><td><b>Direct sample</b></td><td>Audio from the original recording, cut and rearranged</td><td>Edison, Slicex, Sampler</td></tr>
<tr><td><b>Interpolation</b></td><td>The melody or words played or sung again, no original audio</td><td>Piano roll, your keyboard, Pitcher</td></tr>
<tr><td><b>Vocal drop</b></td><td>A short spoken phrase or clip at key moments</td><td>Edison, Sampler, automation</td></tr>
<tr><td><b>Flip</b></td><td>A sample changed until it becomes something new</td><td>Slicex, Sampler time stretch, filters</td></tr>
</tbody></table></div>
<h2>1. Cut the part you want in Edison</h2>
${fig(edisonMock({co:{sel:1,trim:2,fade:3,rev:4,nr:5,drag:6}}),740,['Drag the region you want. Zoom in so the start lands right before the first hit.','Trim deletes everything outside the selection.','Fade the first and last few milliseconds so the cut never clicks.','Reverse turns a hit into a swell, a classic transition into the hook.','Noise reduction cleans clips taken from phones or videos.','Drag the finished sample straight onto a channel or into Slicex.'],'Edison (drawing)')}
<h2>2. Chop it in Slicex</h2>
${fig(slicexMock({co:{auto:1,wave:2,map:3,stretch:4}}),740,['Slice automatically: on transients for drums and hits, on the grid for steady loops.','Each marker starts a slice. Drag markers to move them; delete the ones you do not need.','Every slice gets its own key, one semitone apart, so you can play the chops from the keyboard or pads.','Time stretch keeps slices in time if you change the project tempo.'],'Slicex (drawing)')}
${chopTool()}
${path(`<p>${K().padNote} Slicex works the same way: with Slicex selected, each pad triggers the slice on its note. If your pads sit below the first slice, shift the pad bank or the keyboard octave until they line up. Record a new order of slices on the pads with the metronome on, then quantize lightly.</p>`,`<p>Draw slice notes in Slicex's piano roll; every key is one slice. Rearranging the notes rearranges the chops.</p>`)}
<h2>3. Fit it to your beat</h2>
${fig(samplerMock({co:{pitch:1,time:2,mul:3,rev:4}}),640,['Pitch: shift the whole sample in semitones until it is in your key.','Time stretch: Resample changes speed and pitch together (the classic sped-up or slowed-down sound); stretch modes keep pitch while changing speed.','MUL at 200% (Resample mode) doubles the length: half speed, an octave down. An instant slowed-down flip.','Reverse, right on the channel.'],'Sampler channel settings (drawing)')}
<ol class="steps"><li>Find the sample's key: play notes on ${midiMode()?'your keyboard':'the typing keyboard'} over it until one note sounds settled. That is usually the root.</li><li>Find its tempo: FL shows a detected tempo when you load a loop in Edison or the Playlist, or count the bars over a known length.</li><li>Pitch or stretch it to your project, or set the project to the sample's tempo and build around it.</li><li>Carve space: EQ the low end out of the sample (100–200 Hz) so your kick and 808 own it.</li></ol>
<h2>4. Interpolate instead</h2><p>When you want a melody but not the recording, replay it. Loop the original, match it note by note on the keys, record it as MIDI, and give it your own sound or a new vocalist.</p>
${warn('Clearing samples','Using someone else\'s recording or song in music you release or sell needs permission from whoever owns it, even for a few seconds. For practice and private beats, sample anything. For releases, use royalty-free packs, record your own sounds, or clear the sample.')}`};

/* ================= practice mode (play along, scored) =================
   Times are in beats. Keys exercises use MIDI note numbers (60 = middle C, shown as C5 in FL). Pads use lane indexes. */
const LANES=['Kick','Snare','Hat','Open'];
const seqNotes=(ms,step=1,d=.9,start=0)=>ms.map((m,i)=>({t:start+i*step,d,m}));
const chordsAt=(list,len=4)=>list.flatMap((ns,i)=>ns.map(m=>({t:i*len,d:len*.95,m})));
const padsFrom=(pat,bars=1,lane)=>{const out=[];for(let b=0;b<bars;b++)[...pat].forEach((c,i)=>{if(c!=='.')out.push({t:b*4+i/4,d:.2,lane,roll:c==='r'})});return out};
const EXERCISES=[
 {id:'find-c',unit:'theory',title:'Find every C',kind:'keys',bpm:70,wait:true,lesson:'notes',
  about:'C is the white key just left of each group of two black keys. Play the three Cs on your keyboard, low to high and back.',notes:seqNotes([48,60,72,60,48],2,1.5)},
 {id:'c-major',unit:'theory',title:'C major scale',kind:'keys',bpm:80,lesson:'scales',
  about:'All white keys from C to C: whole, whole, half, whole, whole, whole, half. Up one octave and back down.',notes:seqNotes([60,62,64,65,67,69,71,72,71,69,67,65,64,62,60])},
 {id:'a-minor',unit:'theory',title:'A minor scale',kind:'keys',bpm:80,lesson:'scales',
  about:'The same white keys, starting on A: whole, half, whole, whole, half, whole, whole. This is natural minor, the darkest common scale in trap.',notes:seqNotes([57,59,60,62,64,65,67,69,67,65,64,62,60,59,57])},
 {id:'triads',unit:'theory',title:'Four triads',kind:'keys',bpm:80,lesson:'chords',
  about:'C major (C E G), F major (F A C), G major (G B D), A minor (A C E). Each held for a bar. Press all three notes together.',notes:chordsAt([[60,64,67],[65,69,72],[67,71,74],[57,60,64]])},
 {id:'am-f-c-g',unit:'theory',title:'Am – F – C – G with smooth voicings',kind:'keys',bpm:90,lesson:'progressions',
  about:'The progression from the theory lesson, voiced so your hand barely moves: A C E, F A C, E G C, D G B.',notes:chordsAt([[57,60,64],[53,57,60],[52,55,60],[50,55,59]])},
 {id:'hook',unit:'theory',title:'Call and answer hook',kind:'keys',bpm:90,lesson:'melody',
  about:'A four-bar hook in A minor. Bars 1–2 ask a question, bars 3–4 answer it with a different ending that lands on A.',
  notes:[[0,69],[1,72],[1.5,74],[2,72],[4,76],[5,74],[5.5,72],[6,69],[8,69],[9,72],[9.5,74],[10,72],[12,71],[13,67],[13.5,69],[14,69]].map(([t,m],i,a)=>({t,m,d:Math.min(.9,((a[i+1]||[16])[0]-t)*.9)}))},
 {id:'roots-808',unit:'beat',title:'808 roots with an octave jump',kind:'keys',bpm:80,lesson:'808',
  about:'The Rage anthem bassline in F# minor: hold each chord root, then jump up an octave on the last 8th of the bar. Play it an octave lower on your keyboard (Oct −) for the real 808 range.',
  notes:[[0,54,3.4],[3.5,66,.45],[4,50,3.4],[7.5,62,.45],[8,52,3.4],[11.5,64,.45],[12,49,3.4],[15.5,61,.45]].map(([t,m,d])=>({t,m,d}))},
 {id:'pluggnb-chords',unit:'beat',title:'Pluggnb seventh chords',kind:'keys',bpm:75,lesson:'melody',
  about:'Gbmaj7, Fm7, Ebm7 and Ab(add9) from the Pluggnb recipe. Four notes each, a bar each.',notes:chordsAt([[54,58,61,65],[53,56,60,63],[51,54,58,61],[56,60,63,70]])},
 {id:'half-time',unit:'beat',title:'Kick and snare, half-time',kind:'pads',bpm:120,lesson:'drums',
  about:'Kick on beat 1, snare on beat 3. This is the half-time feel of trap. Kick on pad 1 (or A), snare on pad 2 (or S).',notes:[...padsFrom('x...............',4,0),...padsFrom('........x.......',4,1)]},
 {id:'trap-groove',unit:'beat',title:'Trap groove with 8th hats',kind:'pads',bpm:110,lesson:'drums',
  about:'Add hats on every 8th note (pad 3 or D) over the kick and snare. Two kicks per bar now: beat 1 and the "and" of 2.',notes:[...padsFrom('x.....x.........',2,0),...padsFrom('........x.......',2,1),...padsFrom('x.x.x.x.x.x.x.x.',2,2)]},
 {id:'hat-roll',unit:'beat',title:'Hi-hat roll',kind:'pads',bpm:100,lesson:'drums',
  about:'8th hats, then a burst of 16ths on beat 4. On the MPK you can hold Note Repeat at 1/16 instead of tapping each one.',notes:[...padsFrom('x.x.x.x.x.x.xxxx',2,2),...padsFrom('x.......x.......',2,0).filter(n=>n.t%4===0),...padsFrom('........x.......',2,1)]},
 {id:'rage-drums',unit:'beat',title:'Rage anthem drums',kind:'pads',bpm:120,lesson:'drums',
  about:'The full drum pattern from the Rage recipe, slowed from 160 to 120 BPM. Speed it up once you hit 80%.',notes:[...padsFrom('x......x..x.....',2,0),...padsFrom('........x.......',2,1),...padsFrom('x.x.x.x.x.x.xxx.',2,2),...padsFrom('......x.........',2,3)]}
];
const EXMAP=Object.fromEntries(EXERCISES.map(e=>[e.id,e]));
let pBest=store.get('practice',{});
const starsFor=acc=>acc>=95?3:acc>=80?2:acc>=60?1:0;
const starHtml=n=>`<span class="stars" aria-label="${n} of 3 stars">${[0,1,2].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
function practiceCard(ids){const ex=ids.map(i=>EXMAP[i]).filter(Boolean);if(!ex.length)return'';return `<div class="practice-card"><div><div class="k">Practice</div>${ex.map(e=>`<a class="lrow" href="#practice-${e.id}"><span class="t">${e.title}</span><span class="d">${e.kind==='pads'?'Pads':'Keys'} · ${e.bpm} BPM</span><span class="r">${starHtml(pBest[e.id]?.stars||0)}</span></a>`).join('')}</div></div>`}
/* ---- engine ---- */
const PR={ex:null,ev:[],state:'idle',speed:1,wait:false,metro:true,clock:0,last:0,raf:null,lo:48,hi:72,fb:[],listener:null,listenTimer:null};
function prReset(){const e=PR.ex;PR.ev=e.notes.map(n=>({...n,hit:null,err:null}));PR.clock=-4;PR.fb=[];PR.metroNext=-4;PR.lastBeatClick=null}
function prSpb(){return 60/(PR.ex.bpm*PR.speed)}
function prRange(e){if(e.kind==='pads')return;const ms=e.notes.map(n=>n.m);let lo=Math.min(...ms),hi=Math.max(...ms);lo=lo-(lo%12)-(lo%12>7?0:0);lo=Math.min(lo,hi-12);while(hi-lo<24)hi++;if(isBlack(lo))lo--;if(isBlack(hi))hi++;PR.lo=lo;PR.hi=hi}
function prStart(mode){audio();stopSeq();prStop(true);prReset();PR.state=mode;PR.last=performance.now();PR.listener={onNote:n=>prInput(n),onNoteOff:()=>true};MIDI.listeners.add(PR.listener);prUI();PR.raf=requestAnimationFrame(prTick)}
function prStop(silent){cancelAnimationFrame(PR.raf);if(PR.listener)MIDI.listeners.delete(PR.listener);PR.listener=null;if(!silent&&PR.state!=='idle'){PR.state='idle';prUI()}}
function prTick(now){const dt=(now-PR.last)/1000;PR.last=now;const spb=prSpb();let adv=dt/spb;const e=PR.ex;
 if(PR.state==='play'&&PR.wait&&PR.clock>=0){const next=PR.ev.filter(x=>!x.hit).reduce((m,x)=>Math.min(m,x.t),Infinity);if(PR.clock+adv>=next){adv=Math.max(0,next-PR.clock)}}
 const prev=PR.clock;PR.clock+=adv;
 if(PR.metro||PR.clock<0){for(let b=Math.ceil(prev);b<=PR.clock;b++){if(b!==PR.lastBeatClick){PR.lastBeatClick=b;prClick(b%4===0||b<0&&b%4===-4)}}}
 if(PR.state==='listen'){for(const n of PR.ev){if(!n.hit&&n.t<=PR.clock){n.hit='demo';if(e.kind==='pads')DR[LANES[n.lane]](ctx.currentTime,1);else tone(ctx.currentTime+.005,n.m,n.d*spb,'keys',.9,'Melody');prFlash(n,'demo')}}}
 if(PR.state==='play'&&!PR.wait){const win=.18/spb;for(const n of PR.ev){if(!n.hit&&PR.clock>n.t+win){n.hit='miss';PR.fb.push({n,txt:'Miss',cls:'miss',at:now})}}}
 const end=Math.max(...PR.ev.map(n=>n.t+n.d))+1;prDraw(now);if(PR.clock>end&&PR.state!=='idle'){const was=PR.state;PR.state='idle';cancelAnimationFrame(PR.raf);if(PR.listener)MIDI.listeners.delete(PR.listener);PR.listener=null;if(was==='play')prResults();prUI();return}
 PR.raf=requestAnimationFrame(prTick)}
function prClick(accent){const t=ctx.currentTime+.005;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=accent?1500:1000;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(accent?.25:.15,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.05);o.connect(g);g.connect(master);o.start(t);o.stop(t+.06)}
function prInput(n){const e=PR.ex;if(!e)return false;if(PR.state!=='play'){if(PR.state==='idle')return false;return true}
 const spb=prSpb();if(e.kind==='pads'){const lane=n.pad?((n.note-36+160)%16)%4:n.lane;DR[LANES[lane]](ctx.currentTime,.6+.4*(n.vel||1));prMatch(x=>x.lane===lane,n)}else{tone(ctx.currentTime+.005,n.note,.6,'keys',.9,'Melody');prMatch(x=>x.m===n.note,n)}return true}
function prMatch(fit,n){const spb=prSpb();let best=null,bd=1e9;for(const x of PR.ev){if(x.hit||!fit(x))continue;const d=(PR.clock-x.t)*spb;if(Math.abs(d)<Math.abs(bd)){bd=d;best=x}}
 const now=performance.now();if(!best||Math.abs(bd)>(PR.wait?1e9:.18)){PR.fb.push({n:null,txt:'Wrong note',cls:'miss',at:now,key:n.note??n.lane});PR.wrong=(PR.wrong||0)+1;return}
 const ms=PR.wait?0:bd*1000;best.err=ms;best.hit=Math.abs(ms)<=45?'perfect':Math.abs(ms)<=100?'good':ms<0?'early':'late';PR.fb.push({n:best,txt:{perfect:'Perfect',good:'Good',early:'Early',late:'Late'}[best.hit],cls:best.hit,at:now})}
function prFlash(n,cls){PR.fb.push({n,txt:'',cls,at:performance.now()})}
function prResults(){const n=PR.ev.length,c=k=>PR.ev.filter(x=>x.hit===k).length;const score=PR.ev.reduce((s,x)=>s+({perfect:1,good:.8,early:.5,late:.5}[x.hit]||0),0)/n;const acc=Math.max(0,Math.round(score*100-(PR.wrong||0)*2));const stars=starsFor(acc);
 const id=PR.ex.id;const prevB=pBest[id];if(!prevB||acc>prevB.best){pBest[id]={best:acc,stars:Math.max(stars,prevB?.stars||0),speed:PR.speed};store.set('practice',pBest)}
 const el=$('#prResult');if(el)el.innerHTML=`<div class="pr-res"><div class="pr-score"><b>${acc}%</b>${starHtml(stars)}<span class="muted small">${PR.wait?'Wait mode: timing not scored':`${Math.round(PR.speed*PR.ex.bpm)} BPM`}</span></div><dl class="facts" style="margin:0"><div><dt>Perfect</dt><dd>${c('perfect')}</dd></div><div><dt>Good</dt><dd>${c('good')}</dd></div><div><dt>Early / late</dt><dd>${c('early')} / ${c('late')}</dd></div><div><dt>Missed</dt><dd>${c('miss')+PR.ev.filter(x=>!x.hit).length}</dd></div></dl><p class="small muted" style="margin:6px 0 0">${acc>=95?'Clean. Try it at full speed, or move on.':acc>=80?'Solid. Run it again to clean up the misses.':PR.wait?'Turn off Wait mode when you know the notes.':'Slow it down to 75% and keep the metronome on.'}</p></div>`;
 renderNav()}
/* ---- drawing ---- */
function prGeom(W){const lo=PR.lo,hi=PR.hi;const wh=[];for(let m=lo;m<=hi;m++)if(!isBlack(m))wh.push(m);const ww=W/wh.length;const g={};let wi=0;for(let m=lo;m<=hi;m++){if(isBlack(m))g[m]={x:wi*ww-ww*.3,w:ww*.6,b:true};else{g[m]={x:wi*ww,w:ww,b:false};wi++}}return g}
function prDraw(now){const cv=$('#prCanvas');if(!cv)return;const dpr=devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=H*dpr}const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
 const e=PR.ex,kb=e.kind==='pads'?78:86,hitY=H-kb,ppb=Math.max(70,Math.min(120,H/4));g.fillStyle='#1d2024';g.fillRect(0,0,W,H);
 const lanesX=e.kind==='pads'?LANES.map((_,i)=>({x:i*W/4+6,w:W/4-12})):null;const geo=e.kind==='pads'?null:prGeom(W);
 // beat lines
 for(let b=Math.floor(PR.clock);b<PR.clock+H/ppb+1;b++){const y=hitY-(b-PR.clock)*ppb;if(y<0||y>hitY)continue;g.fillStyle=b%4===0?'#3a414b':'#2a2f36';g.fillRect(0,Math.round(y),W,b%4===0?2:1)}
 // lanes
 if(geo){for(let m=PR.lo;m<=PR.hi;m++)if(geo[m].b){g.fillStyle='#22262b';g.fillRect(geo[m].x,0,geo[m].w,hitY)}}else{lanesX.forEach((l,i)=>{g.fillStyle=i%2?'#22262b':'#1f2327';g.fillRect(l.x-6,0,l.w+12,hitY)})}
 // notes
 const col={perfect:'#7ee08f',good:'#a8e07e',early:'#ffcf5a',late:'#ffcf5a',miss:'#ff6b6b',demo:'#7fd1ff'};
 for(const n of PR.ev){const y1=hitY-(n.t-PR.clock)*ppb,y0=y1-Math.max(10,n.d*ppb);if(y0>hitY+4||y1<-10)continue;let x,w;if(geo){const k=geo[n.m];if(!k)continue;x=k.x+2;w=k.w-4}else{x=lanesX[n.lane].x;w=lanesX[n.lane].w}
  g.fillStyle=n.hit?col[n.hit]:(geo&&geo[n.m].b?'#ff9a3c':'#ffb066');g.globalAlpha=n.hit==='miss'?.45:1;const r=4;g.beginPath();g.roundRect?g.roundRect(x,Math.min(y0,y1-8),w,Math.max(8,y1-y0),r):g.rect(x,y0,w,y1-y0);g.fill();g.globalAlpha=1;
  if(geo&&w>16&&y1-y0>16){g.fillStyle='#1a1204';g.font='600 11px "Barlow Condensed",sans-serif';g.textAlign='center';g.fillText(NN[n.m%12],x+w/2,y1-5)}}
 // hit line
 g.fillStyle='#ffd54a';g.fillRect(0,hitY-1,W,2);
 // keyboard / pads
 const active=new Set([...MIDI.down]);const flashing=PR.fb.filter(f=>now-f.at<160&&f.n);
 if(geo){for(const pass of [0,1])for(let m=PR.lo;m<=PR.hi;m++){const k=geo[m];if(k.b!==!!pass)continue;const lit=active.has(m)||flashing.some(f=>f.n.m===m);g.fillStyle=lit?(k.b?'#3c9c52':'#9be6a8'):(k.b?'#17181b':'#f3f4f6');const h=k.b?kb*.6:kb;g.fillRect(k.x+(k.b?0:.5),hitY+1,k.w-(k.b?0:1),h-1);
   if(!k.b&&m%12===0){g.fillStyle='#6b7280';g.font='600 11px "Barlow Condensed",sans-serif';g.textAlign='center';g.fillText(flName(m),k.x+k.w/2,H-6)}
   if(!k.b&&!midiSupported()||(!k.b&&MIDI.state!=='on')){const t=TYPE[m];if(t){g.fillStyle='#9aa0a8';g.font='600 10px "IBM Plex Sans",sans-serif';g.textAlign='center';g.fillText(t,k.x+k.w/2,hitY+16)}}}}
 else{lanesX.forEach((l,i)=>{const lit=flashing.some(f=>f.n.lane===i);g.fillStyle=lit?'#ffb066':'#30353c';g.beginPath();g.roundRect?g.roundRect(l.x,hitY+8,l.w,kb-16,8):g.rect(l.x,hitY+8,l.w,kb-16);g.fill();g.fillStyle=lit?'#1d0e00':'#c9ced5';g.font='600 13px "IBM Plex Sans",sans-serif';g.textAlign='center';g.fillText(`${LANES[i]} · pad ${i+1} · ${'ASDF'[i]}`,l.x+l.w/2,hitY+kb/2+4)})}
 // feedback text
 PR.fb=PR.fb.filter(f=>now-f.at<700);for(const f of PR.fb){if(!f.txt)continue;let x=W/2;if(f.n){x=geo?(geo[f.n.m].x+geo[f.n.m].w/2):(lanesX[f.n.lane].x+lanesX[f.n.lane].w/2)}const a=1-(now-f.at)/700;g.globalAlpha=a;g.fillStyle=col[f.cls]||'#fff';g.font='700 14px "IBM Plex Sans",sans-serif';g.textAlign='center';g.fillText(f.txt,x,hitY-14-(1-a)*20);g.globalAlpha=1}
 // count-in
 if(PR.clock<0&&PR.state!=='idle'){g.fillStyle='#fff';g.font='700 48px "IBM Plex Sans",sans-serif';g.textAlign='center';g.fillText(String(Math.ceil(-PR.clock)),W/2,hitY/2)}
 if(PR.state==='idle'&&!PR.fb.length&&PR.clock<=-4){g.fillStyle='#c9ced5';g.font='500 15px "IBM Plex Sans",sans-serif';g.textAlign='center';g.fillText('Press Listen to hear it, then Play to go',W/2,hitY/2)}}
function prUI(){const s=PR.state;const pb=$('#prPlay'),lb=$('#prListen');if(pb)pb.textContent=s==='play'?'Stop':'Play';if(lb)lb.textContent=s==='listen'?'Stop':'Listen';if(s!=='idle'){const r=$('#prResult');if(r)r.innerHTML=''}}
/* computer keyboard input for practice */
addEventListener('keydown',e=>{if(!PR.ex||PR.state!=='play'||e.repeat||e.metaKey||e.ctrlKey||e.altKey)return;if(/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName))return;const k=e.key.toLowerCase();
 if(PR.ex.kind==='pads'){const i='asdf'.indexOf(k);if(i>=0){e.preventDefault();e.stopImmediatePropagation();prInput({lane:i,vel:1})}}else{const m=KEYOF[k];if(m!==undefined){e.preventDefault();e.stopImmediatePropagation();prInput({note:m,vel:1})}}},true);
/* ---- pages ---- */
function viewPractice(){const groups=[['theory','Music theory on the keys'],['beat','Beat parts on keys and pads']];
 render(`${crumb('Practice')}<h1>Practice</h1><p class="lede">Short play-along exercises. Notes fall towards the keys or pads; hit them as they cross the line. Each run is scored on timing, and your best result is saved here.</p>
${midiBox()}
${groups.map(([u,l])=>`<h2>${l}</h2><div class="list">${EXERCISES.filter(e=>e.unit===u).map(e=>`<a class="lrow" href="#practice-${e.id}"><span class="t">${e.title}</span><span class="d">${e.kind==='pads'?'Pads':'Keys'} · ${e.bpm} BPM${pBest[e.id]?` · best ${pBest[e.id].best}%`:''}</span><span class="r">${starHtml(pBest[e.id]?.stars||0)}</span></a>`).join('')}</div>`).join('')}`)}
function midiBox(){return `<div class="next midi-pill"><div><div class="k">Your keyboard</div><div class="t" data-midi-status>${midiStatusText()}</div><div class="small muted">${midiSupported()?'Notes and pads go straight into the exercises. No keyboard? Use the computer keys shown on screen.':'Safari and some browsers cannot read MIDI keyboards. You can still play with the computer keyboard.'}</div></div>${midiSupported()?'<button class="btn primary" data-midi-connect>Connect</button>':''}</div>`}
function viewExercise(id){const e=EXMAP[id];if(!e)return viewPractice();PR.ex=e;prRange(e);prReset();PR.state='idle';PR.wait=!!e.wait;PR.speed=1;const i=EXERCISES.indexOf(e),nx=EXERCISES[i+1];
 render(`${crumb(['Practice','#practice'],e.title)}<h1>${e.title}</h1><p class="lede">${e.about}</p>
<div class="row" style="margin-top:14px"><button class="btn" id="prListen">Listen</button><button class="btn primary" id="prPlay">Play</button>
<div class="seg" role="group" aria-label="Speed">${[.5,.75,1].map(s=>`<button class="seg-b ${s===1?'on':''}" data-speed="${s}">${Math.round(s*100)}%</button>`).join('')}</div>
<label class="chip"><input type="checkbox" id="prWait" ${PR.wait?'checked':''}> Wait mode</label><label class="chip"><input type="checkbox" id="prMetro" checked> Metronome</label>
<span class="small muted tnum" id="prBpm">${e.bpm} BPM</span></div>
<canvas id="prCanvas" class="pr-canvas" aria-label="Notes falling towards the ${e.kind==='pads'?'pads':'keys'}"></canvas>
<div id="prResult"></div>
${midiBox()}
<p class="small muted">${e.kind==='pads'?'Pads: kick, snare, hat and open hat are pads 1–4 in bank A on most controllers, or the A S D F keys.':'No keyboard connected? Use the letters shown on the keys (Z to M and Q to I), like FL\'s typing keyboard.'} ${pBest[id]?`Your best: ${pBest[id].best}%.`:''}</p>
<div class="lessonnav"><a class="btn" href="#lesson-${e.lesson}">Back to the lesson</a>${nx?`<a class="btn primary" href="#practice-${nx.id}">Next: ${nx.title}</a>`:'<a class="btn primary" href="#practice">All exercises</a>'}</div>`);
 $('#prPlay').onclick=()=>PR.state==='play'?prStop():prStart('play');$('#prListen').onclick=()=>PR.state==='listen'?prStop():prStart('listen');
 $$('[data-speed]').forEach(b=>b.onclick=()=>{PR.speed=+b.dataset.speed;$$('[data-speed]').forEach(x=>x.classList.toggle('on',x===b));$('#prBpm').textContent=Math.round(e.bpm*PR.speed)+' BPM'});
 $('#prWait').onchange=ev=>{PR.wait=ev.target.checked};$('#prMetro').onchange=ev=>{PR.metro=ev.target.checked};
 requestAnimationFrame(()=>prDraw(performance.now()))}

/* ================= views ================= */
LESSONS.splice(LESSONS.findIndex(l=>l.id==='melody')+1,0,SAMPLING);LMAP.sampling=SAMPLING;
const LPRACTICE={drums:['half-time','trap-groove','hat-roll','rage-drums'],'808':['roots-808'],melody:['pluggnb-chords','hook'],midi:['find-c']};
const V=$('#view');
function render(html,wide){for(const k in DDH)if(k!=='tBeat')delete DDH[k];V.classList.remove('view-in');V.classList.toggle('wide',!!wide);V.innerHTML=html;[...V.children].forEach((c,i)=>c.style.setProperty('--i',Math.min(i,10)));void V.offsetWidth;V.classList.add('view-in');mountFigs(V);bindHW(V);midiUI();fitAll();requestAnimationFrame(fitAll);setTimeout(fitAll,300);if(document.fonts)document.fonts.ready.then(fitAll)}
const crumb=(...p)=>`<div class="crumb">${p.map(x=>Array.isArray(x)?`<a href="${x[1]}">${x[0]}</a>`:x).join(' / ')}</div>`;
const profileBar=()=>{const k=K();return `<div class="meta-row"><a class="pill" href="#setup">${k.short}</a><a class="pill" href="#setup">FL ${EDNAME[prof.edition]}</a><a class="pill" href="#plugins">${prof.have.length} plugins</a><a class="pill" href="#setup">${prof.os==='mac'?'Mac':'Windows'}</a></div>`};
const lessonRow=(l,i)=>`<a class="lrow" href="#lesson-${l.id}"><span class="t"><span class="n">${i}</span>${l.title()}</span><span class="d">${l.mod}</span><span class="r">${done[l.id]?'<span class="ok">Done</span>':l.min+' min'}</span></a>`;
const recipeRow=r=>`<a class="lrow" href="#beat-${r.id}"><span class="t">${r.name}</span><span class="d">${r.lane} · ${r.key}</span><span class="r">${r.bpm} BPM</span></a>`;
const rackRows=r=>Object.entries(r.drums).map(([l,p],i)=>({name:l,lane:l,pat:p,color:LANECOL[l],trk:i+1}));
function viewHome(){const idx=LESSONS.findIndex(l=>!done[l.id]);const ni=idx<0?0:idx,next=LESSONS[ni];const n=LESSONS.filter(l=>done[l.id]).length;
 render(`<h1>Make beats in FL Studio with ${midiMode()?'your '+K().short:'your computer keyboard'}</h1>
<p class="lede">Set up, drums, 808s, melodies, sampling, mixing and export, with every FL window drawn and labelled. Then practise along with your keyboard and build real beats.</p>
<div class="next"><div><div class="k">${n?`Next up · lesson ${ni} of ${LESSONS.length-1}`:'Start here'}</div><div class="t">${next.title()}</div></div><a class="btn primary" href="#lesson-${next.id}">${n?'Continue':'Start the course'}</a></div>
<h2>${midiMode()?'Your '+K().short:'Your keyboard'}</h2><p class="muted small" style="margin-top:4px">Play it: pads, keys and knobs work here${midiMode()?', and the ▶ button plays the beat in the top bar':''}. Wrong keyboard? <a href="#setup">Change it in My setup</a>.</p>
${controller({})}
<div class="split"><section><h2>Course</h2><div class="list">${LESSONS.map(lessonRow).join('')}</div></section>
<section><h2>Beat recipes</h2><div class="list">${RECIPES.map(recipeRow).join('')}</div></section></div>`,true)}

function viewSetup(){render(`${crumb('My setup')}<h1>Tell the course what you have</h1><p class="lede">Lessons, drawings and recipes rewrite themselves for your keyboard, FL edition and plugins. Saved in this browser only.</p>
<div class="setrow"><div><h2>Keyboard</h2><p>The drawings, button names and setup steps follow this choice.</p></div><div class="opts">${Object.entries(KEYBOARDS).map(([id,k])=>`<label class="opt"><input type="radio" name="kb" value="${id}" id="kb-${id}" ${prof.kb===id?'checked':''}><span><b>${k.name}</b><small>${id==='none'?'Typing keyboard and mouse':k.summary.split(',').slice(0,2).join(',')}</small></span></label>`).join('')}</div></div>
<div class="setrow"><div><h2>FL Studio edition</h2><p>Sets which stock plugins are ticked. Fine-tune on <a href="#plugins">Plugins</a>.</p></div><div class="opts">${ED.map(e=>`<label class="opt"><input type="radio" name="ed" value="${e}" id="ed-${e}" ${prof.edition===e?'checked':''}><span><b>${EDNAME[e]}</b><small>${{fruity:'Entry level: no audio recording, up to 8 audio clips',producer:'Audio recording, Edison, Sytrus, stem separation',signature:'Adds Gross Beat, NewTone, Pitcher, Harmless, Vintage Chorus',all:'Everything, including Harmor and Transistor Bass'}[e]}</small></span></label>`).join('')}</div></div>
<div class="setrow"><div><h2>Computer</h2><p>Shortcuts use Cmd on Mac and Ctrl on Windows.</p></div><div class="opts">${[['mac','Mac'],['win','Windows']].map(([v,n])=>`<label class="opt"><input type="radio" name="os" value="${v}" id="os-${v}" ${prof.os===v?'checked':''}><span><b>${n}</b></span></label>`).join('')}</div></div>
<h2>Your controller</h2><p class="muted small" id="kbSummary" style="margin-top:4px">${K().summary}</p><div id="setupPreview">${controller({})}</div>
<div class="row" style="margin-top:20px"><a class="btn primary" href="#lesson-start">Start the course</a><a class="btn" href="#plugins">Choose plugins</a></div>`,true);
 const redraw=()=>{const sp=$('#setupPreview');sp.innerHTML=controller({});$('#kbSummary').textContent=K().summary;bindHW(sp);fitAll()};
 $$('input[name=kb]').forEach(i=>i.addEventListener('change',()=>{prof.kb=i.value;saveProf();renderNav();redraw();toast('Keyboard: '+K().short)}));
 $$('input[name=ed]').forEach(i=>i.addEventListener('change',()=>{prof.edition=i.value;const free=prof.have.filter(id=>P[id].src==='free');prof.have=[...defaultHave(i.value),...free];saveProf();toast(EDNAME[i.value]+' edition set')}));
 $$('input[name=os]').forEach(i=>i.addEventListener('change',()=>{prof.os=i.value;saveProf();toast('Shortcuts updated')}))}

function viewBeats(){render(`${crumb('Beat recipes')}<h1>Beat recipes</h1><p class="lede">Each recipe opens as FL windows that play: the Channel Rack, piano rolls for chords, 808 and melody, the Mixer and the Playlist. Chords light up on ${midiMode()?'your '+K().short:'the typing keyboard'} so you know what to press.</p>
<div class="tablewrap"><table><thead><tr><th>Recipe</th><th>Style</th><th>Key</th><th class="num">BPM</th></tr></thead><tbody>${RECIPES.map(r=>`<tr><td><a href="#beat-${r.id}"><b>${r.name}</b></a><div class="small muted">${r.vibe}</div></td><td>${r.lane}<div class="small muted">${r.ref}</div></td><td>${r.key}</td><td class="num">${r.bpm}</td></tr>`).join('')}</tbody></table></div>
${tip('About “type beats”','Recipes teach the ingredients of a style: tempo, drums, chord colour, sound design. The artist names help you find the sound; nothing here copies a real song, and your beat should not either.')}`)}

function viewLesson(id){const l=LMAP[id];if(!l)return viewHome();const i=LESSONS.indexOf(l),prev=LESSONS[i-1],next=LESSONS[i+1];
 render(`${crumb(['Course','#home'],l.mod,i===0?'Intro':'Lesson '+i+' of '+(LESSONS.length-1))}<h1>${l.title()}</h1><p class="small muted" style="margin-top:6px">${l.min} min · written for ${K().name} · <a href="#setup">change</a></p><div class="lesson">${l.body()}</div>${practiceCard(l.practice||LPRACTICE[l.id]||[])}
<div class="lessonnav"><div>${prev?`<a class="btn" href="#lesson-${prev.id}">Back: ${prev.title()}</a>`:''}</div><div class="row"><button class="btn" id="doneBtn">${done[id]?'Done ✓':'Mark as done'}</button>${next?`<a class="btn primary" href="#lesson-${next.id}">Next: ${next.title()}</a>`:`<a class="btn primary" href="#beats">Make a beat</a>`}</div></div>`);
 $('#doneBtn').onclick=()=>{done[id]=!done[id];store.set('done',done);renderNav();$('#doneBtn').textContent=done[id]?'Done ✓':'Mark as done';if(done[id])toast('Lesson marked done')};
 const checks=store.get('checks',{});$$('.check input').forEach(c=>{c.checked=!!checks[c.id];c.addEventListener('change',()=>{checks[c.id]=c.checked;store.set('checks',checks)})});
 const mt=$('#midiTest');if(mt)mt.onclick=()=>midiConnect();bindChop();bindLabs();bindTheory();
 const sim=$('.sim');if(sim){$$('[data-win]',sim).forEach(b=>b.addEventListener('click',()=>simShow(sim,b.dataset.win)));simShow(sim,'Channel rack')}}

/* ================= nav / routing ================= */
const ICO={home:'<svg class="ico" viewBox="0 0 16 16"><path d="M2.5 7.5L8 3l5.5 4.5V13h-11z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',setup:'<svg class="ico" viewBox="0 0 16 16"><path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="4" r="1.6" fill="#fff" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="8" r="1.6" fill="#fff" stroke="currentColor" stroke-width="1.4"/><circle cx="5" cy="12" r="1.6" fill="#fff" stroke="currentColor" stroke-width="1.4"/></svg>',beats:'<svg class="ico" viewBox="0 0 16 16"><rect x="2" y="2" width="3" height="3" rx=".5" fill="currentColor"/><rect x="6.5" y="2" width="3" height="3" rx=".5" fill="none" stroke="currentColor"/><rect x="11" y="2" width="3" height="3" rx=".5" fill="currentColor"/><rect x="2" y="6.5" width="3" height="3" rx=".5" fill="none" stroke="currentColor"/><rect x="6.5" y="6.5" width="3" height="3" rx=".5" fill="currentColor"/><rect x="11" y="6.5" width="3" height="3" rx=".5" fill="none" stroke="currentColor"/><rect x="2" y="11" width="3" height="3" rx=".5" fill="currentColor"/><rect x="6.5" y="11" width="3" height="3" rx=".5" fill="none" stroke="currentColor"/><rect x="11" y="11" width="3" height="3" rx=".5" fill="currentColor"/></svg>',songs:'<svg class="ico" viewBox="0 0 16 16"><path d="M1.5 8h2l1.5-4 2 8 2-10 2 9 1.5-3h2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',keys:'<svg class="ico" viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 2.5v7M10.5 2.5v7M8 9.5v4" stroke="currentColor" stroke-width="1.4"/></svg>',plugins:'<svg class="ico" viewBox="0 0 16 16"><path d="M5.5 1.5v4M10.5 1.5v4M3.5 5.5h9v2.5a4.5 4.5 0 0 1-9 0zM8 12.5v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',analyze:'<svg class="ico" viewBox="0 0 16 16"><path d="M1.5 8h1.5M4.5 4v8M7 2v12M9.5 5v6M12 3v10M14.5 8h0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',practice:'<svg class="ico" viewBox="0 0 16 16"><rect x="2" y="2" width="3" height="6" rx="1" fill="currentColor"/><rect x="6.5" y="5" width="3" height="5" rx="1" fill="currentColor"/><rect x="11" y="1" width="3" height="4" rx="1" fill="currentColor"/><path d="M1.5 13.5h13" stroke="currentColor" stroke-width="1.4"/></svg>',shortcuts:'<svg class="ico" viewBox="0 0 16 16"><rect x="1.5" y="4" width="13" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 10h7M4.5 7h1M7.5 7h1M10.5 7h1" stroke="currentColor" stroke-width="1.4"/></svg>'};
function renderNav(){const h=location.hash.slice(1)||'home';const a=(href,label,on,ico)=>`<a href="#${href}" class="${on?'on':''}"${on?' aria-current="page"':''}>${ico}${label}</a>`;let html=a('home','Home',h==='home',ICO.home)+a('setup','My setup',h==='setup',ICO.setup);let grp='';
 LESSONS.forEach(l=>{if(l.mod!==grp){grp=l.mod;html+=`<div class="grp">${grp}</div>`}html+=`<a href="#lesson-${l.id}" class="${h==='lesson-'+l.id?'on':''}"${h==='lesson-'+l.id?' aria-current="page"':''}><span class="st-dot ${done[l.id]?'done':''}" aria-label="${done[l.id]?'Done':'Not done'}"></span>${l.title()}</a>`});
 html+=`<div class="grp">Make beats</div>`+a('practice','Practice',h.startsWith('practice'),ICO.practice)+a('beats','Beat recipes',h.startsWith('beat'),ICO.beats)+a('keys','Key finder',h==='keys',ICO.keys)+a('plugins','Plugins',h==='plugins',ICO.plugins)+a('shortcuts','Shortcuts',h==='shortcuts',ICO.shortcuts);
 $('#nav').innerHTML=html;const n=LESSONS.filter(l=>done[l.id]).length;$('#progBar').style.width=(n/LESSONS.length*100)+'%';$('#progTxt').textContent=`${n} of ${LESSONS.length}`}
function route(){const h=location.hash.slice(1)||'home';drone(null);if(PR.state!=='idle')prStop();PR.ex=null;
 if(h==='setup')viewSetup();else if(h==='plugins')viewPlugins();else if(h==='beats')viewBeats();else if(h==='keys')viewKeys();else if(h==='practice')viewPractice();else if(h.startsWith('practice-'))viewExercise(h.slice(9));else if(h==='shortcuts')viewShortcuts();else if(h.startsWith('lesson-'))viewLesson(h.slice(7));else if(h.startsWith('beat-'))viewBeat(h.slice(5));else viewHome();
 renderNav();syncBtns();window.scrollTo(0,0)}
addEventListener('hashchange',route);
$('#tBeatDD').innerHTML=ddHtml('tBeat',RECIPES.map(r=>({v:r.id,l:r.name,sel:r.id===cur.id})),'up-only');
$('#tBpm').innerHTML=`<b>${cur.bpm}</b> BPM`;
ddOn('tBeat',v=>{const was=seq.on;setBeat(v);if(location.hash.startsWith('#beat-'))location.hash='#beat-'+v;else route();if(was)startSeq()});
$('#tPlay').onclick=()=>{seq.on?stopSeq():startSeq()};
$('#tStop').onclick=()=>stopSeq();
addEventListener('resize',()=>{if(chop.buf)drawChop()});
route();
