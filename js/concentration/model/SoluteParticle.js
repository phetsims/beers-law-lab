// Copyright 2013-2019, University of Colorado Boulder

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Property = require( 'AXON/Property' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Color} color
   * @param {number} size particles are square, this is the length of one side
   * @param {Vector2} location location of the particle in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   * @constructor
   */
  function SoluteParticle( color, size, location, orientation, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.color = color;
    this.size = size;
    this.orientation = orientation;

    // @public
    this.locationProperty = new Property( location );

    PhetioObject.call( this, options );
  }

  beersLawLab.register( 'SoluteParticle', SoluteParticle );

  return inherit( PhetioObject, SoluteParticle );
} );