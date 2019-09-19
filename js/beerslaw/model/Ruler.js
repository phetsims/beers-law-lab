// Copyright 2013-2015, University of Colorado Boulder

/**
 * Ruler model, to take advantage of location reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );

  /**
   * @param {number} length cm
   * @param {number} insets cm, the horizontal insets at the ends of the ruler
   * @param {number} height cm
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Tandem} tandem
   * @constructor
   */
  function Ruler( length, insets, height, location, dragBounds, tandem ) {

    Movable.call( this, location, dragBounds, tandem );

    // @public (read-only)
    this.length = length;
    this.insets = insets;
    this.height = height;
  }

  beersLawLab.register( 'Ruler', Ruler );

  return inherit( Movable, Ruler );
} );