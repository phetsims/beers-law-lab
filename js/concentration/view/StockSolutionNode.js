// Copyright 2013-2020, University of Colorado Boulder

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class StockSolutionNode extends Rectangle {
    /**
     * @param {Solvent} solvent
     * @param {Property.<Solute>} soluteProperty
     * @param {Dropper} dropper
     * @param {Beaker} beaker
     * @param {number} tipWidth
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( solvent, soluteProperty, dropper, beaker, tipWidth, modelViewTransform ) {

      super( 0, 0, 0, 0, { lineWidth: 1 } );

      // shape and position
      const updateShapeAndPosition = () => {
        // path
        if ( dropper.dispensingProperty.get() && !dropper.emptyProperty.get() ) {
          this.setRect( -tipWidth / 2, 0, tipWidth, beaker.position.y - dropper.positionProperty.get().y );
        }
        else {
          this.setRect( 0, 0, 0, 0 );
        }
        // move this node to the dropper's position
        this.translation = modelViewTransform.modelToViewPosition( dropper.positionProperty.get() );
      };
      dropper.positionProperty.link( updateShapeAndPosition );
      dropper.dispensingProperty.link( updateShapeAndPosition );
      dropper.emptyProperty.link( updateShapeAndPosition );

      // set color to match solute
      soluteProperty.link( solute => {
        const color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
        this.fill = color;
        this.stroke = color.darkerColor();
      } );

      // hide this node when the dropper is invisible
      dropper.visibleProperty.link( visible => {
        this.setVisible( visible );
      } );
    }
  }

  return beersLawLab.register( 'StockSolutionNode', StockSolutionNode );
} );