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
  var BLLStrings = require( "common/BLLStrings" );
  var Color = require( "common/model/Color" );
  var DOM = require( "SCENERY/nodes/DOM" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WireNode = require( "common/view/WireNode" );

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
   * @constructor
   */
  function BodyNode( meter, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // text nodes
    var titleNode = new Text( BLLStrings.concentration, { font: "bold 18px Arial", fill: "white" } );
    var unitsNode = new Text( StringUtils.format( BLLStrings.pattern_parentheses_0text, [ BLLStrings.units_molesPerLiter ]), { font: "bold 14px Arial", fill: "white" } );

    // value: workaround for scenery#16. It would be preferable to use Text node, but it can't be updated fast enough.
    var $valueElement = $( '<span>' );
    $valueElement.css( { font: "24px Arial", fill: "black" } );
    $valueElement[0].innerHTML = new Number( 1 ).toFixed( VALUE_DECIMALS );
    var valueNode = new DOM( $valueElement[0] );

    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, unitsNode.width );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;
    var backgroundNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage), new Image( bodyRightImage ) );

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
    meter.body.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToView( location ) ;
    } );

    // displayed value
    meter.value.addObserver( function ( value ) {
      if ( isNaN( value ) ) {
        valueNode.getElement().innerHTML = NO_VALUE;
        valueNode.invalidateDOM();
        valueNode.centerX = backgroundNode.centerX; // center justified
      }
      else {
        valueNode.getElement().innerHTML = value.toFixed( VALUE_DECIMALS );
        valueNode.invalidateDOM();
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    } );
  }

  inherit( BodyNode, Node );

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
    thisNode.addChild( imageNode );
    var radius = imageNode.height / 2; // assumes that image height defines the radius
    imageNode.x = -radius;
    imageNode.y = -radius;

    // probe location
    meter.probe.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToView( location );
    } );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( meter.probe, mvt ) );

    var isInNode = function ( node ) {
      return node.getBounds().containsPoint( meter.probe.location.get() );
    };

    thisNode.isInSolution = function () {
      return isInNode( solutionNode );
    };

    thisNode.isInSolvent = function () {
      return isInNode( solventFluidNode );
    };

    thisNode.isInDrainFluid = function () {
      return isInNode( drainFluidNode );
    };

    thisNode.isInStockSolution = function () {
      return isInNode( stockSolutionNode );
    };
  }

  inherit( ProbeNode, Node );

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
    var wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

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

  inherit( ConcentrationMeterNode, Node );

  return ConcentrationMeterNode;
} );