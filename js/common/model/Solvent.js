// Copyright 2002-2013, University of Colorado Boulder

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  var Color = require( 'SCENERY/util/Color' );
  var Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var waterString = require( 'string!BEERS_LAW_LAB/water' );

  /**
   * Constructor.
   * @param {string} name
   * @param {string} formula
   * @param {Color} color
   * @constructor
   */
  function Solvent( name, formula, color ) {
    Fluid.call( this, color );
    this.name = name;
    this.formula = formula;
  }

  Solvent.WATER_COLOR = new Color( 224, 255, 255 );

  Solvent.WATER = new Solvent( waterString, BLLSymbols.WATER, Solvent.WATER_COLOR );

  return inherit( Fluid, Solvent );
} );
