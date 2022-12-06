// Copyright 2013-2022, University of Colorado Boulder

/**
 * Light is the model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';
import LightMode from './LightMode.js';

type SelfOptions = {
  position?: Vector2; // cm
  lensDiameter?: 0.45; // cm
  isOn?: false;
};

type LightOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Light extends PhetioObject {

  public readonly position: Vector2;
  public readonly lensDiameter: number;
  public readonly isOnProperty: Property<boolean>;
  public readonly wavelengthProperty: NumberProperty;
  public readonly modeProperty: EnumerationProperty<LightMode>;

  public constructor( solutionProperty: Property<BeersLawSolution>, providedOptions: LightOptions ) {

    const options = optionize<LightOptions, SelfOptions, PhetioObjectOptions>()( {
      position: Vector2.ZERO, // cm
      lensDiameter: 0.45, // cm
      isOn: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = options.position;
    this.lensDiameter = options.lensDiameter;

    this.isOnProperty = new BooleanProperty( options.isOn, {
      tandem: options.tandem.createTandem( 'isOnProperty' )
    } );

    this.wavelengthProperty = new NumberProperty( solutionProperty.value.molarAbsorptivityData.lambdaMax /*nm*/, {
      units: 'nm',
      range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH ),
      tandem: options.tandem.createTandem( 'wavelengthProperty' ),
      phetioReadOnly: true
    } );

    this.modeProperty = new EnumerationProperty( LightMode.PRESET, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solutionProperty.link( solution => {
      this.wavelengthProperty.value = solution.molarAbsorptivityData.lambdaMax;
    } );

    this.modeProperty.link( mode => {

      // 'Preset' sets the light to the current solution's lambdaMax wavelength.
      if ( mode === LightMode.PRESET ) {
        this.wavelengthProperty.value = solutionProperty.value.molarAbsorptivityData.lambdaMax;
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.isOnProperty.reset();
    this.wavelengthProperty.reset();
    this.modeProperty.reset();
  }

  public getMinY(): number {
    return this.position.y - ( this.lensDiameter / 2 );
  }

  public getMaxY(): number {
    return this.position.y + ( this.lensDiameter / 2 );
  }
}

beersLawLab.register( 'Light', Light );