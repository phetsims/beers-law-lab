// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var MIN_FREQUENCY = 263;
  var MAX_FREQUENCY = 526;

  /**
   *
   * @constructor
   */
  function WaterVolumeSound() {
    var audioContext;
    if ( window.AudioContext ) {
      audioContext = new window.AudioContext();
    }
    else {
      audioContext = new window.webkitAudioContext();
    }

    // create and initialize the audio nodes
    this.oscillator1 = audioContext.createOscillator(); // Create sound source
    this.oscillator1.type = 'sine';
    this.gainControl = audioContext.createGain();
    this.gainControl.gain.value = 0;

    // hook up the audio nodes
    this.oscillator1.connect( this.gainControl );
    this.gainControl.connect( audioContext.destination );

    // start the oscillator
    this.oscillator1.start( 0 );
  }

  return inherit( Object, WaterVolumeSound, {
    on: function() { this.gainControl.gain.value = 0.7 },
    off: function() { this.gainControl.gain.value = 0 },
    setWaterLevel: function( waterLevel ) {
      this.oscillator1.frequency.value = MIN_FREQUENCY + waterLevel * MAX_FREQUENCY;
    }
  } );
} );