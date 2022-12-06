// Copyright 2013-2022, University of Colorado Boulder

/**
 * Beaker is the model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {
  position?: Vector2;
  size?: Dimension2;
  volume?: number;
};

type BeakerOptions = SelfOptions;

export default class Beaker {

  public readonly position: Vector2;
  public readonly size: Dimension2;
  public readonly volume: number;

  public readonly left: number; // x-coordinate of the left wall
  public readonly right: number; // x-coordinate of the right wall

  public constructor( providedOptions?: BeakerOptions ) {

    const options = optionize<BeakerOptions, SelfOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      size: new Dimension2( 600, 300 ),
      volume: 1
    }, providedOptions );

    this.position = options.position;
    this.size = options.size;
    this.volume = options.volume;

    this.left = this.position.x - ( this.size.width / 2 );
    this.right = this.position.x + ( this.size.width / 2 );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

beersLawLab.register( 'Beaker', Beaker );