// Copyright 2002-2013, University of Colorado

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var SoluteParticle = require( "concentration/model/SoluteParticle" );

  /**
   * Constructor
   * @param {Solute} solute
   * @param {Vector2} location location in the beaker's coordinate frame
   * @param {Number} orientation in radians
   * @constructor
   */
  function PrecipitateParticle( solute, location, orientation ) {
    SoluteParticle.call( solute.particleColor, solute.particleSize, location, orientation );
  }

  Inheritance.inheritPrototype( PrecipitateParticle, SoluteParticle );

  return PrecipitateParticle;
} );
