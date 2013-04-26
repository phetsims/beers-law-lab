// Copyright 2002-2013, University of Colorado

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );

  // constants
  var MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolutionNode( solution, beaker, mvt ) {

    var thisNode = this;
    Path.call( thisNode, {
      lineWidth: 1
    } );

    thisNode.solution = solution;
    thisNode.beaker = beaker;

    // same location as the beaker
    thisNode.x = beaker.location.x;
    thisNode.y = beaker.location.y;

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.color.addObserver( function ( color ) {
      thisNode.fill = color.toCSS();
      thisNode.stroke = color.darker().toCSS();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution volume.
     * @param {Number} volume
     */
    var volumeToHeightFunction = new LinearFunction( new Range( 0, beaker.volume ), new Range( 0, beaker.size.height ) );
    solution.volume.addObserver( function ( volume ) {

      // determine dimensions in model coordinates
      var solutionHeight = volumeToHeightFunction.evaluate( volume );
      if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
        // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
        solutionHeight = MIN_NONZERO_HEIGHT;
      }

      // convert to view coordinates and create shape
      var viewWidth = mvt.modelToViewDeltaX( beaker.size.width );
      var viewHeight = mvt.modelToViewDeltaY( solutionHeight );
      thisNode.setShape( Shape.rect( -viewWidth / 2, -viewHeight, viewWidth, viewHeight ) );
    } );
  }

  inherit( SolutionNode, Path );

  return SolutionNode;

} );