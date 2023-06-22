// Copyright 2013-2022, University of Colorado Boulder

/**
 * Fluid is the base class model for all fluids.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import { Color } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';

export default class Fluid {

  public readonly colorProperty: Property<Color>;

  protected constructor( color: Color ) {
    this.colorProperty = new Property( color );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.colorProperty.reset();
  }
}

beersLawLab.register( 'Fluid', Fluid );