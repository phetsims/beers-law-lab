// Copyright 2013-2023, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import SoluteForm from './SoluteForm.js';

type SelfOptions = {
  position?: Vector2;
  maxFlowRate?: number; // L/s
};

type DropperOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Dropper extends PhetioObject {

  public readonly position: Vector2;
  public readonly soluteProperty: Property<Solute>;
  public readonly visibleProperty: TReadOnlyProperty<boolean>;
  public readonly enabledProperty: Property<boolean>;
  public readonly isDispensingProperty: Property<boolean>; // true if the dropper is dispensing solution
  public readonly isEmptyProperty: Property<boolean>;
  public readonly flowRateProperty: Property<number>;

  public constructor( soluteProperty: Property<Solute>, soluteFormProperty: EnumerationProperty<SoluteForm>,
                      providedOptions: DropperOptions ) {

    const options = optionize<DropperOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      maxFlowRate: 1,

      // PhetioObjectpOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = options.position;
    this.soluteProperty = soluteProperty;

    this.visibleProperty = new DerivedProperty( [ soluteFormProperty ],
      soluteForm => ( soluteForm === SoluteForm.SOLUTION ), {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } );

    this.enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true
    } );

    this.isDispensingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isDispensingProperty' ),
      phetioReadOnly: true
    } );

    this.isEmptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isEmptyProperty' ),
      phetioReadOnly: true
    } );

    this.flowRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxFlowRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true
    } );

    // Turn off the dropper when it's disabled.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.isDispensingProperty.value = false;
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    this.isDispensingProperty.link( dispensing => {
      this.flowRateProperty.value = ( dispensing ? options.maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    this.isEmptyProperty.link( empty => {
      if ( empty ) {
        this.enabledProperty.value = false;
      }
    } );

    // When the dropper becomes invisible, set its flow rate to zero.
    this.visibleProperty.link( visible => {
      if ( !visible ) {
        this.flowRateProperty.value = 0;
      }
    } );

    this.addLinkedElement( soluteProperty, {
      tandem: options.tandem.createTandem( 'soluteProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.isDispensingProperty.reset();
    this.enabledProperty.reset();
    this.isEmptyProperty.reset();
    this.flowRateProperty.reset();
  }
}

beersLawLab.register( 'Dropper', Dropper );