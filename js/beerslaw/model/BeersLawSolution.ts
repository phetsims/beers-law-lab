// Copyright 2013-2022, University of Colorado Boulder

/**
 * BeersLawSolution is the solution model for the Beer's Law screen.
 *
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 *
 * Note that this model does not use the Solute model from the Concentration screen, because
 * we have very different needs wrt color scheme, properties, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import beersLawLab from '../../beersLawLab.js';
import ColorRange from '../../common/model/ColorRange.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';
import ConcentrationTransform from './ConcentrationTransform.js';
import MolarAbsorptivityData from './MolarAbsorptivityData.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';

// parent tandem for all static instances of BeersLawSolution
const SOLUTIONS_TANDEM = Tandem.ROOT.createTandem( 'beersLawScreen' ).createTandem( 'model' ).createTandem( 'solutions' );

type SelfOptions = {

  // required
  nameProperty: LinkableProperty<string>; // name that is visible to the user
  formulaProperty: LinkableProperty<string | null>; // formula that is visible to the user, null defaults to nameProperty.value
  molarAbsorptivityData: MolarAbsorptivityData;
  concentrationRange: RangeWithValue;
  concentrationTransform: ConcentrationTransform;
  colorRange: ColorRange;

  // optional
  saturatedColor?: Color; // color to use when the solution is saturated
};

type BeersLawSolutionOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BeersLawSolution extends PhetioObject {

  // the name of the solution, displayed to the user
  public readonly nameProperty: TReadOnlyProperty<string>;

  // // formula that is visible to the user, null defaults to nameProperty.value
  public readonly formulaProperty: TReadOnlyProperty<string | null>;

  public readonly solvent: Solvent;
  public readonly molarAbsorptivityData: MolarAbsorptivityData;
  public readonly concentrationTransform: ConcentrationTransform;
  public readonly colorRange: ColorRange;
  public readonly saturatedColor: Color;

  public readonly concentrationProperty: NumberProperty;
  public readonly fluidColorProperty: TReadOnlyProperty<Color>;

  // tandem name of the solution, used to create other tandems that are related to this solution.
  public readonly tandemName: string;

  public constructor( providedOptions: BeersLawSolutionOptions ) {

    assert && assert( BeersLawSolution.BeersLawSolutionIO,
      'BeersLawSolutionIO and BeersLawSolution instances are statics, so make sure BeersLawSolutionIO exists' );

    const options = optionize<BeersLawSolutionOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      saturatedColor: providedOptions.colorRange.max,

      // PhetioObjectOptions
      phetioType: BeersLawSolution.BeersLawSolutionIO,
      phetioState: false

    }, providedOptions );

    super( options );

    this.nameProperty = options.nameProperty;
    this.formulaProperty = options.formulaProperty;
    this.solvent = Solvent.WATER;
    this.molarAbsorptivityData = options.molarAbsorptivityData;
    this.concentrationTransform = options.concentrationTransform;
    this.colorRange = options.colorRange;
    this.saturatedColor = options.saturatedColor;

    this.concentrationProperty = new NumberProperty( options.concentrationRange.defaultValue, {
      units: 'mol/L',
      range: options.concentrationRange,
      tandem: options.tandem.createTandem( 'concentrationProperty' )
    } );

    this.fluidColorProperty = new DerivedProperty( [ this.concentrationProperty ],
      concentration => {
        let color = this.solvent.colorProperty.value;
        if ( concentration > 0 ) {
          const range = this.concentrationProperty.range;
          const distance = Utils.linear( range.min, range.max, 0, 1, concentration );
          color = this.colorRange.interpolateLinear( distance );
        }
        return color;
      } );

    this.tandemName = options.tandem.name;

    this.addLinkedElement( options.nameProperty, {
      tandem: options.tandem.createTandem( 'nameProperty' )
    } );

    this.addLinkedElement( options.formulaProperty, {
      tandem: options.tandem.createTandem( 'formulaProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.concentrationProperty.reset();
  }

  /**
   * BeersLawSolutionIO handles PhET-iO serialization of BeersLawSolution. Since all BeersLawSolution are
   * static instances, it implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly BeersLawSolutionIO = new IOType( 'BeersLawSolutionIO', {
    valueType: BeersLawSolution,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A solution in the Beer\'s Law screen'
  } );

  public static readonly DRINK_MIX = new BeersLawSolution( {
    nameProperty: Solute.DRINK_MIX.nameProperty,
    formulaProperty: Solute.DRINK_MIX.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.DRINK_MIX,
    concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
    concentrationTransform: ConcentrationTransform.mM,
    colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'drinkMix' )
  } );

  public static readonly COBALT_II_NITRATE = new BeersLawSolution( {
    nameProperty: Solute.COBALT_II_NITRATE.nameProperty,
    formulaProperty: Solute.COBALT_II_NITRATE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.COBALT_II_NITRATE,
    concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
    concentrationTransform: ConcentrationTransform.mM,
    colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltIINitrate' )
  } );

  public static readonly COBALT_CHLORIDE = new BeersLawSolution( {
    nameProperty: Solute.COBALT_CHLORIDE.nameProperty,
    formulaProperty: Solute.COBALT_CHLORIDE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.COBALT_CHLORIDE,
    concentrationRange: new RangeWithValue( 0, 0.250, 0.100 ),
    concentrationTransform: ConcentrationTransform.mM,
    colorRange: new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltChloride' )
  } );

  public static readonly POTASSIUM_DICHROMATE = new BeersLawSolution( {
    nameProperty: Solute.POTASSIUM_DICHROMATE.nameProperty,
    formulaProperty: Solute.POTASSIUM_DICHROMATE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_DICHROMATE,
    concentrationRange: new RangeWithValue( 0, 0.000500, 0.000100 ),
    concentrationTransform: ConcentrationTransform.uM,
    colorRange: new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumDichromate' )
  } );

  public static readonly POTASSIUM_CHROMATE = new BeersLawSolution( {
    nameProperty: Solute.POTASSIUM_CHROMATE.nameProperty,
    formulaProperty: Solute.POTASSIUM_CHROMATE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_CHROMATE,
    concentrationRange: new RangeWithValue( 0, 0.000400, 0.000100 ),
    concentrationTransform: ConcentrationTransform.uM,
    colorRange: new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumChromate' )
  } );

  public static readonly NICKEL_II_CHLORIDE = new BeersLawSolution( {
    nameProperty: Solute.NICKEL_II_CHLORIDE.nameProperty,
    formulaProperty: Solute.NICKEL_II_CHLORIDE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.NICKEL_II_CHLORIDE,
    concentrationRange: new RangeWithValue( 0, 0.350, 0.100 ),
    concentrationTransform: ConcentrationTransform.mM,
    colorRange: new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'nickelIIChloride' )
  } );

  public static readonly COPPER_SULFATE = new BeersLawSolution( {
    nameProperty: Solute.COPPER_SULFATE.nameProperty,
    formulaProperty: Solute.COPPER_SULFATE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.COPPER_SULFATE,
    concentrationRange: new RangeWithValue( 0, 0.200, 0.100 ),
    concentrationTransform: ConcentrationTransform.mM,
    colorRange: new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'copperSulfate' )
  } );

  public static readonly POTASSIUM_PERMANGANATE = new BeersLawSolution( {
    nameProperty: Solute.POTASSIUM_PERMANGANATE.nameProperty,
    formulaProperty: Solute.POTASSIUM_PERMANGANATE.formulaProperty,
    molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
    concentrationRange: new RangeWithValue( 0, 0.000800, 0.000100 ),
    concentrationTransform: ConcentrationTransform.uM,
    colorRange: new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ),

    // has a special saturated color
    saturatedColor: new Color( 80, 0, 120 ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumPermanganate' )
  } );
}

beersLawLab.register( 'BeersLawSolution', BeersLawSolution );