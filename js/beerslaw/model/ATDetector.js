// Copyright 2013-2015, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T)
 * of light passing through a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {Absorbance} absorbance
   * @param {Tandem} tandem
   * @constructor
   */
  function ATDetector( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds, light, cuvette, absorbance, tandem ) {

    var thisDetector = this;

    thisDetector.light = light; // @private
    thisDetector.body = new Movable( bodyLocation, bodyDragBounds, tandem.createTandem( 'body' ) ); // @public
    thisDetector.probe = new Probe( probeLocation, probeDragBounds, 0.57, tandem.createTandem( 'probe' ) ); // @public

    // @public for switching between absorbance (A) and percent transmittance (%T)
    thisDetector.modeProperty = new Property( ATDetector.Mode.TRANSMITTANCE, { tandem: tandem.createTandem( 'mode' ) } );

    // @public value is either absorbance (A) or percent transmittance (%T) depending on mode
    thisDetector.valueProperty = new DerivedProperty( [
        thisDetector.probe.locationProperty,
        thisDetector.light.onProperty,
        thisDetector.modeProperty,
        cuvette.widthProperty,
        absorbance.absorbanceProperty
      ],
      function( probeLocation, lightOn, mode, cuvetteWidth, absorbanceValue ) {
        // Computes the displayed value, NaN if the light is off or the probe is outside the beam.
        var value = NaN;
        if ( thisDetector.probeInBeam() ) {
          // path length is between 0 and cuvette width
          var pathLength = Math.min( Math.max( 0, probeLocation.x - cuvette.location.x ), cuvetteWidth );
          if ( thisDetector.modeProperty.get() === ATDetector.Mode.ABSORBANCE ) {
            value = absorbance.getAbsorbanceAt( pathLength );
          }
          else {
            value = 100 * absorbance.getTransmittanceAt( pathLength );
          }
        }
        return value;
      } );
  }

  beersLawLab.register( 'ATDetector', ATDetector );

  /**
   * The probe, whose position indicates where the measurement is being made.
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {number} sensorDiameter cm
   * @param {Tandem} tandem
   * @constructor
   */
  function Probe( location, dragBounds, sensorDiameter, tandem ) {
    Movable.call( this, location, dragBounds, tandem );
    this.sensorDiameter = sensorDiameter; // @private
  }

  beersLawLab.register( 'ATDetector.Probe', Probe );

  inherit( Movable, Probe, {

    // @public
    getMinY: function() {
      return this.locationProperty.get().y - ( this.sensorDiameter / 2 );
    },

    // @public
    getMaxY: function() {
      return this.locationProperty.get().y + ( this.sensorDiameter / 2 );
    }
  } );

  return inherit( Object, ATDetector, {

    // @public
    reset: function() {
      this.body.reset();
      this.probe.reset();
      this.modeProperty.reset();
    },

    // @public Is the probe in some segment of the beam?
    probeInBeam: function() {
      return this.light.onProperty.get() &&
             ( this.probe.getMinY() < this.light.getMinY() ) &&
             ( this.probe.getMaxY() > this.light.getMaxY() ) &&
             ( this.probe.locationProperty.get().x > this.light.location.x );
    }
  }, {
    // @static Modes for the detector
    Mode: {
      'TRANSMITTANCE': 0,
      'ABSORBANCE': 1
    }
  } );
} );