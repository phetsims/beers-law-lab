// Copyright 2013-2025, University of Colorado Boulder

/**
 * ConcentrationMeter is the model of the concentration meter in the 'Concentration' screen.
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
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';

type SelfOptions = {
  bodyPosition?: Vector2;
  bodyDragBounds?: Bounds2;
  probePosition?: Vector2;
  probeDragBounds?: Bounds2;
};

type ConcentrationMeterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ConcentrationMeter extends PhetioObject {

  public readonly bodyPosition: Vector2;
  public readonly valueProperty: Property<number | null>;
  public readonly probe: BLLMovable;

  public constructor( providedOptions: ConcentrationMeterOptions ) {

    const options = optionize<ConcentrationMeterOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      bodyPosition: Vector2.ZERO,
      bodyDragBounds: Bounds2.EVERYTHING,
      probePosition: Vector2.ZERO,
      probeDragBounds: Bounds2.EVERYTHING,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.valueProperty = new Property<number | null>( null, {
      // units vary, based on the value of global.model.preferences.concentrationMeterUnitsProperty.
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioFeatured: true,
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioDocumentation: 'Units are mol/L or % concentration, depending on the value of global.model.preferences.concentrationMeterUnitsProperty. ' +
                           'null if the meter is not reading a value.'
    } );

    this.bodyPosition = options.bodyPosition;

    this.probe = new BLLMovable( {
      position: options.probePosition,
      positionPropertyReadOnly: false,
      dragBounds: options.probeDragBounds,
      tandem: options.tandem.createTandem( 'probe' )
    } );
  }

  public reset(): void {
    this.valueProperty.reset();
    this.probe.reset();
  }
}

beersLawLab.register( 'ConcentrationMeter', ConcentrationMeter );