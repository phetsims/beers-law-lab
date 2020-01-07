// Copyright 2013-2019, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T)
 * of light passing through a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const StringProperty = require( 'AXON/StringProperty' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Vector2} bodyPosition
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probePosition
   * @param {Bounds2} probeDragBounds
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {Absorbance} absorbance
   * @param {Object} [options]
   * @constructor
   */
  function ATDetector( bodyPosition, bodyDragBounds, probePosition, probeDragBounds, light, cuvette, absorbance, options ) {

    const self = this;

    options = merge( { tandem: Tandem.REQUIRED }, options );

    this.light = light; // @private
    this.body = new Movable( bodyPosition, bodyDragBounds, {
      tandem: options.tandem.createTandem( 'body' )
    } ); // @public
    this.probe = new Probe( probePosition, probeDragBounds, 0.57, {
      tandem: options.tandem.createTandem( 'probe' )
    } ); // @public

    // @public for switching between absorbance (A) and percent transmittance (%T)
    this.modeProperty = new StringProperty( ATDetector.Mode.TRANSMITTANCE, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    // @public value is either absorbance (A) or percent transmittance (%T) depending on mode
    this.valueProperty = new DerivedProperty( [
        this.probe.positionProperty,
        this.light.onProperty,
        this.modeProperty,
        cuvette.widthProperty,
        absorbance.absorbanceProperty
      ],
      function( probePosition, lightOn, mode, cuvetteWidth, absorbanceValue ) {
        // Computes the displayed value, null if the light is off or the probe is outside the beam.
        let value = null;
        if ( self.probeInBeam() ) {
          // path length is between 0 and cuvette width
          const pathLength = Math.min( Math.max( 0, probePosition.x - cuvette.position.x ), cuvetteWidth );
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
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {number} sensorDiameter cm
   * @param {Tandem} tandem
   * @constructor
   */
  function Probe( position, dragBounds, sensorDiameter, tandem ) {
    Movable.call( this, position, dragBounds, tandem );
    this.sensorDiameter = sensorDiameter; // @private
  }

  inherit( Movable, Probe, {

    // @public
    getMinY: function() {
      return this.positionProperty.get().y - ( this.sensorDiameter / 2 );
    },

    // @public
    getMaxY: function() {
      return this.positionProperty.get().y + ( this.sensorDiameter / 2 );
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
             ( this.probe.positionProperty.get().x > this.light.position.x );
    }
  }, {
    // @static Modes for the detector
    Mode: {
      TRANSMITTANCE: 'transmittance',
      ABSORBANCE: 'absorbance'
    }
  } );
} );