// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of the concentration meter.
 *
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ConcentrationMeter {

    /**
     * @param {Vector2} bodyPosition
     * @param {Bounds2} bodyDragBounds
     * @param {Vector2} probePosition
     * @param {Bounds2} probeDragBounds
     * @param {Object} [options]
     */
    constructor( bodyPosition, bodyDragBounds, probePosition, probeDragBounds, options ) {

      options = merge( {
        tandem: Tandem.REQUIRED
      }, options );

      // @public concentration in mol/L or percent, depending on the concentrationMeterUnits query parameter.
      // null if the meter is not reading a value
      this.valueProperty = new Property( null, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        units: 'moles/liter',
        phetioType: PropertyIO( NullableIO( NumberIO ) )
      } );

      // @public (read-only)
      this.body = new Movable( bodyPosition, bodyDragBounds, { tandem: options.tandem.createTandem( 'body' ) } );
      this.probe = new Movable( probePosition, probeDragBounds, { tandem: options.tandem.createTandem( 'probe' ) } );
    }

    // @public
    reset() {
      this.valueProperty.reset();
      this.body.reset();
      this.probe.reset();
    }
  }

  return beersLawLab.register( 'ConcentrationMeter', ConcentrationMeter );
} );