// Copyright 2013-2014, University of Colorado Boulder

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );

  // strings
  var drinkMixString = require( 'string!BEERS_LAW_LAB/drinkMix' );

  return {
    COBALT_II_NITRATE: ChemUtils.toSubscript( 'Co(NO3)2' ),
    COBALT_CHLORIDE: ChemUtils.toSubscript( 'CoCl2' ),
    COPPER_SULFATE: ChemUtils.toSubscript( 'CuSO4' ),
    DRINK_MIX: drinkMixString,
    NICKEL_II_CHLORIDE: ChemUtils.toSubscript( 'NiCl2' ),
    POTASSIUM_CHROMATE: ChemUtils.toSubscript( 'K2CrO4' ),
    POTASSIUM_DICHROMATE: ChemUtils.toSubscript( 'K2Cr2O7' ),
    POTASSIUM_PERMANGANATE: ChemUtils.toSubscript( 'KMnO4' ),
    WATER: ChemUtils.toSubscript( 'H2O' )
  };
} );