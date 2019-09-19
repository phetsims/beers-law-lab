// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const SoluteComboBox = require( 'BEERS_LAW_LAB/concentration/view/SoluteComboBox' );
  const SoluteFormNode = require( 'BEERS_LAW_LAB/concentration/view/SoluteFormNode' );

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
    const soluteComboBox = new SoluteComboBox( solutes, currentSoluteProperty, soluteListParent, tandem.createTandem( 'soluteComboBox' ) );

    // radio buttons for solid vs solution
    const soluteFormNode = new SoluteFormNode( soluteFormProperty, shaker, dropper, tandem.createTandem( 'soluteFormNode' ) );

    const contentNode = new Node();
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