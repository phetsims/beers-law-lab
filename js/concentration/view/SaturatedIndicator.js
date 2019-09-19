// Copyright 2013-2017, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const saturatedString = require( 'string!BEERS_LAW_LAB/saturated' );

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function SaturatedIndicator( solution ) {

    var self = this;
    
    Node.call( this );

    var label = new Text( saturatedString, { font: new PhetFont( 20 ), maxWidth: 400 } );

    // translucent light-gray background, so this shows up on all solution colors
    var background = new Rectangle( 0, 0, 1.2 * label.width, 1.2 * label.height, 8, 8,
      { fill: 'rgba( 240, 240, 240, 0.6 )' } );

    // rendering order
    this.addChild( background );
    this.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution is saturated
    solution.saturatedProperty.link( function( saturated ) {
      self.setVisible( saturated );
    } );
  }

  beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );

  return inherit( Node, SaturatedIndicator );
} );