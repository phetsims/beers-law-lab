// Copyright 2013-2020, University of Colorado Boulder

/**
 * Light is the model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class Light {

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Object} [options]
   */
  constructor( solutionProperty, options ) {

    options = merge( {
      position: Vector2.ZERO, // cm
      lensDiameter: 0.45, // cm
      isOn: false,
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.position = options.position;
    this.lensDiameter = options.lensDiameter;

    // @public
    this.isOnProperty = new BooleanProperty( options.isOn, {
      tandem: options.tandem.createTandem( 'isOnProperty' )
    } );

    // @public
    this.wavelengthProperty = new NumberProperty( solutionProperty.value.molarAbsorptivityData.lambdaMax /*nm*/, {
      units: 'nm',
      range: new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH ),
      tandem: options.tandem.createTandem( 'wavelengthProperty' ),
      phetioReadOnly: true
    } );

    // @public
    this.modeProperty = new EnumerationProperty( Light.Mode, Light.Mode.PRESET, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solutionProperty.link( solution => {
      this.wavelengthProperty.value = solution.molarAbsorptivityData.lambdaMax;
    } );

    this.modeProperty.link( mode => {

      // 'Preset' sets the light to the current solution's lambdaMax wavelength.
      if ( mode === Light.Mode.PRESET ) {
        this.wavelengthProperty.value = solutionProperty.value.molarAbsorptivityData.lambdaMax;
      }
    } );
  }

  // @public
  reset() {
    this.isOnProperty.reset();
    this.wavelengthProperty.reset();
    this.modeProperty.reset();
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

// @public
Light.Mode = Enumeration.byKeys( [ 'PRESET', 'VARIABLE' ] );

beersLawLab.register( 'Light', Light );
export default Light;