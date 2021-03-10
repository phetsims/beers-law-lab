// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solvent is the model of a liquid that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import beersLawLab from '../../beersLawLab.js';
import BLLSymbols from '../BLLSymbols.js';
import Fluid from './Fluid.js';

class Solvent extends Fluid {

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} density - g/L
   * @param {Color} color
   */
  constructor( name, formula, density, color ) {
    assert && assert( typeof name === 'string' );
    assert && assert( typeof formula === 'string' );
    assert && assert( typeof density === 'number' );
    assert && assert( color instanceof Color );

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

beersLawLab.register( 'Solvent', Solvent );
export default Solvent;