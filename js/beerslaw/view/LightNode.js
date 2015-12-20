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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var Shape = require( 'KITE/Shape' );

  // images
  var lightImage = require( 'image!BEERS_LAW_LAB/light.png' );

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function LightNode( light, modelViewTransform, tandem ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var housing = new Image( lightImage, { pickable: false } );
    var button = new RoundStickyToggleButton( false, true, light.onProperty, {
      baseColor: 'red',
      tandem: tandem.createTandem( 'button' )
    } );

    // expand touch area for button. Do this before scaling the button!
    button.touchArea = Shape.circle( 0, 0, 1.0 * button.width /* radius */ );

    // make the button fit in the housing
    button.setScaleMagnitude( 0.65 * housing.height / button.height );

    // rendering order
    thisNode.addChild( housing );
    thisNode.addChild( button );

    // layout
    housing.x = -housing.width;
    housing.y = -housing.height / 2;
    button.left = housing.right - button.width - 40;
    button.centerY = housing.centerY;

    // position
    var position = modelViewTransform.modelToViewPosition( light.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  beersLawLab.register( 'LightNode', LightNode );

  return inherit( Node, LightNode );
} );