// Copyright 2013-2020, University of Colorado Boulder

/**
 * A cuvette is a small tube of circular or square cross section, sealed at one end,
 * made of plastic, glass, or fused quartz (for UV light) and designed to hold samples
 * for spectroscopic experiments.
 *
 * In this case, the cuvette is the vessel that holds the solution.
 * It has a fixed height, but a variable width, making it possible to change
 * the path length. Position is fixed.  Origin is at the upper-left corner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {Vector2} position fixed position, cm
   * @param {RangeWithValue} widthRange variable width, cm
   * @param {number} height fixed height, cm
   * @param {Tandem} tandem
   * @constructor
   */
  function Cuvette( position, widthRange, height, tandem ) {

    // @public (read-only)
    this.position = position;
    this.widthRange = widthRange;
    this.widthProperty = new NumberProperty( widthRange.defaultValue, {
      tandem: tandem.createTandem( 'widthProperty' ),
      range: widthRange,
      units: 'centimeters'
    } );
    this.height = height;
  }

  beersLawLab.register( 'Cuvette', Cuvette );

  return inherit( Object, Cuvette, {

    // @public
    reset: function() {
      this.widthProperty.reset();
    }
  } );
} );
