// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution model for the Beer's Law screen.
 * <p/>
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 * <p/>
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
   * @param {string} internalName - used internally, not displayed to the user
   * @param {string} name - name that is visible to the user
   * @param {string} formula - formula that is visible to the user
   * @param {MolarAbsorptivityData} molarAbsorptivityData
   * @param {RangeWithValue} concentrationRange
   * @param {ConcentrationTransform} concentrationTransform
   * @param {ColorRange} colorRange
   * @param {Object} [options]
   */
  constructor( internalName, name, formula, molarAbsorptivityData, concentrationRange, concentrationTransform,
               colorRange, options ) {

    assert && assert( internalName.indexOf( ' ' ) === -1, 'internalName cannot contain spaces: ' + internalName );

    options = merge( {
      saturatedColor: colorRange.max, // {Color} color to use when the solution is saturated
      phetioType: BeersLawSolution.BeersLawSolutionIO,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public (read-only)
    this.solvent = Solvent.WATER;
    this.internalName = internalName;
    this.name = name;
    this.formula = formula;
    this.molarAbsorptivityData = molarAbsorptivityData;
    this.concentrationProperty = new NumberProperty( concentrationRange.defaultValue, {
      units: 'mol/L',
      range: concentrationRange,
      tandem: options.tandem.createTandem( 'concentrationProperty' )
    } );
    this.concentrationRange = concentrationRange;
    this.concentrationTransform = concentrationTransform;
    this.colorRange = colorRange;
    this.saturatedColor = options.saturatedColor;

    // @public Solution color is derived from concentration
    this.fluidColorProperty = new DerivedProperty( [ this.concentrationProperty ],
      concentration => {
        let color = this.solvent.colorProperty.get();
        if ( concentration > 0 ) {
          const distance = Utils.linear( this.concentrationRange.min, this.concentrationRange.max, 0, 1, concentration );
          color = this.colorRange.interpolateLinear( distance );
        }
        return color;
      } );

    // @public - the name of the solution in tandem id format. Used to other make tandems that pertain to this solution.
    this.tandemName = options.tandem.name;
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

BeersLawSolution.DRINK_MIX = new BeersLawSolution(
  'drinkMix',
  beersLawLabStrings.drinkMix,
  BLLSymbols.DRINK_MIX,
  MolarAbsorptivityData.DRINK_MIX,
  new RangeWithValue( 0, 0.400, 0.100 ),
  ConcentrationTransform.mM,
  new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'drinkMix' )
  }
);

BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution(
  'cobaltIINitrate',
  beersLawLabStrings.cobaltIINitrate,
  BLLSymbols.COBALT_II_NITRATE,
  MolarAbsorptivityData.COBALT_II_NITRATE,
  new RangeWithValue( 0, 0.400, 0.100 ),
  ConcentrationTransform.mM,
  new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltIINitrate' )
  }
);

BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution(
  'cobaltChloride',
  beersLawLabStrings.cobaltChloride,
  BLLSymbols.COBALT_CHLORIDE,
  MolarAbsorptivityData.COBALT_CHLORIDE,
  new RangeWithValue( 0, 0.250, 0.100 ),
  ConcentrationTransform.mM,
  new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'cobaltChloride' )
  }
);

BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution(
  'potassiumDichromate',
  beersLawLabStrings.potassiumDichromate,
  BLLSymbols.POTASSIUM_DICHROMATE,
  MolarAbsorptivityData.POTASSIUM_DICHROMATE,
  new RangeWithValue( 0, 0.000500, 0.000100 ),
  ConcentrationTransform.uM,
  new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumDichromate' )
  }
);

BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution(
  'potassiumChromate',
  beersLawLabStrings.potassiumChromate,
  BLLSymbols.POTASSIUM_CHROMATE,
  MolarAbsorptivityData.POTASSIUM_CHROMATE,
  new RangeWithValue( 0, 0.000400, 0.000100 ),
  ConcentrationTransform.uM,
  new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumChromate' )
  }
);

BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution(
  'nickelIIChloride',
  beersLawLabStrings.nickelIIChloride,
  BLLSymbols.NICKEL_II_CHLORIDE,
  MolarAbsorptivityData.NICKEL_II_CHLORIDE,
  new RangeWithValue( 0, 0.350, 0.100 ),
  ConcentrationTransform.mM,
  new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'nickelIIChloride' )
  }
);

BeersLawSolution.COPPER_SULFATE = new BeersLawSolution(
  'copperSulfate',
  beersLawLabStrings.copperSulfate,
  BLLSymbols.COPPER_SULFATE,
  MolarAbsorptivityData.COPPER_SULFATE,
  new RangeWithValue( 0, 0.200, 0.100 ),
  ConcentrationTransform.mM,
  new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ), {
    tandem: SOLUTIONS_TANDEM.createTandem( 'copperSulfate' )
  }
);

BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution(
  'potassiumPermanganate',
  beersLawLabStrings.potassiumPermanganate,
  BLLSymbols.POTASSIUM_PERMANGANATE,
  MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
  new RangeWithValue( 0, 0.000800, 0.000100 ),
  ConcentrationTransform.uM,
  new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ), {

    // has a special saturated color
    saturatedColor: new Color( 80, 0, 120 ),
    tandem: SOLUTIONS_TANDEM.createTandem( 'potassiumPermanganate' )
  }
);

beersLawLab.register( 'BeersLawSolution', BeersLawSolution );
export default BeersLawSolution;