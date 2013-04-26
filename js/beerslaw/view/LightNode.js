// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of the light in the Beer's Law tab.
 * Origin is at the right center, where the light comes out of the "housing".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var ToggleButtonNode = require( "common/view/ToggleButtonNode" );

  // images
  var lightImage = require( "image!images/light.png" );

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function LightNode( light, mvt ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var housingNode = new Image( lightImage );
    var buttonNode = new ToggleButtonNode( light.on, new Property( true ) );

    // make the button fit in the housing
    buttonNode.setScaleMagnitude( 0.65 * housingNode.height / buttonNode.height );

    // rendering order
    thisNode.addChild( housingNode );
    thisNode.addChild( buttonNode );

    // layout
    housingNode.x = -housingNode.width;
    housingNode.y = -housingNode.height / 2;
    buttonNode.left = housingNode.right - buttonNode.width - 40;
    buttonNode.centerY = housingNode.centerY;

    // position
    var position = mvt.modelToViewPosition( light.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  inherit( LightNode, Node );

  return LightNode;
} );