// Copyright 2013, University of Colorado

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );

  // constants
  var PROBE_CENTER_Y_OFFSET = 55; // specific to image file

  // images
  var bodyLeftImage = require( "image!images/at-detector-body-left.png" );
  var bodyRightImage = require( "image!images/at-detector-body-right.png" );
  var bodyCenterImage = require( "image!images/at-detector-body-center.png" );
  var probeImage = require( "image!images/at-detector-probe.png" );

  /**
   * The probe portion of the detector.
   *
   * @param {Movable} probe
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function ProbeNode( probe, mvt ) {

    var thisNode = this;
    Image.call( thisNode, probeImage );

    // location
    probe.location.addObserver( function ( location ) {
      var viewLocation = mvt.modelToView( location );
      thisNode.centerX = viewLocation.x;
      thisNode.y = viewLocation.y - PROBE_CENTER_Y_OFFSET;
    } );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new MovableDragHandler( probe, mvt ) );
  }

  inherit( ProbeNode, Image );

  /**
   * @param {ATDetector} detector
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function ATDetectorNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.addChild( new ProbeNode( detector.probe, mvt ) );
  }

  inherit( ATDetectorNode, Node );

  return ATDetectorNode;
});

//class ATDetectorNode extends PhetPNode {
//
//    public final PNode bodyNode;
//
//    public ATDetectorNode( ATDetector detector, ModelViewTransform mvt ) {
//
//        // nodes
//        bodyNode = new BodyNode( detector, mvt );
//        PNode probeNode = new ProbeNode( detector, mvt );
//        PNode wireNode = new WireNode( bodyNode, probeNode );
//
//        // rendering order
//        addChild( wireNode );
//        addChild( bodyNode );
//        addChild( probeNode );
//
//        //NOTE: layout is handled by child nodes observing model elements.
//    }
//
//    // The body of the detector, where A and T values are displayed.
//    private static class BodyNode extends PNode {
//
//        private static final double BUTTONS_X_MARGIN = 25;  // specific to image files
//        private static final double BUTTONS_Y_OFFSET = 17;  // specific to image files
//        private static final double VALUE_X_MARGIN = 25; // specific to image files
//        private static final double VALUE_Y_OFFSET = 87; // specific to image files
//        private static final DecimalFormat ABSORBANCE_FORMAT = new DecimalFormat( "0.00" );
//        private static final DecimalFormat TRANSMITTANCE_FORMAT = new DecimalFormat( "0.00" );
//        private static final String NO_VALUE = "-";
//
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
//    // Wire that connects the probe to the body of the detector.
//    public class WireNode extends PPath {
//        public WireNode( final PNode bodyNode, final PNode probeNode ) {
//            setStroke( new BasicStroke( 8, BasicStroke.CAP_SQUARE, BasicStroke.JOIN_ROUND, 1f ) );
//            setStrokePaint( Color.GRAY );
//
//            // Update when bounds of the body or probe change
//            final PropertyChangeListener listener = new PropertyChangeListener() {
//                public void propertyChange( PropertyChangeEvent evt ) {
//
//                    // connect to left center of body
//                    final double bodyConnectionX = bodyNode.getFullBoundsReference().getMinX();
//                    final double bodyConnectionY = bodyNode.getFullBounds().getCenterY();
//
//                    // connect to bottom center of probe
//                    final double probeConnectionX = probeNode.getFullBoundsReference().getCenterX();
//                    final double probeConnectionY = probeNode.getFullBoundsReference().getMaxY();
//
//                    // cubic curve
//                    final double controlPointOffset = 60;
//                    setPathTo( new CubicCurve2D.Double( bodyConnectionX, bodyConnectionY,
//                                                        bodyConnectionX - controlPointOffset, bodyConnectionY,
//                                                        probeConnectionX, probeConnectionY + controlPointOffset,
//                                                        probeConnectionX, probeConnectionY ) );
//                }
//            };
//            probeNode.addPropertyChangeListener( PNode.PROPERTY_FULL_BOUNDS, listener );
//            bodyNode.addPropertyChangeListener( PNode.PROPERTY_FULL_BOUNDS, listener );
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
