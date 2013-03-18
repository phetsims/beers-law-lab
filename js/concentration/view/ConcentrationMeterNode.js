// Copyright 2002-2013, University of Colorado

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
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var Range = require( "PHETCOMMON/math/Range" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Vector2 = require( "DOT/Vector2" );
  var Shape = require( "KITE/Shape" );
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );
  var Path = require( "SCENERY/nodes/Path" );
  var Text = require( "SCENERY/nodes/Text" );
  var Color = require( "common/model/Color" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var StringUtils = require( "common/util/StringUtils" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );

  // images
  var bodyLeftImage = require( "image!images/concentration-meter-body-left.png" );
  var bodyCenterImage = require( "image!images/concentration-meter-body-center.png" );
  var bodyRightImage = require( "image!images/concentration-meter-body-right.png" );
  var probeImage = require( "image!images/concentration-meter-probe.png" );

  // constants
  var VALUE_DECIMALS = 3;
  var NO_VALUE = "-";
  var TITLE_TOP = 20; // specific to bodyCenterImage
  var TEXT_X_MARGIN = 25;  // specific to bodyCenterImage
  var VALUE_X_MARGIN = 30; // specific to bodyCenterImage
  var VALUE_CENTER_Y = 84; // specific to bodyCenterImage

  /**
   * Meter body, origin at upper left.
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @constructor
   */
  function BodyNode( meter, mvt, strings ) {

    var thisNode = this;
    Node.call( thisNode );

    // text nodes
    var titleNode = new Text( strings.concentration, { font: "bold 18px Arial", fill: "white" } );
    var unitsNode = new Text( StringUtils.format( strings.pattern_parentheses_0text, [ strings.units_molesPerLiter ]), { font: "bold 14px Arial", fill: "white" } );
    var valueNode = new Text( new Number( 1 ).toFixed( VALUE_DECIMALS ), { font: "24px Arial", fill: "black" } );

    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, Math.max( unitsNode.width, valueNode.width ) );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;

    var imageNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage), new Image( bodyRightImage ) );

    // rendering order
    thisNode.addChild( imageNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( unitsNode );
    thisNode.addChild( valueNode );

    // layout
    titleNode.centerX = imageNode.centerX;
    titleNode.top = TITLE_TOP;
    unitsNode.centerX = imageNode.centerX;
    unitsNode.top = titleNode.bottom + 5;
    valueNode.right = imageNode.right - VALUE_X_MARGIN; // right justified
    valueNode.centerY = VALUE_CENTER_Y;

    // body location
    meter.body.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToView( location ) ;
    } );

    // displayed value
    meter.value.addObserver( function ( value ) {
      if ( isNaN( value ) ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = imageNode.centerX; // centered
      }
      else {
        valueNode.text = value.toFixed( VALUE_DECIMALS );
        valueNode.right = imageNode.right - VALUE_X_MARGIN; // right justified
      }
    } );
  }

  Inheritance.inheritPrototype( BodyNode, Node );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2D} mvt
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @constructor
   */
  function ProbeNode( meter, mvt, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: "pointer"
    } );

    var meter = meter;
    var solutionNode = solutionNode;
    var stockSolutionNode = stockSolutionNode;
    var solventFluidNode = solventFluidNode;
    var drainFluidNode = drainFluidNode;

    var imageNode = new Image( probeImage );
    this.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -radius;
    imageNode.y = -radius;

    // probe location
    meter.probe.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToView( location );
    } );

    // drag handler
    this.addInputListener( new MovableDragHandler( meter.probe, mvt ) );

    var isInNode = function ( node ) {
      return node.getBounds().containsPoint( meter.probe.location.get() );
    };

    this.isInSolution = function () {
      return isInNode( solutionNode );
    };

    this.isInSolvent = function () {
      return isInNode( solventFluidNode );
    };

    this.isInDrainFluid = function () {
      return isInNode( drainFluidNode );
    };

    this.isInStockSolution = function () {
      return isInNode( stockSolutionNode );
    };
  }

  Inheritance.inheritPrototype( ProbeNode, Node );

  /**
   * Wire that connects the probe to the body of the meter.
   * @param {ConcentrationMeter} meter
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( meter, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( thisNode, {
      shape: new Shape(),
      stroke: 'gray',
      lineWidth: 8,
      lineCap: "square",
      lineJoin: "round"
    } );

    // The y coordinate of the body's control point varies with the x distance between the body and probe.
    var BODY_CTRL_Y = new LinearFunction( new Range( 0, 800 ), new Range( 0, 200 ) ); // x distance -> y coordinate

    var updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      var probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      var c1Offset = new Vector2( 0, BODY_CTRL_Y.evaluate( bodyNode.centerX - probeNode.left ) );
      var c2Offset = new Vector2( 50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    meter.body.location.addObserver( updateCurve );
    meter.probe.location.addObserver( updateCurve );
  }

  Inheritance.inheritPrototype( WireNode, Path );

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
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solventFaucet, drainFaucet,
                                   solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, mvt, strings ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( meter, mvt, strings )
    var probeNode = new ProbeNode( meter, mvt, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode );
    var wireNode = new WireNode( meter, bodyNode, probeNode );

    // rendering order
    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );

    var updateValue = function () {
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
    meter.probe.location.addObserver( updateValue );
    solution.solute.addObserver( updateValue );
    solution.volume.addObserver( updateValue );
    solution.concentration.addObserver( updateValue );
    solventFaucet.flowRate.addObserver( updateValue );
    drainFaucet.flowRate.addObserver( updateValue );
  }

  Inheritance.inheritPrototype( ConcentrationMeterNode, Node );

  return ConcentrationMeterNode;
} );