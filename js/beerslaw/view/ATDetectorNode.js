// Copyright 2013, University of Colorado

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var BLLStrings = require( "common/BLLStrings" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" ); //TODO delete me
  var Text = require( "SCENERY/nodes/Text" );
  var WireNode = require( "common/view/WireNode" );

  // constants
  var BUTTONS_X_MARGIN = 25; // specific to image files
  var BUTTONS_Y_OFFSET = 17; // specific to image files
  var VALUE_X_MARGIN = 25; // specific to image files
  var VALUE_Y_OFFSET = 87; // specific to image files
  var ABSORBANCE_DECIMAL_PLACES = 2;
  var TRANSMITTANCE_DECIMAL_PLACES = 2;
  var NO_VALUE = "-";
  var PROBE_CENTER_Y_OFFSET = 55; // specific to image file

  // images
  var bodyLeftImage = require( "image!images/at-detector-body-left.png" );
  var bodyRightImage = require( "image!images/at-detector-body-right.png" );
  var bodyCenterImage = require( "image!images/at-detector-body-center.png" );
  var probeImage = require( "image!images/at-detector-probe.png" );

  /**
   * The body of the detector, where A and T values are displayed.
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BodyNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // buttons for changing the detector "mode"
    var transmittanceButton = new ModeButton( BLLStrings.transmittance, detector.mode, ATDetector.Mode.TRANSMITTANCE );
    var absorbanceButton = new ModeButton( BLLStrings.ABSORBANCE, detector.mode, ATDetector.Mode.ABSORBANCE );

    // group the buttons
    var buttonGroup = new Node();
    buttonGroup.addChild( transmittanceButton );
    buttonGroup.addChild( absorbanceButton );
    absorbanceButton.x = transmittanceButton.x;
    absorbanceButton.top = transmittanceButton.bottom + 1;

    // value display
    var maxValue = 100;
    var valueNode = new Text( maxValue.toFixed( ABSORBANCE_DECIMAL_PLACES ), { font: "24px Arial" } );

    // background image, sized to fit
    var bodyWidth = Math.max( buttonGroup.width, valueNode.width ) + ( 2 * BUTTONS_X_MARGIN );
    var backgroundNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage ), new Image( bodyRightImage ) );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( buttonGroup );
    thisNode.addChild( valueNode );

    // layout
    buttonGroup.x = BUTTONS_X_MARGIN;
    buttonGroup.y = BUTTONS_Y_OFFSET;
    valueNode.x = VALUE_X_MARGIN;
    valueNode.y = VALUE_Y_OFFSET;

    // body location
    detector.body.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );
  }

  inherit( BodyNode, Node );

  /**
   * The probe portion of the detector.
   * @param {Movable} probe
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProbeNode( probe, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var imageNode = new Image( probeImage );
    thisNode.addChild( imageNode );
    imageNode.x = -imageNode.width / 2;
    imageNode.y = -PROBE_CENTER_Y_OFFSET;

    // location
    probe.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new MovableDragHandler( probe, mvt ) );
  }

  inherit( ProbeNode, Node );

  /**
   * Radio button for changing modes
   * @param {String} text
   * @param {Property} mode of type ATDetector.Mode
   * @param {ATDetector.Mode} value
   * @constructor
   */
  function ModeButton( text, mode, value ) {

    var thisNode = this;
    Node.call( this );

    thisNode.addChild( new Rectangle( 0, 0, 20, 20, { fill: 'red', stroke: 'black' })); //XXX placeholder
  }

  inherit( ModeButton, Node );

  /**
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ATDetectorNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( detector, mvt );
    var probeNode = new ProbeNode( detector.probe, mvt );
    var wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );
  }

  inherit( ATDetectorNode, Node );

  return ATDetectorNode;
});

//        public BodyNode( final ATDetector detector, final ModelViewTransform mvt ) {
//
//            // buttons for changing the detector "mode"
//            PNode transmittanceButton = new ModeButton( UserComponents.transmittanceRadioButton, Strings.TRANSMITTANCE, detector.mode, ATDetectorMode.TRANSMITTANCE );
//            PNode absorbanceButton = new ModeButton( UserComponents.absorbanceRadioButton, Strings.ABSORBANCE, detector.mode, ATDetectorMode.ABSORBANCE );
//
//            // group the radio buttons
//            PNode buttonsNode = new PNode();
//            buttonsNode.addChild( transmittanceButton );
//            buttonsNode.addChild( absorbanceButton );
//            absorbanceButton.setOffset( transmittanceButton.getXOffset(),
//                                        transmittanceButton.getFullBoundsReference().getMaxY() + 1 );
//
//            // value display
//            final PText valueNode = new PText( getFormattedTransmittance( 100 ) );
//            valueNode.setFont( new PhetFont( 24 ) );
//
//            // background image, sized to fit
//            double bodyWidth = Math.max( buttonsNode.getFullBoundsReference().getWidth(), valueNode.getFullBoundsReference().getWidth() ) + ( 2 * BUTTONS_X_MARGIN );
//            final PNode backgroundNode = new HorizontalTiledNode( bodyWidth, Images.AT_DETECTOR_BODY_LEFT, Images.AT_DETECTOR_BODY_CENTER, Images.AT_DETECTOR_BODY_RIGHT );
//
//            // rendering order
//            addChild( backgroundNode );
//            addChild( buttonsNode );
//            addChild( valueNode );
//
//            // layout
//            buttonsNode.setOffset( BUTTONS_X_MARGIN, BUTTONS_Y_OFFSET );
//            valueNode.setOffset( VALUE_X_MARGIN, VALUE_Y_OFFSET );
//
//            // body location
//            detector.body.location.addObserver( new VoidFunction1<Vector2D>() {
//                public void apply( Vector2D location ) {
//                    setOffset( mvt.modelToView( location.toPoint2D() ) );
//                }
//            } );
//
//            // update the value display
//            RichSimpleObserver observer = new RichSimpleObserver() {
//                public void update() {
//                    Double value = detector.value.get();
//                    if ( value == null ) {
//                        valueNode.setText( NO_VALUE );
//                        // centered
//                        valueNode.setOffset( backgroundNode.getFullBoundsReference().getCenterX() - ( valueNode.getFullBoundsReference().getWidth() / 2 ),
//                                             valueNode.getYOffset() );
//                    }
//                    else {
//                        String text = ( detector.mode.get() == ATDetectorMode.TRANSMITTANCE ) ? getFormattedTransmittance( value ) : getFormattedAbsorbance( value );
//                        valueNode.setText( text );
//                        // right justified
//                        valueNode.setOffset( backgroundNode.getFullBoundsReference().getMaxX() - valueNode.getFullBoundsReference().getWidth() - VALUE_X_MARGIN,
//                                             valueNode.getYOffset() );
//                    }
//                }
//            };
//            observer.observe( detector.value, detector.mode );
//
//            addInputEventListener( new NonInteractiveEventHandler( UserComponents.detectorBody ) );
//        }
//
//        private String getFormattedAbsorbance( double absorbance ) {
//            return ABSORBANCE_FORMAT.format( absorbance );
//        }
//
//        private String getFormattedTransmittance( double transmittance ) {
//            return MessageFormat.format( Strings.PATTERN_0PERCENT, TRANSMITTANCE_FORMAT.format( transmittance ) );
//        }
//    }
//
//    // Radio button for changing modes
//    private static class ModeButton extends PSwing {
//        public ModeButton( IUserComponent userComponent, String text, Property<ATDetectorMode> mode, ATDetectorMode value ) {
//            super( new PropertyRadioButton<ATDetectorMode>( userComponent, text, mode, value ) {{
//                setOpaque( false );
//                setForeground( Color.WHITE );
//                setFont( new PhetFont( Font.BOLD, BLLConstants.CONTROL_FONT_SIZE ) );
//            }} );
//        }
//    }
//}
