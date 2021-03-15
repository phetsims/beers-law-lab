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

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';

class ConcentrationMeter extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      bodyPosition: Vector2.ZERO,
      bodyDragBounds: Bounds2.EVERYTHING,
      probePosition: Vector2.ZERO,
      probeDragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public
    this.valueProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioType: Property.PropertyIO( NullableIO( NumberIO ) ),
      phetioDocumentation: 'mol/L or % concentration, depending on the concentrationMeterUnits query parameter. ' +
                           'null if the meter is not reading a value'
    } );

    // @public (read-only)
    this.body = new BLLMovable( {
      position: options.bodyPosition,
      dragBounds: options.bodyDragBounds,
      tandem: options.tandem.createTandem( 'body' )
    } );
    this.probe = new BLLMovable( {
      position: options.probePosition,
      dragBounds: options.probeDragBounds,
      tandem: options.tandem.createTandem( 'probe' )
    } );
  }

  // @public
  reset() {
    this.valueProperty.reset();
    this.body.reset();
    this.probe.reset();
  }
}

beersLawLab.register( 'ConcentrationMeter', ConcentrationMeter );
export default ConcentrationMeter;