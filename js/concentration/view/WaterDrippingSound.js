// Copyright 2002-2015, University of Colorado Boulder

/**
 * Sound generator for water dripping into a container.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundUtil = require( 'VIBE/SoundUtil' );

  // audio
  var WATER_DRIPPING_AUDIO = require( 'audio!BEERS_LAW_LAB/water-dripping-1' );

  /**
   *
   * @constructor
   */
  function WaterDrippingSound() {

    // create an audio context
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    // set up the sound source for flowing water
    var waterDrippingSourceSound = audioContext.createBufferSource();
    SoundUtil.loadSoundIntoAudioSource( waterDrippingSourceSound, WATER_DRIPPING_AUDIO );
    waterDrippingSourceSound.loop = true;
    waterDrippingSourceSound.start();

    // filter
    this.filter = audioContext.createBiquadFilter();
    this.filter.type = this.filter.LOWPASS;

    // gain control
    this.gainControl = audioContext.createGain();
    this.gainControl.gain.value = 0;

    // Hook the nodes together.
    waterDrippingSourceSound.connect( this.filter );
    this.filter.connect( this.gainControl );
    this.gainControl.connect( audioContext.destination );
  }

  return inherit( Object, WaterDrippingSound, {
    on: function() { this.gainControl.gain.value = 0.5; },
    off: function() { this.gainControl.gain.value = 0; },
    setWaterLevel: function( waterLevel ) {
      this.filter.frequency.value = 300 + waterLevel * 5000;
    }
  } );
} );