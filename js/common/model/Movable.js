// Copyright 2013-2015, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Tandem} tandem
   * @constructor
   */
  function Movable( location, dragBounds, tandem ) {
    this.locationProperty = new Property( location, {
      tandem: tandem.createTandem( 'locationProperty' ),
      type: TVector2
    } ); // @public
    this.dragBounds = dragBounds; // @public (read-only)
  }

  beersLawLab.register( 'Movable', Movable );

  return inherit( Object, Movable, {

    // @public
    reset: function() {
      this.locationProperty.reset();
    }
  } );
} );
