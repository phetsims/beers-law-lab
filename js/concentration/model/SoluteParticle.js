// Copyright 2013-2017, University of Colorado Boulder

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Tandem = require( 'TANDEM/Tandem' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IOObject = require( 'TANDEM/IOObject' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Color} color
   * @param {number} size particles are square, this is the length of one side
   * @param {Vector2} location location of the particle in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   * @constructor
   */
  function SoluteParticle( color, size, location, orientation, options ) {

    options = _.extend( {
      tandem: Tandem.required
    }, options );

    // @public (read-only)
    this.color = color;
    this.size = size;
    this.orientation = orientation;

    // @public
    this.locationProperty = new Property( location );

    IOObject.call( this, options );
  }

  beersLawLab.register( 'SoluteParticle', SoluteParticle );

  return inherit( IOObject, SoluteParticle );
} );