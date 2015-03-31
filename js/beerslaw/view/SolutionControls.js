// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConcentrationControl = require( 'BEERS_LAW_LAB/beerslaw/view/ConcentrationControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var SolutionComboBox = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionComboBox' );

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} currentSolutionProperty
   * @param {Node} solutionListParent
   * @constructor
   */
  function SolutionControls( solutions, currentSolutionProperty, solutionListParent ) {

    // nodes
    var comboBox = new SolutionComboBox( solutions, currentSolutionProperty, solutionListParent );
    var concentrationControl = new ConcentrationControl( currentSolutionProperty );
    var contentNode = new Node();

    // rendering order
    contentNode.addChild( concentrationControl );
    contentNode.addChild( comboBox );

    // layout
    concentrationControl.left = comboBox.left;
    concentrationControl.top = comboBox.bottom + 15;

    Panel.call( this, contentNode,
      { xMargin: 15, yMargin: 15, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );
  }

  return inherit( Panel, SolutionControls );
} );