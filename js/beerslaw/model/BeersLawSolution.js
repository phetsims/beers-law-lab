// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model for the Beer's Law tab.
 * <p/>
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 * <p/>
 * Note that this model does not use the Solute model from the Concentration tab, because
 * we have very different needs wrt color scheme, properties, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var BLLSymbols = require( "common/BLLSymbols" );
  var Color = require( "SCENERY/util/Color" );
  var ColorRange = require( "common/model/ColorRange" );
  var ConcentrationTransform = require( "beerslaw/model/ConcentrationTransform" );
  var MolarAbsorptivityData = require( "beerslaw/model/MolarAbsorptivityData" );
  var Property = require( "AXON/Property" );
  var Range = require( "DOT/Range" );
  var Solvent = require( "common/model/Solvent" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Util = require( "DOT/Util" );

  /**
   * @param {String} name
   * @param {String} formula
   * @param {MolarAbsorptivityData} molarAbsorptivityData
   * @param {Range} concentrationRange
   * @param {ConcentrationTransform} concentrationTransform
   * @param {ColorRange} colorRange
   * @param {Color} saturatedColor optional, defaults to colorRange.maxColor
   * @constructor
   */
  function BeersLawSolution( name, formula, molarAbsorptivityData, concentrationRange, concentrationTransform, colorRange, saturatedColor ) {

    var thisSolution = this;

    thisSolution.solvent = Solvent.WATER;
    thisSolution.name = name;
    thisSolution.formula = formula;
    thisSolution.molarAbsorptivityData = molarAbsorptivityData;
    thisSolution.concentration = new Property( concentrationRange.defaultValue );
    thisSolution.concentrationRange = concentrationRange;
    thisSolution.concentrationTransform = concentrationTransform;
    thisSolution.colorRange = colorRange;
    thisSolution.saturatedColor = saturatedColor || colorRange.max;

    /*
     * Creates a color that corresponds to the solution's concentration.
     * @param {Number} concentration
     * @param {Range} concentrationRange
     * @param {ColorRange} colorRange
     * @param {Solvent} solvent
     * @return Color
     */
    var createFluidColor = function( concentration, concentrationRange, colorRange, solvent ) {
      var color = thisSolution.solvent.color.get();
      if ( concentration > 0 ) {
        var distance = Util.linear( thisSolution.concentrationRange.min, thisSolution.concentrationRange.max, 0, 1, concentration );
        color = thisSolution.colorRange.interpolateLinear( distance );
      }
      return color;
    };
    thisSolution.fluidColor = new Property( createFluidColor( thisSolution.concentration.get() ) );

    // update fluid color when concentration changes
    this.concentration.link( function( concentration ) {
      thisSolution.fluidColor.set( createFluidColor( concentration ) );
    } );
  }

  BeersLawSolution.prototype = {

    reset: function() {
      this.concentration.reset();
    },

    getDisplayName: function() {
      if ( this.formula === this.name ) {
        return this.name;
      }
      return StringUtils.format( BLLStrings.pattern_0formula_1name, this.formula, this.name );
    },

    getViewValue: function() {
      return this.concentrationTransform.modelToView( this.concentration.get() );
    },

    getViewUnits: function() {
      return this.concentrationTransform.units;
    }
  };

  //-------------------------------------------------------------------------------------------
  // Specific solutions below ...
  //-------------------------------------------------------------------------------------------

  BeersLawSolution.DRINK_MIX = new BeersLawSolution(
    BLLStrings.drinkMix,
    BLLSymbols.DRINK_MIX,
    MolarAbsorptivityData.DRINK_MIX,
    new Range( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED )
  );

  BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution(
    BLLStrings.cobaltIINitrate,
    BLLSymbols.COBALT_II_NITRATE,
    MolarAbsorptivityData.COBALT_II_NITRATE,
    new Range( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ) );

  BeersLawSolution.COBALT_CHLORIDE = new BeersLawSolution(
    BLLStrings.cobaltChloride,
    BLLSymbols.COBALT_CHLORIDE,
    MolarAbsorptivityData.COBALT_CHLORIDE,
    new Range( 0, 0.250, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) )
  );

  BeersLawSolution.POTASSIUM_DICHROMATE = new BeersLawSolution(
    BLLStrings.potassiumDichromate,
    BLLSymbols.POTASSIUM_DICHROMATE,
    MolarAbsorptivityData.POTASSIUM_DICHROMATE,
    new Range( 0, 0.000500, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) )
  );

  BeersLawSolution.POTASSIUM_CHROMATE = new BeersLawSolution(
    BLLStrings.potassiumChromate,
    BLLSymbols.POTASSIUM_CHROMATE,
    MolarAbsorptivityData.POTASSIUM_CHROMATE,
    new Range( 0, 0.000400, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) )
  );

  BeersLawSolution.NICKEL_II_CHLORIDE = new BeersLawSolution(
    BLLStrings.nickelIIChloride,
    BLLSymbols.NICKEL_II_CHLORIDE,
    MolarAbsorptivityData.NICKEL_II_CHLORIDE,
    new Range( 0, 0.350, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) )
  );

  BeersLawSolution.COPPER_SULFATE = new BeersLawSolution(
    BLLStrings.copperSulfate,
    BLLSymbols.COPPER_SULFATE,
    MolarAbsorptivityData.COPPER_SULFATE,
    new Range( 0, 0.200, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) )
  );

  BeersLawSolution.POTASSIUM_PERMANGANATE = new BeersLawSolution(
    BLLStrings.potassiumPermanganate,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
    new Range( 0, 0.000800, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ),
    new Color( 80, 0, 120 )  // has a special saturated color
  );

  return BeersLawSolution;
} );