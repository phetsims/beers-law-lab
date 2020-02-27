// Copyright 2013-2020, University of Colorado Boulder

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Property = require( 'AXON/Property' );
  const Tandem = require( 'TANDEM/Tandem' );

  class SoluteParticle extends PhetioObject {

    /**
     * @param {Color} color
     * @param {number} size particles are square, this is the length of one side
     * @param {Vector2} position position of the particle in the beaker's coordinate frame
     * @param {number} orientation in radians
     * @param {Object} [options]
     */
    constructor( color, size, position, orientation, options ) {

      options = merge( {
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      // @public (read-only)
      this.color = color;
      this.size = size;
      this.orientation = orientation;

      // @public
      this.positionProperty = new Property( position );
    }
  }

  return beersLawLab.register( 'SoluteParticle', SoluteParticle );
} );