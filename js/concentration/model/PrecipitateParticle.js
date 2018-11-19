// Copyright 2013-2018, University of Colorado Boulder

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
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PrecipitateParticleIO = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticleIO' );
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );

  /**
   * @param {Solute} solute
   * @param {Vector2} location location in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   * @constructor
   */
  function PrecipitateParticle( solute, location, orientation, options ) {

    options = _.extend( {
      phetioType: PrecipitateParticleIO
    }, options );

    SoluteParticle.call( this, solute.particleColor, solute.particleSize, location, orientation, options );

    // @public (phet-io)
    this.solute = solute;
  }

  beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );

  return inherit( SoluteParticle, PrecipitateParticle );
} );
