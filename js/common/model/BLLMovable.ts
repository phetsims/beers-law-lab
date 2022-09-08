// Copyright 2013-2021, University of Colorado Boulder

/**
 * BLLMovable is a movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {
  position?: Vector2; // initial position
  dragBounds?: Bounds2; // drag bounds
};

export type BLLMovableOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BLLMovable extends PhetioObject {

  public readonly positionProperty: Property<Vector2>;
  public readonly dragBounds: Bounds2;

  public constructor( providedOptions: BLLMovableOptions ) {

    const options = optionize<BLLMovableOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      dragBounds: Bounds2.EVERYTHING,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.dragBounds = options.dragBounds;
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

beersLawLab.register( 'BLLMovable', BLLMovable );