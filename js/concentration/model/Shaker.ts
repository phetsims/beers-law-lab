// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable, { BLLMovableOptions } from '../../common/model/BLLMovable.js';
import Solute from '../../common/model/Solute.js';
import SoluteForm from './SoluteForm.js';

type SelfOptions = {
  orientation?: number; // radians
  visible?: boolean;
  maxDispensingRate?: number; // L/s
};

type ShakerOptions = SelfOptions & BLLMovableOptions;

export default class Shaker extends BLLMovable {

  public readonly orientation: number;
  public readonly maxDispensingRate: number;
  public readonly soluteProperty: Property<Solute>;
  public readonly visibleProperty: TReadOnlyProperty<boolean>;
  public readonly isEmptyProperty: Property<boolean>;
  public readonly dispensingRateProperty: Property<number>;
  private previousPosition: Vector2;

  public constructor( soluteProperty: Property<Solute>, soluteFormProperty: EnumerationProperty<SoluteForm>,
                      providedOptions: ShakerOptions ) {

    const options = optionize<ShakerOptions, SelfOptions, BLLMovableOptions>()( {

      // SelfOptions
      orientation: 0,
      visible: true,
      maxDispensingRate: 1,

      // BLLMovableOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.orientation = options.orientation;
    this.maxDispensingRate = options.maxDispensingRate;

    this.soluteProperty = soluteProperty;

    this.visibleProperty = new DerivedProperty( [ soluteFormProperty ],
      soluteForm => ( soluteForm === SoluteForm.SOLID ), {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } );

    this.isEmptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isEmptyProperty' ),
      phetioReadOnly: true
    } );

    this.dispensingRateProperty = new NumberProperty( 0, {
      units: 'mol/s',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'dispensingRateProperty' ),
      phetioReadOnly: true
    } );

    this.previousPosition = this.positionProperty.value;

    // Set the dispensing rate to zero when the shaker becomes empty or invisible.
    Multilink.multilink( [ this.isEmptyProperty, this.visibleProperty ], ( isEmpty, visible ) => {
      if ( isEmpty || !visible ) {
        this.dispensingRateProperty.value = 0;
      }
    } );

    // If the position changes while restoring PhET-iO state, then set previousPosition to position to prevent the
    // shaker from effective being moved and dispensing solute. See https://github.com/phetsims/beers-law-lab/issues/247.
    this.positionProperty.link( position => {
      if ( phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.previousPosition = position;
      }
    } );

    this.addLinkedElement( soluteProperty, {
      tandem: options.tandem.createTandem( 'soluteProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.isEmptyProperty.reset();
    this.dispensingRateProperty.reset();

    // to prevent shaker from dispensing solute when its position is reset
    this.previousPosition = this.positionProperty.value;
  }

  /**
   * Sets the dispensing rate if the shaker is moving.
   */
  public step(): void {
    if ( this.visibleProperty.value && !this.isEmptyProperty.value ) {
      if ( this.previousPosition.equals( this.positionProperty.value ) ) {
        this.dispensingRateProperty.value = 0; // shaker is not moving, don't dispense anything
      }
      else {
        this.dispensingRateProperty.value = this.maxDispensingRate; // max rate seems to work fine
      }
    }
    this.previousPosition = this.positionProperty.value;
  }
}

beersLawLab.register( 'Shaker', Shaker );