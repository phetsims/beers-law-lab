// Copyright 2002-2015, University of Colorado Boulder

/**
 * Type for playing audio tones of finite duration, part of sonification prototype.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var MAX_GAIN = 0.75;

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

    // interconnect the various audio nodes
    this.oscillator1.connect( this.envelope );
    this.envelope.connect( this.audioContext.destination );

    // start the oscillator running
    this.oscillator1.start( 0 );
  }

  return inherit( Object, TonePlayer, {
    play: function( frequency ) {
      this.oscillator1.frequency.value = frequency;
      var now = this.audioContext.currentTime;
      this.envelope.gain.linearRampToValueAtTime( MAX_GAIN, now + 0.030 );
      this.envelope.gain.setTargetAtTime( 0, now + 0.3, 0.15 );
    }
  } );
} );