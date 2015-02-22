// Copyright 2002-2015, University of Colorado Boulder

/**
 * Sound generator for water pouring into and draining out of a container.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundUtil = require( 'VIBE/SoundUtil' );

  // audio
  var WATER_FLOWING_AUDIO = require( 'audio!BEERS_LAW_LAB/water-flowing-1' );

  // constants
  var MIN_FREQUENCY = 100;
  var MAX_FREQUENCY = 400;

  /**
   *
   * @constructor
   */
  function WaterVolumeSound() {

    // create an audio context
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    /*
     TODO: Pink and brown noise generators were tried, but sounded pretty bad.  They are retained immediately below in
     case looping a sampled sound doesn't work.  If the looping works out, this code should be deleted.

     var bufferSize = 4096;
    var pinkNoise = (function() {
      var b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      var node = audioContext.createScriptProcessor( bufferSize, 1, 1 );
      node.onaudioprocess = function( e ) {
        var output = e.outputBuffer.getChannelData( 0 );
        for ( var i = 0; i < bufferSize; i++ ) {
          var white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[ i ] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[ i ] *= 0.11; // (roughly) compensate for gain
          b6 = white * 0.115926;
        }
      };
      return node;
    })();

    // Create the 'noise node'.
    //var bufferSize = 4096;
    var brownNoise = (function() {
      var lastOut = 0.0;
      var node = audioContext.createScriptProcessor( bufferSize, 1, 1 );
     var count = 0;
      node.onaudioprocess = function( e ) {
     console.log( 'count++ = ' + count++ );
        var output = e.outputBuffer.getChannelData( 0 );
        for ( var i = 0; i < bufferSize; i++ ) {
          var white = Math.random() * 2 - 1;
          output[ i ] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[ i ];
          output[ i ] *= 3.5; // (roughly) compensate for gain
        }
      };
      return node;
    })();
     */

    // set up the sound source for flowing water
    var waterFlowingSourceSound = audioContext.createBufferSource();
    SoundUtil.loadSoundIntoAudioSource( waterFlowingSourceSound, WATER_FLOWING_AUDIO );
    waterFlowingSourceSound.loop = true;
    waterFlowingSourceSound.start();

    // create an oscillator so that there is a pitch mixed in with the water sound
    this.oscillator1 = audioContext.createOscillator(); // Create sound source
    this.oscillator1.type = 'triangle';
    this.oscillator1.start( 0 );

    // volume control for oscillator
    var oscillatorVolumeControl = audioContext.createGain();
    oscillatorVolumeControl.gain.value = 0.00; // empirically determined

    // filter
    this.filter = audioContext.createBiquadFilter();
    this.filter.type = this.filter.LOWPASS;

    // gain control
    this.gainControl = audioContext.createGain();
    this.gainControl.gain.value = 0;

    // Hook the nodes together.
    //brownNoise.connect( this.filter );
    //pinkNoise.connect( this.filter );
    waterFlowingSourceSound.connect( this.filter );
    this.filter.connect( this.gainControl );
    this.oscillator1.connect( oscillatorVolumeControl );
    oscillatorVolumeControl.connect( this.filter );
    this.gainControl.connect( audioContext.destination );
  }

  return inherit( Object, WaterVolumeSound, {
    on: function() { this.gainControl.gain.value = 0.5; },
    off: function() { this.gainControl.gain.value = 0; },
    setWaterLevel: function( waterLevel ) {
      this.oscillator1.frequency.value = MIN_FREQUENCY + waterLevel * MAX_FREQUENCY;
      this.filter.frequency.value = 300 + waterLevel * 5000;
    }
  } );
} );