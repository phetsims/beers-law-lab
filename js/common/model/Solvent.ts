// Copyright 2013-2022, University of Colorado Boulder

/**
 * Solvent is the model of a liquid that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import Fluid from './Fluid.js';

export default class Solvent extends Fluid {

  public readonly name: string;
  public readonly formula: string;
  public readonly density: number; // g/L

  // 'water' is not currently presented to the user as a solvent, since this sim supports only 1 solvent.
  // See https://github.com/phetsims/beers-law-lab/issues/190
  public static readonly WATER = new Solvent( 'water', 'H<sub>2</sub>O', 1000, new Color( 224, 255, 255 ) );

  public constructor( name: string, formula: string, density: number, color: Color ) {

    super( color );

    this.name = name;
    this.formula = formula;
    this.density = density;
  }
}

beersLawLab.register( 'Solvent', Solvent );