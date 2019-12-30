// Copyright 2013-2019, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Utils = require( 'DOT/Utils' );

  // constants
  const MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SolutionNode( solution, beaker, modelViewTransform ) {

    const self = this;

    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    // @private
    this.solution = solution;
    this.beaker = beaker;

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.colorProperty.link( function( color ) {
      self.fill = color;
      self.stroke = color.darkerColor();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution volume.
     * @param {number} volume
     */
    const viewLocation = modelViewTransform.modelToViewPosition( beaker.location );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.volumeProperty.link( function( volume ) {

      // determine dimensions in model coordinates
      let solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height
      if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
        // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
        solutionHeight = MIN_NONZERO_HEIGHT;
      }

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );
      self.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y - viewHeight, viewWidth, viewHeight );
    } );
  }

  beersLawLab.register( 'SolutionNode', SolutionNode );

  return inherit( Rectangle, SolutionNode );
} );