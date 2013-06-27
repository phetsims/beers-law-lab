// Copyright 2002-2013, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T)
 * of light passing through a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Movable = require( "common/model/Movable" );
  var Property = require( "AXON/Property" );

  /**
   * The probe, whose position indicates where the measurement is being made.
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Number} sensorDiameter cm
   * @constructor
   */
  function Probe( location, dragBounds, sensorDiameter ) {

    var thisProbe = this;
    Movable.call( thisProbe, location, dragBounds );

    thisProbe.sensorDiameter = sensorDiameter;
  }

  inherit( Movable, Probe, {

    getMinY: function() {
      return this.location.get().y - ( this.sensorDiameter / 2 );
    },

    getMaxY: function() {
      return this.location.get().y + ( this.sensorDiameter / 2 );
    }
  } );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {Absorbance} absorbance
   * @constructor
   */
  function ATDetector( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds, light, cuvette, absorbance ) {

    var thisDetector = this;

    thisDetector.light = light;
    thisDetector.mode = new Property( ATDetector.Mode.TRANSMITTANCE );
    thisDetector.body = new Movable( bodyLocation, bodyDragBounds );
    thisDetector.probe = new Probe( probeLocation, probeDragBounds, 0.57 );

    // Computes the displayed value, NaN if the light is off or the probe is outside the beam.
    var computeValue = function() {
      var value = NaN;
      if ( thisDetector.probeInBeam() ) {
        // path length is between 0 and cuvette width
        var pathLength = Math.min( Math.max( 0, thisDetector.probe.location.get().x - cuvette.location.x ), cuvette.width.get() );
        if ( thisDetector.mode.get() === ATDetector.Mode.ABSORBANCE ) {
          value = absorbance.getAbsorbanceAt( pathLength );
        }
        else {
          value = 100 * absorbance.getTransmittanceAt( pathLength );
        }
      }
      return value;
    };

    thisDetector.value = new Property( computeValue() );

    // observer dependencies for the value
    var updateValue = function() {
      thisDetector.value.set( computeValue() );
    };
    thisDetector.probe.location.link( updateValue );
    thisDetector.light.on.link( updateValue );
    thisDetector.probe.location.link( updateValue );
    thisDetector.mode.link( updateValue );
    absorbance.value.link( updateValue );
  }

  ATDetector.prototype = {

    reset: function() {
      this.body.reset();
      this.probe.reset();
      this.mode.reset();
    },

    // Is the probe in some segment of the beam?
    probeInBeam: function() {
      return this.light.on.get() &&
             ( this.probe.getMinY() < this.light.getMinY() ) &&
             ( this.probe.getMaxY() > this.light.getMaxY() ) &&
             ( this.probe.location.get().x > this.light.location.x );
    }
  };

  // JavaScript's sorry excuse for enum
  ATDetector.Mode = {
    "TRANSMITTANCE": 0,
    "ABSORBANCE": 1
  };

  return ATDetector;
} );