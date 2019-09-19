// Copyright 2013-2018, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @param {Object} options
   * @constructor
   */
  function ConcentrationMeter( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds, options ) {

    options = _.extend( {
      tandem: Tandem.required
    }, options );

    // @public concentration in mol/L or percent, depending on the concentrationMeterUnits query parameter.
    // null if the meter is not reading a value
    this.valueProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      units: 'moles/liter',
      phetioType: PropertyIO( NullableIO( NumberIO ) )
    } );

    // @public (read-only)
    this.body = new Movable( bodyLocation, bodyDragBounds, { tandem: options.tandem.createTandem( 'body' ) } );
    this.probe = new Movable( probeLocation, probeDragBounds, { tandem: options.tandem.createTandem( 'probe' ) } );
  }

  beersLawLab.register( 'ConcentrationMeter', ConcentrationMeter );

  return inherit( Object, ConcentrationMeter, {

    // @public
    reset: function() {
      this.valueProperty.reset();
      this.body.reset();
      this.probe.reset();
    }
  } );

} );