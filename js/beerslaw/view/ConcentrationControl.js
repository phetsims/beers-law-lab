// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control for changing solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ConcentrationSlider = require( 'BEERS_LAW_LAB/beerslaw/view/ConcentrationSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/concentration' );
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );

  // constants
  var FONT = new PhetFont( 20 );

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationControl( solutionProperty, tandem ) {

    Node.call( this );

    // nodes
    var label = new Text( StringUtils.format( pattern0LabelString, concentrationString ), { font: FONT } );
    var slider = new ConcentrationSlider( solutionProperty, tandem.createTandem( 'slider' ) );
    var valueDisplay = new Text( ' ' + solutionProperty.get().getDisplayConcentration( solutionProperty.get().concentrationRange.max ), { font: FONT } );
    var xMargin = 0.1 * valueDisplay.width;
    var yMargin = 0.1 * valueDisplay.height;
    var valueBackground = new Rectangle( 0, 0, valueDisplay.width + xMargin + xMargin, valueDisplay.height + yMargin + yMargin,
      { fill: 'white', stroke: 'lightGray' } );

    // rendering order
    this.addChild( label );
    this.addChild( slider );
    this.addChild( valueBackground );
    this.addChild( valueDisplay );

    // layout
    valueBackground.left = label.right + 6;
    valueDisplay.right = valueBackground.right - xMargin; // right aligned
    valueDisplay.y = label.y; // align baselines
    valueBackground.centerY = valueDisplay.centerY;
    slider.left = valueDisplay.right + 20;
    slider.centerY = valueDisplay.centerY;

    // update the value display when concentration changes
    var concentrationObserver = function( concentration ) {
      valueDisplay.text = solutionProperty.get().getDisplayConcentration( concentration );
      valueDisplay.right = valueBackground.right - xMargin; // right aligned
    };
    solutionProperty.get().concentrationProperty.link( concentrationObserver );

    // when solution changes, rewire the concentration observer
    solutionProperty.link( function( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.concentrationProperty.unlink( concentrationObserver );
      }
      newSolution.concentrationProperty.link( concentrationObserver );
    } );
  }

  beersLawLab.register( 'ConcentrationControl', ConcentrationControl );

  return inherit( Node, ConcentrationControl );
} );