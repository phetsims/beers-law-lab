// Copyright 2013-2015, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorRange = require( 'BEERS_LAW_LAB/common/model/ColorRange' );
  var ConcentrationTransform = require( 'BEERS_LAW_LAB/beerslaw/model/ConcentrationTransform' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MolarAbsorptivityData = require( 'BEERS_LAW_LAB/beerslaw/model/MolarAbsorptivityData' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBeersLawSolution = require( 'BEERS_LAW_LAB/beerslaw/model/TBeersLawSolution' );

  // strings
  var cobaltChlorideString = require( 'string!BEERS_LAW_LAB/cobaltChloride' );
  var cobaltIINitrateString = require( 'string!BEERS_LAW_LAB/cobaltIINitrate' );
  var copperSulfateString = require( 'string!BEERS_LAW_LAB/copperSulfate' );
  var drinkMixString = require( 'string!BEERS_LAW_LAB/drinkMix' );
  var nickelIIChlorideString = require( 'string!BEERS_LAW_LAB/nickelIIChloride' );
  var pattern0Formula1NameString = require( 'string!BEERS_LAW_LAB/pattern.0formula.1name' );
  var pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  var potassiumChromateString = require( 'string!BEERS_LAW_LAB/potassiumChromate' );
  var potassiumDichromateString = require( 'string!BEERS_LAW_LAB/potassiumDichromate' );
  var potassiumPermanganateString = require( 'string!BEERS_LAW_LAB/potassiumPermanganate' );

  /**
   * @param {string} name
   * @param {string} formula
   * @param {MolarAbsorptivityData} molarAbsorptivityData
   * @param {RangeWithValue} concentrationRange
   * @param {ConcentrationTransform} concentrationTransform
   * @param {ColorRange} colorRange
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BeersLawSolution( name, formula, molarAbsorptivityData, concentrationRange, concentrationTransform,
                             colorRange, tandem, options ) {

    options = _.extend( {
      saturatedColor: colorRange.max // {Color} color to use when the solution is saturated
    }, options );

    var self = this;

    // @public
    this.solvent = Solvent.WATER;
    this.name = name;
    this.formula = formula;
    this.molarAbsorptivityData = molarAbsorptivityData;
    this.concentrationProperty = new Property( concentrationRange.defaultValue, {
      tandem: tandem.createTandem( 'concentrationProperty' ),
      phetioValueType: TNumber( { units: 'moles/liter', range: concentrationRange } )
    } );
    this.concentrationRange = concentrationRange;
    this.concentrationTransform = concentrationTransform;
    this.colorRange = colorRange;
    this.saturatedColor = options.saturatedColor;

    // @public Solution color is derived from concentration
    this.fluidColorProperty = new DerivedProperty( [ this.concentrationProperty ],
      function( concentration ) {
        var color = self.solvent.colorProperty.get();
        if ( concentration > 0 ) {
          var distance = Util.linear( self.concentrationRange.min, self.concentrationRange.max, 0, 1, concentration );
          color = self.colorRange.interpolateLinear( distance );
        }
        return color;
      } );

    // no corresponding removeInstance is needed because this object exists for the lifetime of the sim
    tandem.addInstance( this, TBeersLawSolution );
    this.tandemName = tandem.tail;
  }

  beersLawLab.register( 'BeersLawSolution', BeersLawSolution );

  inherit( Object, BeersLawSolution, {

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
    },

    // @public
    getDisplayConcentration: function( concentration ) {
      var valueText = Util.toFixed( this.concentrationTransform.modelToView( concentration ), 0 );
      return StringUtils.format( pattern0Value1UnitsString, valueText, this.concentrationTransform.units );
    }
  } );

  // A new tandem instance is required here since the solutes are created statically.
  var tandem = Tandem.createStaticTandem( 'beersLawScreen' ).createTandem( 'solutions' );

  //-------------------------------------------------------------------------------------------
  // Specific solutions below ...
  //-------------------------------------------------------------------------------------------

  BeersLawSolution.DRINK_MIX = new BeersLawSolution(
    drinkMixString,
    BLLSymbols.DRINK_MIX,
    MolarAbsorptivityData.DRINK_MIX,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
    tandem.createTandem( 'drinkMix' )
  );

  BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution(
    cobaltIINitrateString,
    BLLSymbols.COBALT_II_NITRATE,
    MolarAbsorptivityData.COBALT_II_NITRATE,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ),
    tandem.createTandem( 'cobaltIINitrate' )
  );

  BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution(
    cobaltChlorideString,
    BLLSymbols.COBALT_CHLORIDE,
    MolarAbsorptivityData.COBALT_CHLORIDE,
    new RangeWithValue( 0, 0.250, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ),
    tandem.createTandem( 'cobaltChloride' )
  );

  BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution(
    potassiumDichromateString,
    BLLSymbols.POTASSIUM_DICHROMATE,
    MolarAbsorptivityData.POTASSIUM_DICHROMATE,
    new RangeWithValue( 0, 0.000500, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ),
    tandem.createTandem( 'potassiumDichromate' )
  );

  BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution(
    potassiumChromateString,
    BLLSymbols.POTASSIUM_CHROMATE,
    MolarAbsorptivityData.POTASSIUM_CHROMATE,
    new RangeWithValue( 0, 0.000400, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ),
    tandem.createTandem( 'potassiumChromate' )
  );

  BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution(
    nickelIIChlorideString,
    BLLSymbols.NICKEL_II_CHLORIDE,
    MolarAbsorptivityData.NICKEL_II_CHLORIDE,
    new RangeWithValue( 0, 0.350, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ),
    tandem.createTandem( 'nickelIIChloride' )
  );

  BeersLawSolution.COPPER_SULFATE = new BeersLawSolution(
    copperSulfateString,
    BLLSymbols.COPPER_SULFATE,
    MolarAbsorptivityData.COPPER_SULFATE,
    new RangeWithValue( 0, 0.200, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ),
    tandem.createTandem( 'copperSulfate' )
  );

  BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution(
    potassiumPermanganateString,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
    new RangeWithValue( 0, 0.000800, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ),
    tandem.createTandem( 'potassiumPermanganate' ),
    { saturatedColor: new Color( 80, 0, 120 ) } // has a special saturated color
  );

  return BeersLawSolution;
} );