// Copyright 2013-2019, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BeersLawSolutionIO = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolutionIO' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  const Color = require( 'SCENERY/util/Color' );
  const ColorRange = require( 'BEERS_LAW_LAB/common/model/ColorRange' );
  const ConcentrationTransform = require( 'BEERS_LAW_LAB/beerslaw/model/ConcentrationTransform' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MolarAbsorptivityData = require( 'BEERS_LAW_LAB/beerslaw/model/MolarAbsorptivityData' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Util = require( 'DOT/Util' );

  // strings
  const cobaltChlorideString = require( 'string!BEERS_LAW_LAB/cobaltChloride' );
  const cobaltIINitrateString = require( 'string!BEERS_LAW_LAB/cobaltIINitrate' );
  const copperSulfateString = require( 'string!BEERS_LAW_LAB/copperSulfate' );
  const drinkMixString = require( 'string!BEERS_LAW_LAB/drinkMix' );
  const nickelIIChlorideString = require( 'string!BEERS_LAW_LAB/nickelIIChloride' );
  const pattern0Formula1NameString = require( 'string!BEERS_LAW_LAB/pattern.0formula.1name' );
  const potassiumChromateString = require( 'string!BEERS_LAW_LAB/potassiumChromate' );
  const potassiumDichromateString = require( 'string!BEERS_LAW_LAB/potassiumDichromate' );
  const potassiumPermanganateString = require( 'string!BEERS_LAW_LAB/potassiumPermanganate' );

  /**
   * @param {string} internalName - used internally, not displayed to the user
   * @param {string} name - name that is visible to the user
   * @param {string} formula - formula that is visible to the user
   * @param {MolarAbsorptivityData} molarAbsorptivityData
   * @param {RangeWithValue} concentrationRange
   * @param {ConcentrationTransform} concentrationTransform
   * @param {ColorRange} colorRange
   * @param {Object} [options]
   * @constructor
   */
  function BeersLawSolution( internalName, name, formula, molarAbsorptivityData, concentrationRange, concentrationTransform,
                             colorRange, options ) {
    
    assert && assert( internalName.indexOf( ' ' ) === -1, 'internalName cannot contain spaces: ' + internalName );

    options = _.extend( {
      saturatedColor: colorRange.max, // {Color} color to use when the solution is saturated
      phetioType: BeersLawSolutionIO,
      tandem: Tandem.required
    }, options );

    PhetioObject.call( this, options );

    const self = this;

    // @public (read-only)
    this.solvent = Solvent.WATER;
    this.internalName = internalName;
    this.name = name;
    this.formula = formula;
    this.molarAbsorptivityData = molarAbsorptivityData;
    this.concentrationProperty = new NumberProperty( concentrationRange.defaultValue, {
      units: 'moles/liter',
      range: concentrationRange,
      tandem: options.tandem.createTandem( 'concentrationProperty' )
    } );
    this.concentrationRange = concentrationRange;
    this.concentrationTransform = concentrationTransform;
    this.colorRange = colorRange;
    this.saturatedColor = options.saturatedColor;

    // @public Solution color is derived from concentration
    this.fluidColorProperty = new DerivedProperty( [ this.concentrationProperty ],
      function( concentration ) {
        let color = self.solvent.colorProperty.get();
        if ( concentration > 0 ) {
          const distance = Util.linear( self.concentrationRange.min, self.concentrationRange.max, 0, 1, concentration );
          color = self.colorRange.interpolateLinear( distance );
        }
        return color;
      } );

    // @public - the name of the solution in tandem id format. Used to other make tandems that pertain to this solution.
    this.tandemName = options.tandem.name;
  }

  beersLawLab.register( 'BeersLawSolution', BeersLawSolution );

  inherit( PhetioObject, BeersLawSolution, {

    // @public
    reset: function() {
      this.concentrationProperty.reset();
    },

    // @public
    getDisplayName: function() {
      if ( this.formula === this.name ) {
        return this.name;
      }
      return StringUtils.format( pattern0Formula1NameString, this.formula, this.name );
    }
  } );

  // A new tandem instance is required here since the solutes are created statically.  Signify that these solutions
  // are only used in the beers law screen by attaching them to that screen's tandem.
  const tandem = BLLConstants.BEERS_LAW_SCREEN_TANDEM.createTandem( 'solutions' );

  //-------------------------------------------------------------------------------------------
  // Specific solutions below ...
  //-------------------------------------------------------------------------------------------

  BeersLawSolution.DRINK_MIX = new BeersLawSolution(
    'drinkMix',
    drinkMixString,
    BLLSymbols.DRINK_MIX,
    MolarAbsorptivityData.DRINK_MIX,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
      tandem: tandem.createTandem( 'drinkMix' )
    }
  );

  BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution(
    'cobaltIINitrate',
    cobaltIINitrateString,
    BLLSymbols.COBALT_II_NITRATE,
    MolarAbsorptivityData.COBALT_II_NITRATE,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
      tandem: tandem.createTandem( 'cobaltIINitrate' )
    }
  );

  BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution(
    'cobaltChloride',
    cobaltChlorideString,
    BLLSymbols.COBALT_CHLORIDE,
    MolarAbsorptivityData.COBALT_CHLORIDE,
    new RangeWithValue( 0, 0.250, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ), {
      tandem: tandem.createTandem( 'cobaltChloride' )
    }
  );

  BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution(
    'potassiumDichromate',
    potassiumDichromateString,
    BLLSymbols.POTASSIUM_DICHROMATE,
    MolarAbsorptivityData.POTASSIUM_DICHROMATE,
    new RangeWithValue( 0, 0.000500, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ), {
      tandem: tandem.createTandem( 'potassiumDichromate' )
    }
  );

  BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution(
    'potassiumChromate',
    potassiumChromateString,
    BLLSymbols.POTASSIUM_CHROMATE,
    MolarAbsorptivityData.POTASSIUM_CHROMATE,
    new RangeWithValue( 0, 0.000400, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ), {
      tandem: tandem.createTandem( 'potassiumChromate' )
    }
  );

  BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution(
    'nickelIIChloride',
    nickelIIChlorideString,
    BLLSymbols.NICKEL_II_CHLORIDE,
    MolarAbsorptivityData.NICKEL_II_CHLORIDE,
    new RangeWithValue( 0, 0.350, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ), {
      tandem: tandem.createTandem( 'nickelIIChloride' )
    }
  );

  BeersLawSolution.COPPER_SULFATE = new BeersLawSolution(
    'copperSulfate',
    copperSulfateString,
    BLLSymbols.COPPER_SULFATE,
    MolarAbsorptivityData.COPPER_SULFATE,
    new RangeWithValue( 0, 0.200, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ), {
      tandem: tandem.createTandem( 'copperSulfate' )
    }
  );

  BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution(
    'potassiumPermanganate',
    potassiumPermanganateString,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
    new RangeWithValue( 0, 0.000800, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ), {
      tandem: tandem.createTandem( 'potassiumPermanganate' ),

      // has a special saturated color
      saturatedColor: new Color( 80, 0, 120 )
    }
  );

  return BeersLawSolution;
} );