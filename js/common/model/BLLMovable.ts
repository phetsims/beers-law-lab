// Copyright 2013-2023, University of Colorado Boulder

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
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {
  position?: Vector2; // initial position
  positionPhetioReadOnly?: boolean; // whether positionProperty is read-only
  dragBounds?: Bounds2; // drag bounds
};

export type BLLMovableOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioState'>;

export default class BLLMovable extends PhetioObject {

  public readonly positionProperty: Property<Vector2>;
  public readonly dragBounds: Bounds2;

  public constructor( providedOptions: BLLMovableOptions ) {

    const options = optionize<BLLMovableOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      positionPhetioReadOnly: true,
      dragBounds: Bounds2.EVERYTHING,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      units: 'cm',
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: options.positionPhetioReadOnly,
      phetioDocumentation: 'Note that (0,0) is at the upper-LEFT, +x is to the right, and +y is DOWN.'
    } );

    this.dragBounds = options.dragBounds;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

beersLawLab.register( 'BLLMovable', BLLMovable );