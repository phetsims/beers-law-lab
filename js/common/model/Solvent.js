// Copyright 2002-2013, University of Colorado Boulder

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLSymbols = require( "common/BLLSymbols" );
  var Color = require( "SCENERY/util/Color" );
  var Fluid = require( "common/model/Fluid" );
  var inherit = require( "PHET_CORE/inherit" );
  var BLLStrings = require( "common/BLLStrings" );

  /**
   * Constructor.
   * @param {String} name
   * @param {String} formula
   * @param {Color} color
   * @constructor
   */
  function Solvent( name, formula, color ) {

    Fluid.call( this, color );

    this.name = name;
    this.formula = formula;
  }

  inherit( Fluid, Solvent );

  Solvent.WATER_COLOR = new Color( 224, 255, 255 );

  Solvent.WATER = new Solvent( BLLStrings.water, BLLSymbols.WATER, Solvent.WATER_COLOR );

  return Solvent;
} );
