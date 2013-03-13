// Copyright 2002-2013, University of Colorado

/**
 * Model of the concentration meter.
 * <p/>
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Movable = require( "common/model/Movable" );

  /**
   * @param {Vector2} bodyLocation
   * @param {Rectangle} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Rectangle} probeDragBounds
   * @constructor
   */
  function ConcentrationMeter( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds ) {
    this.value = new Property( NaN ); // NaN if the meter is not reading a value
    this.body = new Movable( bodyLocation, bodyDragBounds );
    this.probe = new Movable( probeLocation, probeDragBounds );
  }

  ConcentrationMeter.prototype.reset = function () {
    this.value.reset();
    this.body.reset();
    this.probe.reset();
  };

  return ConcentrationMeter;

} );