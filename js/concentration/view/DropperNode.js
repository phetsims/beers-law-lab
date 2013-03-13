// Copyright 2002-2013, University of Colorado

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Shape = require( "KITE/Shape" );
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );
  var DOM = require( "SCENERY/nodes/DOM" );
  var Path = require( "SCENERY/nodes/Path" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Color = require( "common/model/Color" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var MomentaryButtonNode = require( "common/view/MomentaryButtonNode" );
  var DebugOriginNode = require( "common/view/DebugOriginNode" );
  var foregroundImage = require( "image!images/dropper_foreground.png" );
  var backgroundImage = require( "image!images/dropper_background.png" );

  // constants
  var DEBUG_ORIGIN = false;
  var BUTTON_Y_OFFSET = 13; // y-offset of button location in dropper image file
  var LABEL_Y_OFFSET = 130; // y-offset of the label's center in dropper image file

  // constants specific to the image file
  DropperNode.TIP_WIDTH = 15;  //TODO this is ugly
  var TIP_WIDTH = DropperNode.TIP_WIDTH;
  var TIP_HEIGHT = 5;
  var GLASS_WIDTH = 46;
  var GLASS_HEIGHT = 150;
  var GLASS_Y_OFFSET = TIP_HEIGHT + 14;

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property<Solute>} solute
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function DropperNode( dropper, solvent, solute, mvt ) {

    var thisNode = this;

    Node.call( thisNode, {
      cursor: "pointer"
    } );

    // glass portion of the dropper, used to fill dropper with stock solution, specific to the dropper image file
    var glassShape = new Shape()
      .moveTo( -TIP_WIDTH / 2, 0 )
      .lineTo( -TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( -GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
      .lineTo( -GLASS_WIDTH / 2, -GLASS_HEIGHT )
      .lineTo( GLASS_WIDTH / 2, -GLASS_HEIGHT )
      .lineTo( GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
      .lineTo( TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( TIP_WIDTH / 2, 0 )
      .close();
    var glassNode = new Path( { shape: glassShape, fill: 'red' } );

    // images
    var foregroundNode = new Image( foregroundImage );
    var backgroundNode = new Image( backgroundImage );

    // label
    var $labelElement = $( '<div>' );
    $labelElement.css(
      { "font": "bold 15px Arial",
        "fill": "black",
        "textAlign": "center",
        "textBaseline": "middle"
      } );
    var labelNode = new DOM( $labelElement[0] );

    // label background, so the label shows up on various fluid colors
    var labelBackgroundNode = new Path(
      {
        fill: new Color( 240, 240, 240, 150 ).toCSS(),
        lineWidth: 0
      } );

    var buttonNode = new MomentaryButtonNode( dropper.on, dropper.enabled );
    buttonNode.setScale( 0.3 );

    // rendering order
    thisNode.addChild( glassNode );
    thisNode.addChild( backgroundNode );
    thisNode.addChild( foregroundNode );
    thisNode.addChild( labelBackgroundNode );
    thisNode.addChild( labelNode );
    thisNode.addChild( buttonNode );
    if( DEBUG_ORIGIN ) {
      thisNode.addChild( new DebugOriginNode() );
    }

    // layout
    {
      // move origin to bottom center (tip) of images
      foregroundNode.x = -foregroundNode.width / 2;
      foregroundNode.y = -foregroundNode.height;
      backgroundNode.x = -backgroundNode.width / 2;
      backgroundNode.y = -backgroundNode.height;
      // center the button in the dropper's bulb
      buttonNode.x = foregroundNode.getBounds().getCenterX() - ( buttonNode.width / 2 );
      buttonNode.y = foregroundNode.getBounds().getMinY() + BUTTON_Y_OFFSET;
      //NOTE: label will be positioned whenever its text is set, to keep it centered in the dropper's glass
    }

    // Update location
    dropper.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToView( location );
    } );

    // Visibility
    dropper.visible.addObserver( function ( visible ) {
      console.log( "visible=" + visible );//XXX
//      thisNode.setVisible( visible ); //TODO this makes the page unresponsive, scenery bug?
    } );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( dropper, mvt ) );
  }

  Inheritance.inheritPrototype( DropperNode, Node );

  return DropperNode;

} );

//class DropperNode extends PhetPNode {
//
//    private static final boolean SHOW_ORIGIN = false;
//    private static final double BUTTON_Y_OFFSET = 13; // y offset of button location in dropper image file
//    private static final double LABEL_Y_OFFSET = 130; // y offset of the label's center in dropper image file
//
//    public static final double TIP_WIDTH = 15; // specific to image file
//
//    // glass portion of the dropper, used to fill dropper with stock solution, specific to the dropper image file
//    private static final GeneralPath GLASS_PATH = new DoubleGeneralPath() {{
//        final double tipWidth = TIP_WIDTH;
//        final double tipHeight = 5;
//        final double glassWidth = 46;
//        final double glassHeight = 150;
//        final double glassYOffset = tipHeight + 14;
//        moveTo( -tipWidth / 2, 0 );
//        lineTo( -tipWidth / 2, -tipHeight );
//        lineTo( -glassWidth / 2, -glassYOffset );
//        lineTo( -glassWidth / 2, -glassHeight );
//        lineTo( glassWidth / 2, -glassHeight );
//        lineTo( glassWidth / 2, -glassYOffset );
//        lineTo( tipWidth / 2, -tipHeight );
//        lineTo( tipWidth / 2, 0 );
//        closePath();
//    }}.getGeneralPath();
//
//    public DropperNode( final Dropper dropper, final Solvent solvent, final Property<Solute> solute ) {
//
//        // nodes
//        final PPath fluidNode = new PPath( GLASS_PATH ); // fluid inside the dropper
//        final PImage foregroundImageNode = new PImage( Images.DROPPER_FOREGROUND );
//        final PImage backgroundImageNode = new PImage( Images.DROPPER_BACKGROUND );
//        final HTMLNode labelNode = new HTMLNode( "", Color.BLACK, new PhetFont( Font.BOLD, 15 ) );
//        final PPath labelBackgroundNode = new PPath() {{
//            setPaint( ColorUtils.createColor( new Color( 240, 240, 240 ), 150 ) );
//            setStroke( null );
//        }};
//        MomentaryButtonNode buttonNode = new MomentaryButtonNode( UserComponents.dropperButton,
//                                                                  dropper.on, PiccoloPhetResources.getImage( "button_pressed.png" ), PiccoloPhetResources.getImage( "button_unpressed.png" ),
//                                                                  dropper.enabled, PiccoloPhetResources.getImage( "button_pressed_disabled.png" ), PiccoloPhetResources.getImage( "button_unpressed_disabled.png" ) ) {{
//            scale( 0.3 );
//        }};
//
//        // rendering order
//        addChild( fluidNode );
//        addChild( backgroundImageNode );
//        addChild( foregroundImageNode );
//        addChild( labelBackgroundNode );
//        addChild( labelNode );
//        addChild( buttonNode );
//        if ( SHOW_ORIGIN ) {
//            addChild( new DebugOriginNode() );
//        }
//
//        // layout
//        {
//            // move origin to bottom center (tip) of images
//            foregroundImageNode.setOffset( -foregroundImageNode.getFullBoundsReference().getWidth() / 2, -foregroundImageNode.getFullBoundsReference().getHeight() );
//            backgroundImageNode.setOffset( -backgroundImageNode.getFullBoundsReference().getWidth() / 2, -backgroundImageNode.getFullBoundsReference().getHeight() );
//            // center the button in the dropper's bulb
//            buttonNode.setOffset( foregroundImageNode.getFullBoundsReference().getCenterX() - ( buttonNode.getFullBoundsReference().getWidth() / 2 ),
//                                  foregroundImageNode.getFullBoundsReference().getMinY() + BUTTON_Y_OFFSET );
//            //NOTE: label will be positioned whenever its text is set, to keep it centered in the dropper's glass
//        }
//
//        // Change the label and fluid color when the solute changes.
//        final RichSimpleObserver observer = new RichSimpleObserver() {
//            public void update() {
//
//                // label, centered in the dropper's glass
//                labelNode.setHTML( dropper.solute.get().formula );
//                labelNode.setRotation( -Math.PI / 2 );
//                labelNode.setOffset( -( labelNode.getFullBoundsReference().getWidth() / 2 ),
//                                     foregroundImageNode.getFullBoundsReference().getMaxY() - ( foregroundImageNode.getFullBoundsReference().getHeight() - LABEL_Y_OFFSET ) + ( labelNode.getFullBoundsReference().getHeight() / 2 ) );
//
//                // translucent background for the label, so that it's visible on all solution colors
//                final double width = 1.2 * labelNode.getFullBoundsReference().getWidth();
//                final double height = 1.2 * labelNode.getFullBoundsReference().getHeight();
//                final double x = labelNode.getFullBoundsReference().getCenterX() - ( width / 2 );
//                final double y = labelNode.getFullBoundsReference().getCenterY() - ( height / 2 );
//                labelBackgroundNode.setPathTo( new RoundRectangle2D.Double( x, y, width, height, 8, 8 ) );
//
//                // fluid color
//                Color color = ConcentrationSolution.createColor( solvent, solute.get(), solute.get().stockSolutionConcentration );
//                fluidNode.setPaint( color );
//                fluidNode.setStrokePaint( BLLConstants.createFluidStrokeColor( color ) );
//            }
//        };
//        observer.observe( dropper.solute, dropper.solute.get().colorScheme );
//
//        // rewire to a different color scheme when the solute changes
//        solute.addObserver( new ChangeObserver<Solute>() {
//            public void update( Solute newSolute, Solute oldSolute ) {
//                oldSolute.colorScheme.removeObserver( observer );
//                newSolute.colorScheme.addObserver( observer );
//            }
//        } );
//
//        // Visibility
//        dropper.visible.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean visible ) {
//                setVisible( visible );
//            }
//        } );
//
//        // Update location
//        dropper.location.addObserver( new SimpleObserver() {
//            public void update() {
//                setOffset( dropper.location.get().toPoint2D() );
//            }
//        } );
//
//        // Make the background visible only when the dropper is empty
//        dropper.empty.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean empty ) {
//                fluidNode.setVisible( !empty );
//                backgroundImageNode.setVisible( empty );
//            }
//        } );
//
//        addInputEventListener( new CursorHandler() );
//        addInputEventListener( new MovableDragHandler( UserComponents.dropper, dropper, this ) );
//    }
//}
