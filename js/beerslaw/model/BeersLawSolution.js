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
import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import ColorRange from '../../common/model/ColorRange.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';
import ConcentrationTransform from './ConcentrationTransform.js';
import MolarAbsorptivityData from './MolarAbsorptivityData.js';

class BeersLawSolution extends PhetioObject {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // {string} internalName - used internally, not displayed to the user
      internalName: required( config.internalName ),

      // {Property.<string>} name - name that is visible to the user
      nameProperty: required( config.nameProperty ),

      // {Property.<string|null>} formula - formula that is visible to the user, null defaults to nameProperty.value
      formulaProperty: required( config.formulaProperty ),

      // {MolarAbsorptivityData}
      molarAbsorptivityData: required( config.molarAbsorptivityData ),

      // {RangeWithValue}
      concentrationRange: required( config.concentrationRange ),

      // {ConcentrationTransform}
      concentrationTransform: required( config.concentrationTransform ),

      // {ColorRange}
      colorRange: required( config.colorRange ),

      // {Color} color to use when the solution is saturated
      saturatedColor: config.colorRange.max,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: BeersLawSolution.BeersLawSolutionIO,
      phetioState: false // IO Type extends ReferenceIO

    }, config );

    assert && assert( config.internalName.indexOf( ' ' ) === -1, `internalName cannot contain spaces: ${config.internalName}` );

    super( config );

    //TODO https://github.com/phetsims/scenery/issues/1187 This should be a DerivedProperty, but RichText options.textProperty does not work with DerivedProperty.
    // @public
    this.labelProperty = new StringProperty( formatLabel( config.nameProperty.value, config.formulaProperty.value ), {
      tandem: config.tandem.createTandem( 'labelProperty' ),
      phetioDocumentation: 'The string used to label the solution, derived from the solute nameProperty and formulaProperty.',
      phetioReadOnly: true
    } );
    Multilink.lazyMultilink(
      [ config.nameProperty, config.formulaProperty ],
      ( name, formula ) => {
        this.labelProperty.value = formatLabel( name, formula );
      } );

    // @public (read-only)
    this.solvent = Solvent.WATER;
    this.internalName = config.internalName;
    this.molarAbsorptivityData = config.molarAbsorptivityData;
    this.concentrationProperty = new NumberProperty( config.concentrationRange.defaultValue, {
      units: 'mol/L',
      range: config.concentrationRange,
      tandem: config.tandem.createTandem( 'concentrationProperty' )
    } );
    this.concentrationTransform = config.concentrationTransform;
    this.colorRange = config.colorRange;
    this.saturatedColor = config.saturatedColor;

    // @public Solution color is derived from concentration
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

    // @public - the name of the solution in tandem id format. Used to other make tandems that pertain to this solution.
    this.tandemName = config.tandem.name;
  }

  // @public
  reset() {
    this.concentrationProperty.reset();
  }
}

/**
 * Formats the label for a solution.
 * @param {string} name
 * @param {string|null} formula - null defaults to name
 * @returns {string}
 */
function formatLabel( name, formula ) {
  assert && assert( typeof name === 'string', `invalid name: ${name}` );
  assert && assert( typeof formula === 'string' || formula === null, `invalid name: ${formula}` );
  return ( formula === null || formula === '' ) ? name :
         StringUtils.format( beersLawLabStrings.pattern[ '0formula' ][ '1name' ], formula, name );
}

/**
 * BeersLawSolutionIO handles PhET-iO serialization of BeersLawSolution. Since all BeersLawSolution are
 * static instances, it implements 'Reference type serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
BeersLawSolution.BeersLawSolutionIO = new IOType( 'BeersLawSolutionIO', {
  valueType: BeersLawSolution,
  supertype: ReferenceIO( IOType.ObjectIO ),
  documentation: 'A solution in the Beer\'s Law screen'
} );

// Static instances

// parent tandem for all static instances of BeersLawSolution
const SOLUTIONS_TANDEM = BLLConstants.BEERS_LAW_SCREEN_TANDEM.createTandem( 'model' ).createTandem( 'solutions' );

BeersLawSolution.DRINK_MIX = new BeersLawSolution( {
  internalName: 'drinkMix',
  nameProperty: Solute.DRINK_MIX.nameProperty,
  formulaProperty: Solute.DRINK_MIX.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.DRINK_MIX,
  concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'drinkMix' )
} );

BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution( {
  internalName: 'cobaltIINitrate',
  nameProperty: Solute.COBALT_II_NITRATE.nameProperty,
  formulaProperty: Solute.COBALT_II_NITRATE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.COBALT_II_NITRATE,
  concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltIINitrate' )
} );

BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution( {
  internalName: 'cobaltChloride',
  nameProperty: Solute.COBALT_CHLORIDE.nameProperty,
  formulaProperty: Solute.COBALT_CHLORIDE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.COBALT_CHLORIDE,
  concentrationRange: new RangeWithValue( 0, 0.250, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltChloride' )
} );

BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution( {
  internalName: 'potassiumDichromate',
  nameProperty: Solute.POTASSIUM_DICHROMATE.nameProperty,
  formulaProperty: Solute.POTASSIUM_DICHROMATE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_DICHROMATE,
  concentrationRange: new RangeWithValue( 0, 0.000500, 0.000100 ),
  concentrationTransform: ConcentrationTransform.uM,
  colorRange: new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumDichromate' )
} );

BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution( {
  internalName: 'potassiumChromate',
  nameProperty: Solute.POTASSIUM_CHROMATE.nameProperty,
  formulaProperty: Solute.POTASSIUM_CHROMATE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_CHROMATE,
  concentrationRange: new RangeWithValue( 0, 0.000400, 0.000100 ),
  concentrationTransform: ConcentrationTransform.uM,
  colorRange: new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumChromate' )
} );

BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution( {
  internalName: 'nickelIIChloride',
  nameProperty: Solute.NICKEL_II_CHLORIDE.nameProperty,
  formulaProperty: Solute.NICKEL_II_CHLORIDE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.NICKEL_II_CHLORIDE,
  concentrationRange: new RangeWithValue( 0, 0.350, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'nickelIIChloride' )
} );

BeersLawSolution.COPPER_SULFATE = new BeersLawSolution( {
  internalName: 'copperSulfate',
  nameProperty: Solute.COPPER_SULFATE.nameProperty,
  formulaProperty: Solute.COPPER_SULFATE.formulaProperty,
  molarAbsorptivityData: MolarAbsorptivityData.COPPER_SULFATE,
  concentrationRange: new RangeWithValue( 0, 0.200, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'copperSulfate' )
} );

BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution( {
  internalName: 'potassiumPermanganate',
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

beersLawLab.register( 'BeersLawSolution', BeersLawSolution );
export default BeersLawSolution;