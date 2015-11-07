// Copyright 2013-2015, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SolutionNode( solution, beaker, modelViewTransform ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, 1, 1, { lineWidth: 1 } );

    // @private
    thisNode.solution = solution;
    thisNode.beaker = beaker;

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.colorProperty.link( function( color ) {
      thisNode.fill = color;
      thisNode.stroke = color.darkerColor();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution volume.
     * @param {number} volume
     */
    var viewLocation = modelViewTransform.modelToViewPosition( beaker.location );
    var viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.volumeProperty.link( function( volume ) {

      // determine dimensions in model coordinates
      var solutionHeight = Util.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height
      if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
        // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
        solutionHeight = MIN_NONZERO_HEIGHT;
      }

      // convert to view coordinates and create shape
      var viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );
      thisNode.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y - viewHeight, viewWidth, viewHeight );
    } );
  }

  return inherit( Rectangle, SolutionNode );
} );