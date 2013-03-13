// Copyright 2002-2013, University of Colorado

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "PHETCOMMON/math/Range",
    "PHETCOMMON/util/Inheritance",
    "KITE/Shape",
    "SCENERY/nodes/Path",
    "common/util/LinearFunction"
  ],
  function ( Range, Inheritance, Shape, Path, LinearFunction ) {
    "use strict";

    var MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

    /**
     * @param {ConcentrationSolution} solution
     * @param {Beaker} beaker
     * @param {ModelViewTransform2D} mvt
     * @constructor
     */
    function SolutionNode( solution, beaker, mvt ) {

      Path.call( this, {
        lineWidth: 1
      } );

      var solutionNode = this;

      this.solution = solution;
      this.beaker = beaker;

      // same location as the beaker
      this.x = beaker.location.x;
      this.y = beaker.location.y;

      /*
       * Updates the color of the solution, accounting for saturation.
       * @param {Color} color
       */
      solution.colorProperty.addObserver( function ( color ) {
        var solutionColor = solution.colorProperty.get();
        solutionNode.fill = solutionColor.toCSS();
        solutionNode.stroke = solutionColor.darker(); //TODO too dark
      } );

      /*
       * Updates the amount of stuff in the beaker, based on solution volume.
       * @param {Number} volume
       */
      var volumeToHeightFunction = new LinearFunction( new Range( 0, beaker.volume ), new Range( 0, beaker.size.height ) );
      solution.volumeProperty.addObserver( function ( volume ) {

        // determine dimensions in model coordinates
        var volume = solution.volumeProperty.get();
        var solutionHeight = volumeToHeightFunction.evaluate( volume );
        if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
          // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
          solutionHeight = MIN_NONZERO_HEIGHT;
        }

        // convert to view coordinates and create shape
        var viewWidth = mvt.modelToView( beaker.size.width );
        var viewHeight = mvt.modelToView( solutionHeight );
        solutionNode.setShape( Shape.rect( -viewWidth / 2, -viewHeight, viewWidth, viewHeight ) );
      } );
    }

    Inheritance.inheritPrototype( SolutionNode, Path );

    return SolutionNode;

  } );