// Copyright 2013-2023, University of Colorado Boulder

/**
 * Cuvette is a simple model of a cuvette. A cuvette is a small tube of circular or square cross section,
 * sealed at one end, made of plastic, glass, or fused quartz (for UV light) and designed to hold samples
 * for spectroscopic experiments.
 *
 * In this case, the cuvette is the vessel that holds the solution.
 * It has a fixed height, but a variable width, making it possible to change
 * the path length. Position is fixed.  Origin is at the upper-left corner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';
import BLLConstants from '../../common/BLLConstants.js';

type SelfOptions = {
  position?: Vector2;
  widthRange?: RangeWithValue; // variable width, cm
  height?: 3; // fixed height, cm
};

type CuvetteOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Cuvette extends PhetioObject {

  public readonly position: Vector2;

  // Variable width of the cuvette, in cm
  public readonly widthProperty: NumberProperty;

  // When dragging the cuvette, it's width will snap to this interval when the drag ends. 0 causes no snapping.
  // Note that is only consulted at the end of a drag sequence - see CuvetteDragListener. If you change
  // snapIntervalProperty, it will NOT modify the value of widthProperty.
  // See https://github.com/phetsims/beers-law-lab/issues/330.
  public readonly snapIntervalProperty: NumberProperty;

  // Fixed height of the cuvette, in cm
  public readonly height: number;

  public constructor( providedOptions: CuvetteOptions ) {

    const options = optionize<CuvetteOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      widthRange: new RangeWithValue( 0.5, 2.0, 1.0 ), // variable width, cm
      height: 3, // fixed height, cm

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = options.position;

    this.widthProperty = new NumberProperty( options.widthRange.defaultValue, {
      units: 'cm',
      range: options.widthRange,
      tandem: options.tandem.createTandem( 'widthProperty' )
    } );

    this.snapIntervalProperty = new NumberProperty( BLLQueryParameters.cuvetteSnapInterval, {
      units: 'cm',
      range: BLLConstants.CUVETTE_SNAP_INTERVAL_RANGE,
      tandem: options.tandem.createTandem( 'snapIntervalProperty' ),
      phetioFeatured: true, // Properties associated with query parameters are typically featured
      phetioDocumentation: 'When dragging the cuvette, it\'s width will snap to this interval when the drag ends. Use 0 for no snapping.'
    } );

    this.height = options.height;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.widthProperty.reset();
  }
}

beersLawLab.register( 'Cuvette', Cuvette );