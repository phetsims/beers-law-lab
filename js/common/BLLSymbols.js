// Copyright 2002-2013, University of Colorado

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var toSubscript = require( "NITROGLYCERIN/ChemUtils" ).toSubscript;
  var BLLStrings = require( "common/BLLStrings" );

  function BLLSymbols() {}

  BLLSymbols.COBALT_II_NITRATE = toSubscript( "Co(NO3)2" );
  BLLSymbols.COBALT_CHLORIDE = toSubscript( "CoCl2" );
  BLLSymbols.COPPER_SULFATE = toSubscript( "CuSO4" );
  BLLSymbols.DRINK_MIX = BLLStrings.drinkMix;
  BLLSymbols.NICKEL_II_CHLORIDE = toSubscript( "NiCl2" );
  BLLSymbols.POTASSIUM_CHROMATE = toSubscript( "K2CrO4" );
  BLLSymbols.POTASSIUM_DICHROMATE = toSubscript( "K2Cr2O7" );
  BLLSymbols.POTASSIUM_PERMANGANATE = toSubscript( "KMnO4" );
  BLLSymbols.WATER = toSubscript( "H2O" );

  return BLLSymbols;
} );