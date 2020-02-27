// Copyright 2013-2020, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const saturatedString = require( 'string!BEERS_LAW_LAB/saturated' );

  class SaturatedIndicator extends Node {

    /**
     * @param {ConcentrationSolution} solution
     */
    constructor( solution ) {

      super();

      const label = new Text( saturatedString, { font: new PhetFont( 20 ), maxWidth: 400 } );

      // translucent light-gray background, so this shows up on all solution colors
      const background = new Rectangle( 0, 0, 1.2 * label.width, 1.2 * label.height, 8, 8,
        { fill: 'rgba( 240, 240, 240, 0.6 )' } );

      // rendering order
      this.addChild( background );
      this.addChild( label );

      // layout
      label.centerX = background.centerX;
      label.centerY = background.centerY;

      // make this node visible when the solution is saturated
      solution.saturatedProperty.link( saturated => {
        this.setVisible( saturated );
      } );
    }
  }

  return beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );
} );