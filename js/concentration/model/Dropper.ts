// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable, { BLLMovableOptions } from '../../common/model/BLLMovable.js';
import Solute from '../../common/model/Solute.js';

type SelfOptions = {
  maxFlowRate?: number; // L/s
  visible?: boolean;
};

type DropperOptions = SelfOptions & BLLMovableOptions;

export default class Dropper extends BLLMovable {

  public readonly soluteProperty: Property<Solute>;
  public readonly visibleProperty: Property<boolean>;
  public readonly enabledProperty: Property<boolean>;
  public readonly isDispensingProperty: Property<boolean>; // true if the dropper is dispensing solution
  public readonly isEmptyProperty: Property<boolean>;
  public readonly flowRateProperty: Property<number>;

  public constructor( soluteProperty: Property<Solute>, providedOptions: DropperOptions ) {

    const options = optionize<DropperOptions, SelfOptions, BLLMovableOptions>()( {

      // SelfOptions
      maxFlowRate: 1,
      visible: true,

      // BLLMovableOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.soluteProperty = soluteProperty;

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioReadOnly: true
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

    this.addLinkedElement( soluteProperty, {
      tandem: options.tandem.createTandem( 'soluteProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    super.reset();
    this.visibleProperty.reset();
    this.isDispensingProperty.reset();
    this.enabledProperty.reset();
    this.isEmptyProperty.reset();
    this.flowRateProperty.reset();
  }
}

beersLawLab.register( 'Dropper', Dropper );