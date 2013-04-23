// Copyright 2002-2013, University of Colorado

/**
 * Solution model for the Beer's Law module.
 * <p/>
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 * <p/>
 * Note that this model does not use the Solute model from the Concentration module, because
 * we have very different needs wrt color scheme, properties, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var BLLSymbols = require( "common/BLLSymbols" );
  var Color = require( "common/model/Color" );
  var ColorRange = require( "common/model/ColorRange" );
  var ConcentrationTransform = require( "beerslaw/model/ConcentrationTransform" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var MolarAbsorptivityData = require( "beerslaw/model/MolarAbsorptivityData" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Solvent = require( "common/model/Solvent" );
  var StringUtils = require( "common/util/StringUtils" );

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
    thisSolution.saturatedColor = saturatedColor || colorRange.maxColor;

    /*
     * Creates a color that corresponds to the solution's concentration.
     * @param {Number} concentration
     * @param {Range} concentrationRange
     * @param {ColorRange} colorRange
     * @param {Solvent} solvent
     * @return Color
     */
    var createFluidColor = function ( concentration, concentrationRange, colorRange, solvent ) {
      var color = thisSolution.solvent.color.get();
      if ( concentration > 0 ) {
        var f = new LinearFunction( thisSolution.concentrationRange, new Range( 0, 1 ) );
        color = thisSolution.colorRange.interpolateLinear( f.evaluate( concentration ) );
      }
      return color;
    };
    thisSolution.fluidColor = new Property( createFluidColor( thisSolution.concentration.get() ) );

    // update fluid color when concentration changes
    this.concentration.addObserver( function( concentration ) {
         thisSolution.fluidColor.set( createFluidColor( concentration ) );
    } );
  }

  BeersLawSolution.prototype.reset = function() {
    this.concentration.reset();
  };

  BeersLawSolution.prototype.getDisplayName = function () {
    return StringUtils.format( BLLStrings.pattern_0formula_1name, [ this.formula, this.name ] );
  };

  BeersLawSolution.prototype.getViewUnits = function () {
    return this.concentrationTransform.units;
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
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ) );

  BeersLawSolution.COBALT_II_NITRATE = new BeersLawSolution(
    BLLStrings.cobaltIINitrate,
    BLLSymbols.COBALT_II_NITRATE,
    MolarAbsorptivityData.COBALT_II_NITRATE,
    new Range( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ) );

  return BeersLawSolution;
});