// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for ShakerParticles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var ShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticle' );
  var ShakerParticleIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticleIO' );
  var Vector2 = require( 'DOT/Vector2' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {ShakerParticles} shakerParticles
   * @param {string} phetioID
   * @constructor
   */
  function ShakerParticlesIO( shakerParticles, phetioID ) {
    ObjectIO.call( this, shakerParticles, phetioID );
  }

  phetioInherit( ObjectIO, 'ShakerParticlesIO', ShakerParticlesIO, {}, {

    documentation: 'Base type for a group of particles.',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.ShakerParticles },

    /**
     * Overrides the super type toStateObject (which was grabbing JSON for the entire instance) to return an empty instance.
     * The state is set through child instances and composition.
     * @returns {Object}
     */
    toStateObject: function() {return {};},

    /**
     * Clears the children from the model so it can be deserialized.
     * @param {ShakerParticles} shakerParticles
     */
    clearChildInstances: function( shakerParticles ) {
      validate( shakerParticles, this.validator );

      shakerParticles.removeAllParticles();

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    },

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {ShakerParticles} shakerParticles
     * @param {Tandem} tandem
     * @param {Object} stateObject
     * @returns {ChargedParticle}
     */
    addChildInstance: function( shakerParticles, tandem, stateObject ) {
      validate( shakerParticles, this.validator );

      var value = ShakerParticleIO.fromStateObject( stateObject );
      assert && assert( value.acceleration instanceof Vector2, 'acceleration should be a Vector2' );

      shakerParticles.addParticle( new ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration, {
          tandem: tandem
        }
      ) );

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    }
  } );

  beersLawLab.register( 'ShakerParticlesIO', ShakerParticlesIO );

  return ShakerParticlesIO;
} );