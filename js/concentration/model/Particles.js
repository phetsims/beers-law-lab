// Copyright 2015, University of Colorado Boulder

/**
 * Base type for a collection of particles.
 *
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function Particles() {
    this.particles = []; // @public the particles in the collection
    this.changedCallbacks = []; // @protected called when the collection of particles changes
  }

  return inherit( Object, Particles, {

    /**
     * Registers a callback that will be called when the collection of particles changes in some way
     * (eg, number of particles, particles move, ...)
     * @param {function} callback
     * @public
     */
    registerChangedCallback: function( callback ) {
      this.changedCallbacks.push( callback );
    }
  } );
} );
