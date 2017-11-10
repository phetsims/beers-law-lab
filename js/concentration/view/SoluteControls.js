// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var SoluteComboBox = require( 'BEERS_LAW_LAB/concentration/view/SoluteComboBox' );
  var SoluteFormNode = require( 'BEERS_LAW_LAB/concentration/view/SoluteFormNode' );

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} currentSoluteProperty
   * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'solution'
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Node} soluteListParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SoluteControls( solutes, currentSoluteProperty, soluteFormProperty, shaker, dropper, soluteListParent, tandem, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: tandem
    }, options );

    // solute combo box
    var soluteComboBox = new SoluteComboBox( solutes, currentSoluteProperty, soluteListParent, tandem.createTandem( 'soluteComboBox' ) );

    // radio buttons for solid vs solution
    var soluteFormNode = new SoluteFormNode( soluteFormProperty, shaker, dropper, tandem.createTandem( 'soluteFormNode' ) );

    var contentNode = new Node();
    contentNode.addChild( soluteFormNode );
    contentNode.addChild( soluteComboBox ); // add last, so that dropdown is on top

    // layout
    soluteFormNode.left = soluteComboBox.left;
    soluteFormNode.top = soluteComboBox.bottom + 15;

    Panel.call( this, contentNode, options );
  }

  beersLawLab.register( 'SoluteControls', SoluteControls );

  return inherit( Panel, SoluteControls );
} );