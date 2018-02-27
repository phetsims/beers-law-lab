// Copyright 2013-2017, University of Colorado Boulder

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
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var NullableIO = require( 'ifphetio!PHET_IO/types/NullableIO' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {Absorbance} absorbance
   * @param {Object} [options]
   * @constructor
   */
  function ATDetector( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds, light, cuvette, absorbance, options ) {

    var self = this;

    options = _.extend( { tandem: Tandem.required }, options );

    this.light = light; // @private
    this.body = new Movable( bodyLocation, bodyDragBounds, {
      tandem: options.tandem.createTandem( 'body' )
    } ); // @public
    this.probe = new Probe( probeLocation, probeDragBounds, 0.57, {
      tandem: options.tandem.createTandem( 'probe' )
    } ); // @public

    // @public for switching between absorbance (A) and percent transmittance (%T)
    this.modeProperty = new Property( ATDetector.Mode.TRANSMITTANCE, {
      tandem: options.tandem.createTandem( 'modeProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    // @public value is either absorbance (A) or percent transmittance (%T) depending on mode
    this.valueProperty = new DerivedProperty( [
        this.probe.locationProperty,
        this.light.onProperty,
        this.modeProperty,
        cuvette.widthProperty,
        absorbance.absorbanceProperty
      ],
      function( probeLocation, lightOn, mode, cuvetteWidth, absorbanceValue ) {
        // Computes the displayed value, null if the light is off or the probe is outside the beam.
        var value = null;
        if ( self.probeInBeam() ) {
          // path length is between 0 and cuvette width
          var pathLength = Math.min( Math.max( 0, probeLocation.x - cuvette.location.x ), cuvetteWidth );
          if ( self.modeProperty.get() === ATDetector.Mode.ABSORBANCE ) {
            value = absorbance.getAbsorbanceAt( pathLength );
          }
          else {
            value = 100 * absorbance.getTransmittanceAt( pathLength );
          }
        }
        return value;
      }, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( NumberIO ) )
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
      TRANSMITTANCE: 'transmittance',
      ABSORBANCE: 'absorbance'
    }
  } );
} );