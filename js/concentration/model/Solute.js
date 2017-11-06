// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SoluteColorScheme = require( 'BEERS_LAW_LAB/concentration/model/SoluteColorScheme' );
  var Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );

  // phet-io modules
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );

  // strings
  var cobaltChlorideString = require( 'string!BEERS_LAW_LAB/cobaltChloride' );
  var cobaltIINitrateString = require( 'string!BEERS_LAW_LAB/cobaltIINitrate' );
  var copperSulfateString = require( 'string!BEERS_LAW_LAB/copperSulfate' );
  var drinkMixString = require( 'string!BEERS_LAW_LAB/drinkMix' );
  var nickelIIChlorideString = require( 'string!BEERS_LAW_LAB/nickelIIChloride' );
  var potassiumChromateString = require( 'string!BEERS_LAW_LAB/potassiumChromate' );
  var potassiumDichromateString = require( 'string!BEERS_LAW_LAB/potassiumDichromate' );
  var potassiumPermanganateString = require( 'string!BEERS_LAW_LAB/potassiumPermanganate' );
  var sodiumChlorideString = require( 'string!BEERS_LAW_LAB/sodiumChloride' );

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} stockSolutionConcentration - mol/L
   * @param {number} molarMass - g/mol
   * @param {SoluteColorScheme} colorScheme
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function Solute( name, formula, stockSolutionConcentration, molarMass, colorScheme, tandem, options ) {

    options = _.extend( {
      particleColor: colorScheme.maxColor,
      particleSize: 5,
      particlesPerMole: 200
    }, options );

    // @public (read-only), (read-write, phet-io)
    this.name = name;
    this.formula = formula;

    // @public (read-only)
    this.stockSolutionConcentration = stockSolutionConcentration; // mol/L
    this.molarMass = molarMass; // g/mol
    this.colorScheme = colorScheme;
    this.particleColor = options.particleColor;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;

    // @public (read-only) percent concentration [0,100] of stock solution, see beers-law-lab#149
    this.stockSolutionPercentConcentration = 100 *
                                             ( molarMass * stockSolutionConcentration ) / ( Solvent.WATER.density + ( molarMass * stockSolutionConcentration ) );
    assert && assert( this.stockSolutionPercentConcentration >= 0 && this.stockSolutionPercentConcentration <= 100 );

    // no corresponding removeInstance is needed because this object exists for the lifetime of the sim

    tandem.addInstance( this, TSolute, options );
    this.tandemName = tandem.tail;
  }

  beersLawLab.register( 'Solute', Solute );

  inherit( Object, Solute, {

    // @public gets the saturated concentration, in mol/L
    getSaturatedConcentration: function() {
      return this.colorScheme.maxConcentration;
    }
  } );

  // Specific solutes ===========================================

  // A new tandem instance is required here since the solutes are created statically. Signify that these solutes are
  // only used in the concentration screen by attaching them to that screen's tandem.
  var tandem = BLLConstants.CONCENTRATION_SCREEN_TANDEM.createTandem( 'solutes' );

  Solute.DRINK_MIX = new Solute(
    drinkMixString,
    drinkMixString,
    5.5, // stockSolutionConcentration, mol/L
    342.296, // molarMass, g/mol (sucrose)
    new SoluteColorScheme( 0, new Color( 224, 255, 255 ), 0.05, new Color( 255, 225, 225 ), 5.96, new Color( 255, 0, 0 ) ),
    tandem.createTandem( 'drinkMix' )
  );

  Solute.COBALT_II_NITRATE = new Solute(
    cobaltIINitrateString,
    BLLSymbols.COBALT_II_NITRATE,
    5.0, // stockSolutionConcentration, mol/L
    182.942, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 225, 225 ), 5.64, new Color( 255, 0, 0 ) ),
    tandem.createTandem( 'cobaltIINitrate' )
  );

  Solute.COBALT_CHLORIDE = new Solute(
    cobaltChlorideString,
    BLLSymbols.COBALT_CHLORIDE,
    4.0, // stockSolutionConcentration, mol/L
    129.839, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 242, 242 ), 4.33, new Color( 255, 106, 106 ) ),
    tandem.createTandem( 'cobaltChloride' )
  );

  Solute.POTASSIUM_DICHROMATE = new Solute(
    potassiumDichromateString,
    BLLSymbols.POTASSIUM_DICHROMATE,
    0.5, // stockSolutionConcentration, mol/L
    294.185, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 204, 153 ), 0.51, new Color( 255, 127, 0 ) ),
    tandem.createTandem( 'potassiumDichromate' )
  );

  Solute.POTASSIUM_CHROMATE = new Solute(
    potassiumChromateString,
    BLLSymbols.POTASSIUM_CHROMATE,
    3.0, // stockSolutionConcentration, mol/L
    194.191, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 255, 153 ), 3.35, new Color( 255, 255, 0 ) ),
    tandem.createTandem( 'potassiumChromate' )
  );

  Solute.NICKEL_II_CHLORIDE = new Solute(
    nickelIIChlorideString,
    BLLSymbols.NICKEL_II_CHLORIDE,
    5.0, // stockSolutionConcentration, mol/L
    129.599, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 170, 255, 170 ), 5.21, new Color( 0, 128, 0 ) ),
    tandem.createTandem( 'nickelIIChloride' )
  );

  Solute.COPPER_SULFATE = new Solute(
    copperSulfateString,
    BLLSymbols.COPPER_SULFATE,
    1.0, // stockSolutionConcentration, mol/L
    159.609, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 200, 225, 255 ), 1.38, new Color( 30, 144, 255 ) ),
    tandem.createTandem( 'copperSulfate' )
  );

  Solute.POTASSIUM_PERMANGANATE = new Solute(
    potassiumPermanganateString,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    0.4, // stockSolutionConcentration, mol/L
    158.034, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 0, 255 ), 0.48, new Color( 80, 0, 120 ) ),
    tandem.createTandem( 'potassiumPermanganate' ), {
      particleColor: Color.BLACK
    }
  );

  Solute.SODIUM_CHLORIDE = new Solute(
    sodiumChlorideString,
    BLLSymbols.SODIUM_CHLORIDE,
    5.50, // stockSolutionConcentration, mol/L
    58.443, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 5.00, new Color( 225, 250, 250 ), 6.15, new Color( 225, 240, 240 ) ),
    tandem.createTandem( 'sodiumChloride' )
  );

  return Solute;
} );
