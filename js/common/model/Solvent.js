// Copyright 2013-2015, University of Colorado Boulder

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  var Color = require( 'SCENERY/util/Color' );
  var Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var waterString = require( 'string!BEERS_LAW_LAB/water' );

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} density - g/L
   * @param {Color} color
   * @constructor
   */
  function Solvent( name, formula, density, color ) {

    Fluid.call( this, color );

    // @public (read-only)
    this.name = name;
    this.formula = formula;
    this.density = density; // g/L
  }

  beersLawLab.register( 'Solvent', Solvent );

  Solvent.WATER_COLOR = new Color( 224, 255, 255 );

  Solvent.WATER = new Solvent( waterString, BLLSymbols.WATER, 1000, Solvent.WATER_COLOR );

  return inherit( Fluid, Solvent );
} );
