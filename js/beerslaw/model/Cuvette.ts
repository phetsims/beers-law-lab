// Copyright 2013-2022, University of Colorado Boulder

/**
 * Cuvette is a simple model of a cuvette. A cuvette is a small tube of circular or square cross section,
 * sealed at one end, made of plastic, glass, or fused quartz (for UV light) and designed to hold samples
 * for spectroscopic experiments.
 *
 * In this case, the cuvette is the vessel that holds the solution.
 * It has a fixed height, but a variable width, making it possible to change
 * the path length. Position is fixed.  Origin is at the upper-left corner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {
  position?: Vector2;
  widthRange?: RangeWithValue; // variable width, cm
  height?: 3; // fixed height, cm
};

type CuvetteOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Cuvette extends PhetioObject {

  public readonly position: Vector2;
  public readonly widthProperty: NumberProperty;
  public readonly height: number;

  public constructor( providedOptions: CuvetteOptions ) {

    const options = optionize<CuvetteOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      widthRange: new RangeWithValue( 0.5, 2.0, 1.0 ), // variable width, cm
      height: 3, // fixed height, cm

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = options.position;

    this.widthProperty = new NumberProperty( options.widthRange.defaultValue, {
      units: 'cm',
      range: options.widthRange,
      tandem: options.tandem.createTandem( 'widthProperty' )
    } );

    this.height = options.height;
  }

  public reset(): void {
    this.widthProperty.reset();
  }
}

beersLawLab.register( 'Cuvette', Cuvette );