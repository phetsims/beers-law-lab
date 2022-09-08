// Copyright 2013-2021, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/287 consider getting rid of this class. Solvent has a static color, ConcentrationSolution has a dynamic color
/**
 * Fluid is the base class model for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { Color } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';

export default class Fluid {

  public readonly colorProperty: Property<Color>;

  public constructor( color: Color ) {
    this.colorProperty = new Property( color );
  }

  public reset(): void {
    this.colorProperty.reset();
  }
}

beersLawLab.register( 'Fluid', Fluid );