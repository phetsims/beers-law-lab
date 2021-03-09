// Copyright 2013-2020, University of Colorado Boulder

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';

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
      if ( dropper.isDispensingProperty.value && !dropper.isEmptyProperty.value ) {
        this.setRect( -tipWidth / 2, 0, tipWidth, beaker.position.y - dropper.positionProperty.value.y );
      }
      else {
        this.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's position
      this.translation = modelViewTransform.modelToViewPosition( dropper.positionProperty.value );
    };
    dropper.positionProperty.link( updateShapeAndPosition );
    dropper.isDispensingProperty.link( updateShapeAndPosition );
    dropper.isEmptyProperty.link( updateShapeAndPosition );

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

beersLawLab.register( 'StockSolutionNode', StockSolutionNode );
export default StockSolutionNode;