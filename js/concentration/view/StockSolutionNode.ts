// Copyright 2013-2023, University of Colorado Boulder

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';
import Beaker from '../model/Beaker.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';

export default class StockSolutionNode extends Rectangle {

  public constructor( solvent: Solvent, soluteProperty: Property<Solute>, dropper: Dropper, beaker: Beaker,
                      tipWidth: number, modelViewTransform: ModelViewTransform2 ) {

    super( 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and position
    const updateShapeAndPosition = () => {

      // path
      if ( dropper.isDispensingProperty.value && !dropper.isEmptyProperty.value ) {
        this.setRect( -tipWidth / 2, 0, tipWidth, beaker.position.y - dropper.position.y );
      }
      else {
        this.setRect( 0, 0, 0, 0 );
      }

      // move this node to the dropper's position
      this.translation = modelViewTransform.modelToViewPosition( dropper.position );
    };
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'StockSolutionNode', StockSolutionNode );