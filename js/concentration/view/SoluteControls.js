// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var SoluteComboBox = require( 'BEERS_LAW_LAB/concentration/view/SoluteComboBox' );
  var SoluteFormNode = require( 'BEERS_LAW_LAB/concentration/view/SoluteFormNode' );

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} currentSoluteProperty
   * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'liquid'
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Node} soluteListParent
   * @constructor
   */
  function SoluteControlsNode( solutes, currentSoluteProperty, soluteFormProperty, shaker, dropper, soluteListParent ) {

    // solute combo box
    var soluteComboBox = new SoluteComboBox( solutes, currentSoluteProperty, soluteListParent );

    // radio buttons for solid vs solution
    var soluteFormNode = new SoluteFormNode( soluteFormProperty, shaker, dropper );

    var contentNode = new Node();
    contentNode.addChild( soluteFormNode );
    contentNode.addChild( soluteComboBox ); // add last, so that dropdown is on top

    // layout
    soluteFormNode.left = soluteComboBox.left;
    soluteFormNode.top = soluteComboBox.bottom + 15;

    Panel.call( this, contentNode,
      { xMargin: 15, yMargin: 15, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1 } );
  }

  return inherit( Panel, SoluteControlsNode );
} );