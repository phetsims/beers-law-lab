// Copyright 2013-2022, University of Colorado Boulder

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

  protected constructor( color: Color ) {
    this.colorProperty = new Property( color );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.colorProperty.reset();
  }
}

beersLawLab.register( 'Fluid', Fluid );