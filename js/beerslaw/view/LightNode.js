// Copyright 2013-2015, University of Colorado Boulder

/**
 * Visual representation of the light in the Beer's Law screen.
 * Origin is at the right center, where the light comes out of the 'housing'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function LightNode( light, modelViewTransform, tandem ) {

    LaserPointerNode.call( this, light.onProperty, {
      bodySize: new Dimension2( 126, 78 ),
      nozzleSize: new Dimension2( 16, 65 ),
      buttonRadius: 26,
      buttonTouchExpansion: 25,
      translation: modelViewTransform.modelToViewPosition( light.location ),
      tandem: tandem
    } );
  }

  beersLawLab.register( 'LightNode', LightNode );

  return inherit( LaserPointerNode, LightNode );
} );