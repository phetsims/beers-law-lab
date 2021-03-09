// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class Light {

  /**
   * @param {Vector2} position cm
   * @param {boolean} on
   * @param {number} lensDiameter cm
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Object} [options]
   */
  constructor( position, on, lensDiameter, solutionProperty, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.position = position;
    this.lensDiameter = lensDiameter;

    // @public
    this.onProperty = new BooleanProperty( on, {
      tandem: options.tandem.createTandem( 'onProperty' )
    } );
    this.wavelengthProperty = new NumberProperty( solutionProperty.get().molarAbsorptivityData.lambdaMax /*nm*/, {
      units: 'nm',
      range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH ),
      tandem: options.tandem.createTandem( 'wavelengthProperty' )
    } );

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solutionProperty.link( solution => {
      this.wavelengthProperty.set( solution.molarAbsorptivityData.lambdaMax );
    } );
  }

  // @public
  reset() {
    this.onProperty.reset();
  }

  // @public
  getMinY() {
    return this.position.y - ( this.lensDiameter / 2 );
  }

  // @public
  getMaxY() {
    return this.position.y + ( this.lensDiameter / 2 );
  }
}

beersLawLab.register( 'Light', Light );
export default Light;