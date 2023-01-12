// Copyright 2013-2023, University of Colorado Boulder

/**
 * Ruler is the model of a ruler that is movable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable, { BLLMovableOptions } from '../../common/model/BLLMovable.js';

type SelfOptions = {
  length?: number; // in cm
  height?: number; // in cm
};

type RulerOptions = SelfOptions & BLLMovableOptions;

export default class Ruler extends BLLMovable {

  public readonly length: number;
  public readonly height: number;

  public constructor( providedOptions: RulerOptions ) {

    const options = optionize<RulerOptions, SelfOptions, BLLMovableOptions>()( {

      // SelfOptions
      length: 2.1,
      height: 0.35,

      // BLLMovableOptions
      positionPhetioReadOnly: false
    }, providedOptions );

    super( options );

    this.length = options.length;
    this.height = options.height;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'Ruler', Ruler );