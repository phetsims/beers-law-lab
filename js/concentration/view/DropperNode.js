// Copyright 2002-2013, University of Colorado

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLImages = require( "common/BLLImages" );
  var Color = require( "common/model/Color" );
  var ConcentrationSolution = require( "concentration/model/ConcentrationSolution" );
  var DebugOriginNode = require( "common/view/DebugOriginNode" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MomentaryButton = require( "common/view/MomentaryButton" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );

  // constants
  var DEBUG_ORIGIN = false;
  var BUTTON_Y_OFFSET = 13; // y-offset of button location in dropper image file
  var LABEL_Y_OFFSET = 130; // y-offset of the label's center in dropper image file

  // constants specific to the image file
  var TIP_WIDTH = 15;
  var TIP_HEIGHT = 5;
  var GLASS_WIDTH = 46;
  var GLASS_HEIGHT = 150;
  var GLASS_Y_OFFSET = TIP_HEIGHT + 14;

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property} solute (type Solute)
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function DropperNode( dropper, solvent, solute, mvt ) {

    var thisNode = this;

    Node.call( thisNode, {
      cursor: "pointer"
    } );

    // fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    var fluidShape = new Shape()
        .moveTo( -TIP_WIDTH / 2, 0 )
        .lineTo( -TIP_WIDTH / 2, -TIP_HEIGHT )
        .lineTo( -GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
        .lineTo( -GLASS_WIDTH / 2, -GLASS_HEIGHT )
        .lineTo( GLASS_WIDTH / 2, -GLASS_HEIGHT )
        .lineTo( GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
        .lineTo( TIP_WIDTH / 2, -TIP_HEIGHT )
        .lineTo( TIP_WIDTH / 2, 0 )
        .close();
    var fluid = new Path( { shape: fluidShape } );

    // images
    var foreground = new Image( BLLImages.getImage( "dropper_foreground.png" ) );
    var background = new Image( BLLImages.getImage( "dropper_background.png" ) );

    // label
    var label = new HTMLText( dropper.solute.formula, { font: "bold 18px Arial", fill: "black" } );

    // label background, so the label shows up on various fluid colors
    var labelBackground = new Path(
        {
          fill: new Color( 240, 240, 240, 0.6 ).toCSS(),
          lineWidth: 0
        } );

    var button = new MomentaryButton( dropper.on, dropper.enabled );
    button.setScaleMagnitude( 0.3 );

    // rendering order
    thisNode.addChild( fluid );
    thisNode.addChild( background );
    thisNode.addChild( foreground );
    thisNode.addChild( labelBackground );
    thisNode.addChild( label );
    thisNode.addChild( button );
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new DebugOriginNode() );
    }

    // layout
    {
      // move origin to bottom center (tip) of images
      foreground.x = -foreground.width / 2;
      foreground.y = -foreground.height;
      background.x = -background.width / 2;
      background.y = -background.height;
      // center the button in the dropper's bulb
      button.x = foreground.centerX - ( button.width / 2 );
      button.y = foreground.top + BUTTON_Y_OFFSET;
      //NOTE: label will be positioned whenever its text is set, to keep it centered in the dropper's glass
    }

    // Update location
    dropper.location.addObserver( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // Visibility
    dropper.visible.addObserver( function( visible ) {
      thisNode.setVisible( visible );
    } );

    // Make the background visible only when the dropper is empty
    dropper.empty.addObserver( function( empty ) {
      fluid.setVisible( !empty );
      background.setVisible( empty );
    } );

    // Change the label and color when the solute changes.
    solute.addObserver( function( solute ) {

      // label, centered in the dropper's glass
      label.setText( solute.formula );

      // rotate to vertical, center the label in the droppers glass
      label.setRotation( -Math.PI / 2 );
      label.centerX = foreground.centerX;
      label.y = foreground.bottom - ( foreground.height - LABEL_Y_OFFSET ) + ( label.height / 2 );

      // translucent background for the label, so that it's visible on all solution colors
      var width = 1.5 * label.width;
      var height = 1.2 * label.height;
      var x = label.centerX - ( width / 2 );
      var y = label.centerY - ( height / 2 );
      labelBackground.setShape( Shape.roundRect( x, y, width, height, 5, 5 ) );

      // fluid color
      var color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
      fluid.fill = color.toCSS();
    } );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( dropper, mvt ) );
  }

  inherit( DropperNode, Node );

  DropperNode.prototype.getTipWidth = function() {
     return TIP_WIDTH;
  };

  return DropperNode;
} );
