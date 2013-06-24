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
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  // constants
  var FONT = new BLLFont( 20 );

  /**
   * @param {Property<BeersLawSolution>} solution
   * @constructor
   */
  function ConcentrationControl( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, BLLStrings.concentration ), { font: FONT } );
    var slider = new ConcentrationSlider( solution );
    var valueDisplay = new Text( "400 XXX", { font: FONT } ); //TODO too many assumptions here, and doesn't work for i18n
    var xMargin = 0.1 * valueDisplay.width;
    var yMargin = 0.1 * valueDisplay.height;
    var valueBackground = new Rectangle( 0, 0, valueDisplay.width + xMargin + xMargin, valueDisplay.height + yMargin + yMargin,
      { fill: "white", stroke: "lightGray" } );

    // rendering order
    thisNode.addChild( label );
    thisNode.addChild( slider );
    thisNode.addChild( valueBackground );
    thisNode.addChild( valueDisplay );

    // layout
    valueBackground.left = label.right + 3;
    valueDisplay.right = valueBackground.right - xMargin; // right aligned
    valueDisplay.y = label.y; // align baselines
    valueBackground.centerY = valueDisplay.centerY;
    slider.left = valueDisplay.right + 20;
    slider.centerY = valueDisplay.centerY;

    // update the value display when concentration changes
    var concentrationObserver = function() {
      valueDisplay.text = thisNode.formatConcentration( solution.get().getViewValue(), solution.get().getViewUnits() );
      valueDisplay.right = valueBackground.right - xMargin; // right aligned
    };
    solution.get().concentration.link( concentrationObserver );

    // when solution changes, rewire the concentration observer
    solution.link( function( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.concentration.unlink( concentrationObserver );
      }
      newSolution.concentration.link( concentrationObserver );
    } );
  }

  inherit( Node, ConcentrationControl, {
    formatConcentration: function( concentration, units ) {
      return StringUtils.format( BLLStrings.pattern_0value_1units, concentration.toFixed( 0 ), units );
    }
  } );

  return ConcentrationControl;
} );