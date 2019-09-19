// Copyright 2013-2016, University of Colorado Boulder

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLSymbols = require( 'BEERS_LAW_LAB/common/BLLSymbols' );
  const Color = require( 'SCENERY/util/Color' );
  const Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  const inherit = require( 'PHET_CORE/inherit' );

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

  // 'water' is not currently presented to the user, since this sim supports only 1 solvent.
  // See https://github.com/phetsims/beers-law-lab/issues/190
  Solvent.WATER = new Solvent( 'water', BLLSymbols.WATER, 1000, Solvent.WATER_COLOR );

  return inherit( Fluid, Solvent );
} );
