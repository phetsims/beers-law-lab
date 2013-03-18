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
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );
  var Text = require( "SCENERY/nodes/Text" );
  var Color = require( "common/model/Color" );
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
  var VALUE_FORMAT = "0.000"; //TODO compute this based on VALUE_DECIMALS
  var NO_VALUE = "-";
  var TITLE_TOP = 20; // specific to bodyCenterImage
  var TEXT_X_MARGIN = 25;  // specific to bodyCenterImage
  var VALUE_X_MARGIN = 30; // specific to bodyCenterImage
  var VALUE_CENTER_Y = 80; // specific to bodyCenterImage

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
    var valueNode = new Text( VALUE_FORMAT, { font: "24px Arial", fill: "black" } );

    //TODO maxTextWidth appears to be wider than expected
    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, Math.max( unitsNode.width, valueNode.width ) );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;

    var imageNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage), new Image( bodyRightImage ) );

    // rendering order
    this.addChild( imageNode );
    this.addChild( titleNode );
    this.addChild( unitsNode );
    this.addChild( valueNode );

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
    Node.call( this, {
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
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, mvt, strings ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.addChild( new BodyNode( meter, mvt, strings ) );
    var probeNode = new ProbeNode( meter, mvt, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode );
    thisNode.addChild( probeNode );

    var updateValue = function () {
      console.log( "ConcentrationMeterNode.updateValue" );//XXX
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
    solution.concentration.addObserver( updateValue );

    //XXX debug
    meter.value.addObserver( function( value ) {
       console.log( "ConcentrationMeterNode meter.value=" + value );//XXX
    });

    //TODO updateValue if any of the fluid nodes' bounds change
  }

  Inheritance.inheritPrototype( ConcentrationMeterNode, Node );

  return ConcentrationMeterNode;
} );