// Copyright 2002-2013, University of Colorado Boulder

/**
 * A cuvette is a small tube of circular or square cross section, sealed at one end,
 * made of plastic, glass, or fused quartz (for UV light) and designed to hold samples
 * for spectroscopic experiments.
 * <p>
 * In this case, the cuvette is the vessel that holds the solution.
 * It has a fixed height, but a variable width, making it possible to change
 * the path length. Location is fixed.  Origin is at the upper-left corner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} location fixed location, cm
   * @param {Range} widthRange variable width, cm
   * @param {number} height fixed height, cm
   * @constructor
   */
  function Cuvette( location, widthRange, height ) {

    // @public (read-only)
    this.location = location;
    this.widthRange = widthRange;
    this.widthProperty = new Property( widthRange.defaultValue );
    this.height = height;
  }

  return inherit( Object, Cuvette, {

    // @public
    reset: function() {
      this.widthProperty.reset();
    }
  } );
} );
