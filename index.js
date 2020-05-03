socket = io.connect(window.location.origin);

const notes = {
  'C5': 84,
  'B4': 83,
  'Bb4': 82,
  'A4': 81,
  'Ab4': 80,
  'G4': 79,
  'Gb4': 78,
  'F4': 77,
  'E4': 76,
  'Eb4': 75,
  'D4': 74,
  'Db4': 73,
  'C4': 72
}

const notes2 = {
  'C3': 84,
  'B2': 83,
  'Bb2': 82,
  'A2': 81,
  'Ab2': 80,
  'G2': 79,
  'Gb2': 78,
  'F2': 77,
  'E2': 76,
  'Eb2': 75,
  'D2': 74,
  'Db2': 73,
  'C2': 72
}


Tone.Transport.bpm.value = 120;
const bpm = 60000/Tone.Transport.bpm.value;


let drumSynths = [
	new Tone.MembraneSynth(),
	new Tone.MembraneSynth(),
	new Tone.MetalSynth(),
	new Tone.MetalSynth()
]

drumSynths.forEach(drumSynth => drumSynth.toDestination());

let synth = new Tone.PolySynth(Tone.Synth);
synth.toDestination();

let synth2 = new Tone.PolySynth(Tone.FMSynth);
synth2.toDestination();

socket.on('press-key', key => {
	let note = notes[key]
	let keyToPress = piano.keys.find(key => key.note === note);
	piano.toggleKey(keyToPress.note);
	console.log('got through')
})

socket.on('press-key2', key => {
	let note = notes2[key]
	let keyToPress = piano2.keys.find(key => key.note === note);
	piano2.toggleKey(keyToPress.note);
	console.log('got through2')
})

socket.on('seq-start', event => {
	console.log(event);
	if(event) {
		Nexus.context.resume();
		sequenceStart();
	} else {
		sequenceStop();
	}
})

socket.on('seq-stop', event => {
	sequenceStop();
})

socket.on('seq-send', pattern => {
	sequencer.matrix.set.all(pattern);
})

const playButton = new Nexus.TextButton('#play',{
    'size': [150,50],
    'state': false,
    'text': 'Play',
    'alternateText': 'Stop'
})


const sequencer = new Nexus.Sequencer('#sequencer', {
 	'size': [500,200],
 	'mode': 'toggle',
 	'rows': 4,
 	'columns': 8
})

const piano = new Nexus.Piano('#piano', {
	'size': [500,125],
	'mode': 'impulse',
	'lowNote': 72,
	'highNote': 84
});

const piano2 = new Nexus.Piano('#piano2', {
	'size': [500,125],
	'mode': 'impulse',
	'lowNote': 72,
	'highNote': 84
});

const triggerKeyPress = note => {

	socket.emit('press-key', note);

	synth.triggerAttackRelease(note, "3s");
	Tone.start();
}


const triggerKeyPress2 = note => {

	socket.emit('press-key2', note);

	synth2.triggerAttackRelease(note, "3s");
	Tone.start();
	
}

const triggerDrumSeq = (event, pattern, drumToPlay, drumNote) => {
	console.log(drumToPlay);
	// let pattern = sequencer.matrix.pattern;
	socket.emit('seq-send', pattern);
	drumToPlay.triggerAttackRelease(drumNote, "16n");
	

}

const sequenceStart = () => {
	Nexus.context.resume();
	Tone.Transport.start();
	sequencer.start(bpm);
	
}

const sequenceStop = () => {
	sequencer.stop();
}


const rows = sequencer.rows;
const drumNotes = ['G1', 'C2', 'C2', 'G4'];
let stepNumber = 0;
console.log(rows);


playButton.on('change', event => {
	if (event) {
		socket.emit('seq-start', event);
		sequenceStart();
	} 
	if (!event) {
		socket.emit('seq-stop', event);
		sequenceStop();
	}

})


sequencer.on('step', event => {

	console.log(event);
	console.log(sequencer.matrix.pattern);
	let pattern = sequencer.matrix.pattern;
	// let updatedSeq = sequencer.matrix.pattern;
	for(let i = 0; i < event.length; i++) {
		console.log(event.length)
		let drumToPlay = drumSynths[i];
		let drumNote = drumNotes[i];
		// let row = i;
		if(event[i] === 1) {
			triggerDrumSeq(event, pattern, drumToPlay, drumNote);

			
		}
	}
})

sequencer.on('change', event => {
	let pattern = sequencer.matrix.pattern;
	console.log(pattern);
	socket.emit('seq-send', pattern);
})







piano.on('change', event => {
	let note = event.note;
	let on = event.state;

	if( on && note === 72) {
		triggerKeyPress('C4');
	}
	if(on && note === 73) {
		triggerKeyPress('Db4');
	}
	if(on && note === 74) {
		triggerKeyPress('D4');
	}
	if(on && note === 75) {
		triggerKeyPress('Eb4');
	}
	if(on && note === 76) {
		triggerKeyPress('E4');
	}
	if(on && note === 77) {
		triggerKeyPress('F4');
	}
	if(on && note === 78) {
		triggerKeyPress('Gb4');
	}
	if(on && note === 79) {
		triggerKeyPress('G4');
	}
	if(on && note === 80) {
		triggerKeyPress('Ab4');
	}
	if(on && note === 81) {
		triggerKeyPress('A4');
	}
	if(on && note === 82) {
		triggerKeyPress('Bb4');
	}
	if(on && note === 83) {
		triggerKeyPress('B4');
	}
	if(on && note === 84) {
		triggerKeyPress('C5');
	}
})

piano2.on('change', event => {
	let note = event.note;
	let on = event.state;

	if( on && note === 72) {
		triggerKeyPress2('C2');
	}
	if(on && note === 73) {
		triggerKeyPress2('Db2');
	}
	if(on && note === 74) {
		triggerKeyPress2('D2');
	}
	if(on && note === 75) {
		triggerKeyPress2('Eb2');
	}
	if(on && note === 76) {
		triggerKeyPress2('E2');
	}
	if(on && note === 77) {
		triggerKeyPress2('F2');
	}
	if(on && note === 78) {
		triggerKeyPress2('Gb2');
	}
	if(on && note === 79) {
		triggerKeyPress2('G2');
	}
	if(on && note === 80) {
		triggerKeyPress2('Ab2');
	}
	if(on && note === 81) {
		triggerKeyPress2('A2');
	}
	if(on && note === 82) {
		triggerKeyPress2('Bb2');
	}
	if(on && note === 83) {
		triggerKeyPress2('B2');
	}
	if(on && note === 84) {
		triggerKeyPress2('C3');
	}
})