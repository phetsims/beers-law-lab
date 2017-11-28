// Copyright 2013-2017, University of Colorado Boulder

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
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );

  // phet-io modules
  var PrecipitateParticleIO = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticleIO' );

  /**
   * @param {Solute} solute
   * @param {Vector2} location location in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Tandem} tandem
   * @constructor
   */
  function PrecipitateParticle( solute, location, orientation, tandem ) {
    SoluteParticle.call( this, solute.particleColor, solute.particleSize, location, orientation );

    var self = this;

    // @public (phet-io)
    this.solute = solute;

    tandem.addInstance( this, {
      phetioState: true,
      phetioType: PrecipitateParticleIO
    } );

    // @private
    this.disposePrecipitateParticle = function() {
      tandem.removeInstance( self );
    };
  }

  beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );

  return inherit( SoluteParticle, PrecipitateParticle, {

    // @public
    dispose: function() {
      this.disposePrecipitateParticle();
      SoluteParticle.prototype.dispose && SoluteParticle.prototype.dispose.call( this );
    }
  } );
} );
