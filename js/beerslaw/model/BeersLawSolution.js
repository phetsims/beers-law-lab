// Copyright 2013-2020, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLSymbols from '../../common/BLLSymbols.js';
import ColorRange from '../../common/model/ColorRange.js';
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

      // {string} name - name that is visible to the user
      name: required( config.name ),

      // {string} formula - formula that is visible to the user
      formula: required( config.formula ),

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
      phetioType: BeersLawSolution.BeersLawSolutionIO

    }, config );

    assert && assert( config.internalName.indexOf( ' ' ) === -1, 'internalName cannot contain spaces: ' + config.internalName );

    super( config );

    // @public (read-only)
    this.solvent = Solvent.WATER;
    this.internalName = config.internalName;
    this.name = config.name;
    this.formula = config.formula;
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

  // @public
  getDisplayName() {
    if ( this.formula === this.name ) {
      return this.name;
    }
    return StringUtils.format( beersLawLabStrings.pattern[ '0formula' ][ '1name' ], this.formula, this.name );
  }
}

BeersLawSolution.BeersLawSolutionIO = new IOType( 'BeersLawSolutionIO', {
  valueType: BeersLawSolution,
  documentation: 'The solution for the sim',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

// Static instances

// parent tandem for all static instances of BeersLawSolution
const SOLUTIONS_TANDEM = BLLConstants.BEERS_LAW_SCREEN_TANDEM.createTandem( 'model' ).createTandem( 'solutions' );

BeersLawSolution.DRINK_MIX = new BeersLawSolution( {
  internalName: 'drinkMix',
  name: beersLawLabStrings.drinkMix,
  formula: BLLSymbols.DRINK_MIX,
  molarAbsorptivityData: MolarAbsorptivityData.DRINK_MIX,
  concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'drinkMix' )
} );

BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution( {
  internalName: 'cobaltIINitrate',
  name: beersLawLabStrings.cobaltIINitrate,
  formula: BLLSymbols.COBALT_II_NITRATE,
  molarAbsorptivityData: MolarAbsorptivityData.COBALT_II_NITRATE,
  concentrationRange: new RangeWithValue( 0, 0.400, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltIINitrate' )
} );

BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution( {
  internalName: 'cobaltChloride',
  name: beersLawLabStrings.cobaltChloride,
  formula: BLLSymbols.COBALT_CHLORIDE,
  molarAbsorptivityData: MolarAbsorptivityData.COBALT_CHLORIDE,
  concentrationRange: new RangeWithValue( 0, 0.250, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltChloride' )
} );

BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution( {
  internalName: 'potassiumDichromate',
  name: beersLawLabStrings.potassiumDichromate,
  formula: BLLSymbols.POTASSIUM_DICHROMATE,
  molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_DICHROMATE,
  concentrationRange: new RangeWithValue( 0, 0.000500, 0.000100 ),
  concentrationTransform: ConcentrationTransform.uM,
  colorRange: new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumDichromate' )
} );

BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution( {
  internalName: 'potassiumChromate',
  name: beersLawLabStrings.potassiumChromate,
  formula: BLLSymbols.POTASSIUM_CHROMATE,
  molarAbsorptivityData: MolarAbsorptivityData.POTASSIUM_CHROMATE,
  concentrationRange: new RangeWithValue( 0, 0.000400, 0.000100 ),
  concentrationTransform: ConcentrationTransform.uM,
  colorRange: new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumChromate' )
} );

BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution( {
  internalName: 'nickelIIChloride',
  name: beersLawLabStrings.nickelIIChloride,
  formula: BLLSymbols.NICKEL_II_CHLORIDE,
  molarAbsorptivityData: MolarAbsorptivityData.NICKEL_II_CHLORIDE,
  concentrationRange: new RangeWithValue( 0, 0.350, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'nickelIIChloride' )
} );

BeersLawSolution.COPPER_SULFATE = new BeersLawSolution( {
  internalName: 'copperSulfate',
  name: beersLawLabStrings.copperSulfate,
  formula: BLLSymbols.COPPER_SULFATE,
  molarAbsorptivityData: MolarAbsorptivityData.COPPER_SULFATE,
  concentrationRange: new RangeWithValue( 0, 0.200, 0.100 ),
  concentrationTransform: ConcentrationTransform.mM,
  colorRange: new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ),
  tandem: SOLUTIONS_TANDEM.createTandem( 'copperSulfate' )
} );

BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution( {
  internalName: 'potassiumPermanganate',
  name: beersLawLabStrings.potassiumPermanganate,
  formula: BLLSymbols.POTASSIUM_PERMANGANATE,
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