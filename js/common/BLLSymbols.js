// Copyright 2002-2013, University of Colorado

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ChemUtils = require( "common/util/ChemUtils" );
  var BLLStrings = require( "common/BLLStrings" );

  function BLLSymbols() {}

  BLLSymbols.COBALT_II_NITRATE = ChemUtils.toSubscript( "Co(NO3)2" );
  BLLSymbols.COBALT_CHLORIDE = ChemUtils.toSubscript( "CoCl2" );
  BLLSymbols.COPPER_SULFATE = ChemUtils.toSubscript( "CuSO4" );
  BLLSymbols.DRINK_MIX = BLLStrings.drinkMix;
  BLLSymbols.NICKEL_II_CHLORIDE = ChemUtils.toSubscript( "NiCl2" );
  BLLSymbols.POTASSIUM_CHROMATE = ChemUtils.toSubscript( "K2CrO4" );
  BLLSymbols.POTASSIUM_DICHROMATE = ChemUtils.toSubscript( "K2Cr2O7" );
  BLLSymbols.POTASSIUM_PERMANGANATE = ChemUtils.toSubscript( "KMnO4" );
  BLLSymbols.WATER = ChemUtils.toSubscript( "H2O" );

  return BLLSymbols;
} );