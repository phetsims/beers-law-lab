// Copyright 2002-2013, University of Colorado Boulder

/**
 * Concentration meter, with probe.
 * <p/>
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * <ul>
 * <li>solution in the beaker
 * <li>output of the solvent faucet
 * <li>output of the drain faucet
 * <li>output of the dropper
 * </ul>
 * <p/>
 * Rather than trying to model the shapes of all of these fluids, we handle "probe is in fluid"
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLImages = require( "common/BLLImages" );
  var BLLStrings = require( "common/BLLStrings" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var VALUE_DECIMALS = 3;
  var NO_VALUE = "-";
  var TITLE_TOP = 12; // specific to bodyCenterImage
  var TEXT_X_MARGIN = 25;  // specific to bodyCenterImage
  var VALUE_X_MARGIN = 30; // specific to bodyCenterImage
  var VALUE_CENTER_Y = 84; // specific to bodyCenterImage

  /**
   * Meter body, origin at upper left.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BodyNode( meter, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // text nodes
    var titleNode = new Text( BLLStrings.concentration,
      { font: new BLLFont( 18 ), fill: "white" } );
    var unitsNode = new Text( StringUtils.format( BLLStrings.pattern_parentheses_0text, BLLStrings.units_molesPerLiter ),
      { font: new BLLFont( 18 ), fill: "white" } );
    var valueNode = new Text( ( 1 ).toFixed( VALUE_DECIMALS ),
      { font: new BLLFont( 24 ), fill: "black" } );

    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, unitsNode.width );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;
    var backgroundNode = new HorizontalTiledNode( bodyWidth,
      new Image( BLLImages.getImage( "concentration-meter-body-left.png" ) ),
      new Image( BLLImages.getImage( "concentration-meter-body-center.png" ) ),
      new Image( BLLImages.getImage( "concentration-meter-body-right.png" ) ) );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( unitsNode );
    thisNode.addChild( valueNode );

    // layout
    titleNode.centerX = backgroundNode.centerX;
    titleNode.top = TITLE_TOP;
    unitsNode.centerX = backgroundNode.centerX;
    unitsNode.top = titleNode.bottom + 5;
    valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
    valueNode.centerY = VALUE_CENTER_Y;

    // body location
    meter.body.location.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // displayed value
    meter.value.link( function( value ) {
      if ( isNaN( value ) ) {
        valueNode.setText( NO_VALUE );
        valueNode.centerX = backgroundNode.centerX; // center justified
      }
      else {
        valueNode.setText( value.toFixed( VALUE_DECIMALS ) );
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    } );
  }

  inherit( Node, BodyNode );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} mvt
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( probe, mvt, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: "pointer"
    } );

    var imageNode = new Image( BLLImages.getImage( "concentration-meter-probe.png" ) );
    thisNode.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -radius;
    imageNode.y = -radius;

    // probe location
    probe.location.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // touch area
    var dx = 0.25 * imageNode.width;
    var dy = 0.25 * imageNode.height;
    thisNode.mouseArea = Shape.rectangle( imageNode.x - dx, imageNode.y - dy, imageNode.width + dx + dx, imageNode.height + dy + dy );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( probe, mvt ) );

    var isInNode = function( node ) {
      return node.getBounds().containsPoint( probe.location.get() );
    };

    thisNode.isInSolution = function() {
      return isInNode( solutionNode );
    };

    thisNode.isInSolvent = function() {
      return isInNode( solventFluidNode );
    };

    thisNode.isInDrainFluid = function() {
      return isInNode( drainFluidNode );
    };

    thisNode.isInStockSolution = function() {
      return isInNode( stockSolutionNode );
    };
  }

  inherit( Node, ProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, {
      shape: new Shape(),
      stroke: "gray",
      lineWidth: 8,
      lineCap: "square",
      lineJoin: "round"
    } );

    var updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( 50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.location.link( updateCurve );
    probe.location.link( updateCurve );
  }

  inherit( Path, WireNode );

  /**
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Faucet} solventFaucet
   * @param {Faucet} drainFaucet
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} mvt
   * @param strings
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solventFaucet, drainFaucet, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, mvt, strings ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( meter, mvt, strings );
    var probeNode = new ProbeNode( meter.probe, mvt, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );

    var updateValue = function() {
      if ( probeNode.isInSolution() ) {
        meter.value.set( solution.concentration.get() );
      }
      else if ( probeNode.isInSolvent() ) {
        meter.value.set( 0 );
      }
      else if ( probeNode.isInDrainFluid() ) {
        meter.value.set( solution.concentration.get() );
      }
      else if ( probeNode.isInStockSolution() ) {
        meter.value.set( dropper.solute.get().stockSolutionConcentration );
      }
      else {
        meter.value.set( NaN );
      }
    };
    meter.probe.location.link( updateValue );
    solution.solute.link( updateValue );
    solution.volume.link( updateValue );
    solution.concentration.link( updateValue );
    solventFaucet.flowRate.link( updateValue );
    drainFaucet.flowRate.link( updateValue );
  }

  inherit( Node, ConcentrationMeterNode );

  return ConcentrationMeterNode;
} );