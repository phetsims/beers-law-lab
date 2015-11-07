// Copyright 2013-2015, University of Colorado Boulder

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );

  /**
   * Constructor
   * @param {Solute} solute
   * @param {Vector2} location location in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @constructor
   */
  function PrecipitateParticle( solute, location, orientation ) {
    SoluteParticle.call( this, solute.particleColor, solute.particleSize, location, orientation );
  }

  return inherit( SoluteParticle, PrecipitateParticle );
} );
