// Copyright 2002-2013, University of Colorado

//TODO implement subscripts
/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [ "i18n!../../nls/beers-law-lab-strings" ],
  function( Strings ) {

    function Symbols() {}

    Symbols.COBALT_II_NITRATE = "Co(NO3)2";
    Symbols.COBALT_CHLORIDE = "CoCl2";
    Symbols.COPPER_SULFATE = "CuSO4";
    Symbols.DRINK_MIX = Strings.DRINK_MIX;
    Symbols.NICKEL_II_CHLORIDE = "NiCl2";
    Symbols.POTASSIUM_CHROMATE = "K2CrO4";
    Symbols.POTASSIUM_DICHROMATE = "K2Cr2O7";
    Symbols.POTASSIUM_PERMANGANATE = "KMnO4";
    Symbols.WATER = "H2O";

    return Symbols;
  }
);