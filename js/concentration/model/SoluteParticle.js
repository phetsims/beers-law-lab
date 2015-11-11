// Copyright 2013-2015, University of Colorado Boulder

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor
   * @param {Color} color
   * @param {number} size particles are square, this is the length of one side
   * @param {Vector2} location location of the particle in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @constructor
   */
  function SoluteParticle( color, size, location, orientation ) {

    // @public (read-only)
    this.color = color;
    this.size = size;
    this.orientation = orientation;

    // @public
    this.locationProperty = new Property( location );

  }

  beersLawLab.register( 'SoluteParticle', SoluteParticle );

  return SoluteParticle;
} );