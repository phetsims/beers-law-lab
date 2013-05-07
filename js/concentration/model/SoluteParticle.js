// Copyright 2002-2013, University of Colorado

/**
 * Base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * Constructor
   * @param {Color} color
   * @param {Number} size particles are square, this is the length of one side
   * @param {Vector2} location location of the particle in the beaker's coordinate frame
   * @param {Number} orientation in radians
   * @constructor
   */
  function SoluteParticle( color, size, location, orientation ) {
    this.color = color;
    this.size = size;
    this.location = new Property( location );
    this.orientation = orientation;
  }

  return SoluteParticle;
} );