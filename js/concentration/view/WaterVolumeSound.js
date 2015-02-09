// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Timer = require( 'JOIST/Timer' );

  // constants
  var MIN_FREQUENCY = 263;
  var MAX_FREQUENCY = 526;

  /**
   *
   * @constructor
   */
  function WaterVolumeSound() {
    var self = this;

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
    this.lfoGainControl = audioContext.createGain();
    this.lfoGainControl.gain.value = 1;
    this.gainControl = audioContext.createGain();
    this.gainControl.gain.value = 0;

    // hook up the audio nodes
    this.oscillator1.connect( this.lfoGainControl );
    this.lfoGainControl.connect( this.gainControl );
    this.gainControl.connect( audioContext.destination );

    // start the oscillator
    this.oscillator1.start( 0 );

    // set up the low frequency oscillation
    //var counter = 0;
    //Timer.setInterval( function(){
    //  counter++;
    //  self.lfoGainControl.gain.value = counter / 1000;
    //  if ( counter > 1000 ){
    //    counter = 0;
    //  }
    //}, 60 );
  }

  return inherit( Object, WaterVolumeSound, {
    on: function() { this.gainControl.gain.value = 0.7 },
    off: function() { this.gainControl.gain.value = 0 },
    setWaterLevel: function( waterLevel ) {
      this.oscillator1.frequency.value = MIN_FREQUENCY + waterLevel * MAX_FREQUENCY;
    }
  } );
} );