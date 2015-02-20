// Copyright 2002-2015, University of Colorado Boulder

/**
 * Type for playing audio tones of finite duration, part of sonification prototype.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var Timer = require( 'JOIST/Timer' );

  // audio
  var impulseResponse = new Sound( require( 'audio!BEERS_LAW_LAB/stairwell_ortf.ogg' ) );

  // constants
  var MAX_GAIN = 0.6;

  /**
   * @constructor
   */
  function TonePlayer() {

    // create an audio context
    this.audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    // create an oscillator that will provide the basic sound waveform
    this.oscillator1 = this.audioContext.createOscillator();
    this.oscillator1.type = 'triangle';

    // Create the gain control that will be used to control the sound volume, including making it entirely silent when
    // the tone finishes playing.
    this.envelope = this.audioContext.createGain();
    this.envelope.gain.value = 0;

    // create a convolver that will be used to add a bit of reverb to the sound
    var reverb = this.audioContext.createConvolver();

    // interconnect the various audio nodes
    this.oscillator1.connect( this.envelope );
    this.envelope.connect( reverb );
    reverb.connect( this.audioContext.destination );

    // start the oscillator running
    this.oscillator1.start( 0 );

    // Load the impulse response into the convolver. This is necessary because of the async load of the impulse
    // response buffer.
    var attemptLoad = function() {
      if ( typeof( impulseResponse.audioBuffer ) !== 'undefined' ) {
        reverb.buffer = impulseResponse.audioBuffer;
        console.log( 'loaded' );
      }
      else {
        Timer.setTimeout( 500, attemptLoad );
        console.log( 'going around again' );
      }
      return false;
    }();
  }

  return inherit( Object, TonePlayer, {
    play: function( frequency ) {
      var now = this.audioContext.currentTime;
      this.oscillator1.frequency.linearRampToValueAtTime( frequency, now );
      this.envelope.gain.linearRampToValueAtTime( MAX_GAIN, now + 0.020 );
      this.envelope.gain.setTargetAtTime( 0, now + 0.2, 0.1 );
    }
  } );
} );