// Copyright 2002-2013, University of Colorado

/**
 * Control for changing solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLStrings = require( "common/BLLStrings" );
  var ConcentrationSlider = require( "beerslaw/view/ConcentrationSlider" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  // constants
  var FONT = new BLLFont( 20 );
  var DECIMAL_PLACES = 0;

  /**
   * @param {Property<BeersLawSolution>} solution
   * @constructor
   */
  function ConcentrationControl( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.concentration] ), { font: FONT } );
    var slider = new ConcentrationSlider( solution );
    var valueDisplay = new Text( "400 XXX", { font: FONT } );

    // rendering order
    thisNode.addChild( label );
    thisNode.addChild( slider );
    thisNode.addChild( valueDisplay );

    // layout
    valueDisplay.left = label.right + 3;
    valueDisplay.y = label.y; // align baselines
    valueDisplay.centerY = label.centerY;
    slider.left = valueDisplay.right + 20;
    slider.centerY = valueDisplay.centerY;

    // update the value display when concentration changes
    var concentrationObserver = function() {
      var valueString = solution.get().getViewValue().toFixed( DECIMAL_PLACES );
      var units = solution.get().getViewUnits();
      valueDisplay.text = StringUtils.format( BLLStrings.pattern_0value_1units, [ valueString, units ] );
      valueDisplay.right = slider.left - 20;
    };
    solution.get().concentration.addObserver( concentrationObserver );

    // when solution changes, rewire the concentration observer
    solution.addObserver( function( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.concentration.removeObserver( concentrationObserver );
      }
      newSolution.concentration.addObserver( concentrationObserver );
    } );
  }

  inherit( ConcentrationControl, Node );

  return ConcentrationControl;
} );