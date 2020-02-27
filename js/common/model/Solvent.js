// Copyright 2013-2019, University of Colorado Boulder

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

  class Solvent extends Fluid {

    /**
     * @param {string} name
     * @param {string} formula
     * @param {number} density - g/L
     * @param {Color} color
     */
    constructor( name, formula, density, color ) {

      super( color );

      // @public (read-only)
      this.name = name;
      this.formula = formula;
      this.density = density; // g/L
    }
  }

  Solvent.WATER_COLOR = new Color( 224, 255, 255 );

  // 'water' is not currently presented to the user as a solvent, since this sim supports only 1 solvent.
  // See https://github.com/phetsims/beers-law-lab/issues/190
  Solvent.WATER = new Solvent( 'water', BLLSymbols.WATER, 1000, Solvent.WATER_COLOR );

  return beersLawLab.register( 'Solvent', Solvent );
} );
