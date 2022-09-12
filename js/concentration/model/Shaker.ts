// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable, { BLLMovableOptions } from '../../common/model/BLLMovable.js';
import Solute from '../../common/model/Solute.js';

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
  public readonly visibleProperty: Property<boolean>;
  public readonly isEmptyProperty: Property<boolean>;
  public readonly dispensingRateProperty: Property<number>;
  private previousPosition: Vector2;

  public constructor( soluteProperty: Property<Solute>, providedOptions: ShakerOptions ) {

    const options = optionize<ShakerOptions, SelfOptions, BLLMovableOptions>()( {

      // SelfOptions
      orientation: 0,
      visible: true,
      maxDispensingRate: 1,

      // BLLMovableOptions
      phetioState: false
      // phetioType: ShakerIO
    }, providedOptions );

    super( options );

    this.orientation = options.orientation;
    this.maxDispensingRate = options.maxDispensingRate;

    this.soluteProperty = soluteProperty;

    this.visibleProperty = new BooleanProperty( options.visible );

    this.isEmptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isEmptyProperty' ),
      phetioReadOnly: true
    } );

    this.dispensingRateProperty = new NumberProperty( 0, {
      isValidValue: value => ( value >= 0 )
    } );

    this.previousPosition = this.positionProperty.value;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    const observer = () => {
      if ( this.isEmptyProperty.value || !this.visibleProperty.value ) {
        this.dispensingRateProperty.value = 0;
      }
    };
    this.isEmptyProperty.link( observer );
    this.visibleProperty.link( observer );

    // If the position changes while restoring PhET-iO state, then set previousPosition to position to prevent the
    // shaker from effective being moved and dispensing solute. See https://github.com/phetsims/beers-law-lab/issues/247.
    this.positionProperty.link( position => {
      if ( phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.previousPosition = position;
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.visibleProperty.reset();
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

  //TODO https://github.com/phetsims/beers-law-lab/issues/287 does IOType need generic params?
  public static readonly ShakerIO = new IOType( 'ShakerIO', {
    valueType: Shaker,
    documentation: 'The Shaker that releases solute',
    methods: {
      setValue: {
        returnType: VoidIO,
        parameterTypes: [ ObjectLiteralIO ],

        // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 Property 'previousPosition' does not exist on type 'typeof Shaker'.
        implementation: valueStateObject => this.previousPosition.set( Vector2.Vector2IO.fromStateObject( valueStateObject ) ),
        documentation: 'Load the values recorded in getState',
        invocableForReadOnlyElements: false
      }
    },
    toStateObject: shaker => ( { position: Vector2.Vector2IO.toStateObject( shaker.previousPosition ) } ),
    applyState: ( shaker, stateObject ) => shaker.previousPosition.set( Vector2.Vector2IO.fromStateObject( stateObject.position ) )
  } );
}

beersLawLab.register( 'Shaker', Shaker );