// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const SoluteComboBox = require( 'BEERS_LAW_LAB/concentration/view/SoluteComboBox' );
  const SoluteFormRadioButtonGroup = require( 'BEERS_LAW_LAB/concentration/view/SoluteFormRadioButtonGroup' );

  class SoluteControls extends Panel {
    /**
     * @param {Solute[]} solutes
     * @param {Property.<Solute>} currentSoluteProperty
     * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'solution'
     * @param {Shaker} shaker
     * @param {Dropper} dropper
     * @param {Node} soluteListParent
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( solutes, currentSoluteProperty, soluteFormProperty, shaker, dropper, soluteListParent, tandem, options ) {

      options = merge( {
        xMargin: 15,
        yMargin: 15,
        fill: '#F0F0F0',
        stroke: 'gray',
        lineWidth: 1,
        tandem: tandem
      }, options );

      // solute combo box
      const soluteComboBox = new SoluteComboBox( solutes, currentSoluteProperty, soluteListParent,
        tandem.createTandem( 'soluteComboBox' ) );

      // radio buttons for solid vs solution
      const soluteFormRadioButtonGroup = new SoluteFormRadioButtonGroup( soluteFormProperty, shaker, dropper,
        tandem.createTandem( 'soluteFormRadioButtonGroup' ) );

      const contentNode = new Node();
      contentNode.addChild( soluteFormRadioButtonGroup );
      contentNode.addChild( soluteComboBox ); // add last, so that dropdown is on top

      // layout
      soluteFormRadioButtonGroup.left = soluteComboBox.left;
      soluteFormRadioButtonGroup.top = soluteComboBox.bottom + 15;

      super( contentNode, options );
    }
  }

  return beersLawLab.register( 'SoluteControls', SoluteControls );
} );