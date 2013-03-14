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

  // images
  var bodyLeftImage = require( "image!images/concentration-meter-body-left.png" );
  var bodyCenterImage = require( "image!images/concentration-meter-body-center.png" );
  var bodyRightImage = require( "image!images/concentration-meter-body-right.png" );
  var probeImage = require( "image!images/concentration-meter-probe.png" );

  // constants
  var VALUE_FORMAT = "0.000";
  var NO_VALUE = "-";
  var TITLE_Y_OFFSET = 12; // specific to body image file
  var TEXT_X_MARGIN = 25;  // specific to body image file
  var VALUE_X_MARGIN = 25; // specific to body image file
  var VALUE_Y_OFFSET = 67; // specific to body image file

  /**
   * @param {ConcentrationMeter} meter
   * @param strings
   * @constructor
   */
  function BodyNode( meter, strings ) {

    var thisNode = this;
    Node.call( thisNode );

    // text nodes
    var titleNode = new Text( strings.concentration, { fill: Color.WHITE.toCSS(), font: "bold 18px Arial" } );
    var unitsNode = new Text( StringUtils.format( strings.pattern_parentheses_0text, [ strings.units_molesPerLiter ]), { fill: Color.WHITE.toCSS(), font: "bold 14px Arial" } );
    var valueNode = new Text( VALUE_FORMAT, { fill: Color.WHITE.toCSS(), font: "24px Arial" } );

    // create a background that fits the text
    var maxTextWidth = Math.max( titleNode.width, Math.max( unitsNode.width, valueNode.width ) );
    var bodyWidth = ( 2 * TEXT_X_MARGIN ) + maxTextWidth;

    var imageNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage), new Image( bodyRightImage ) );
    this.addChild( imageNode );

    // body location
    meter.body.location.addObserver( function ( location ) {
      thisNode.translation = location;
    } );
  }

  Inheritance.inheritPrototype( BodyNode, Node );

  /**
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param strings
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, strings ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.meter = meter;
    thisNode.solution = solution;
    thisNode.dropper = dropper;

    thisNode.addChild( new BodyNode( meter, strings ) );
  }

  Inheritance.inheritPrototype( ConcentrationMeterNode, Node );

  return ConcentrationMeterNode;
} );