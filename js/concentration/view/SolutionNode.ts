// Copyright 2013-2022, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import Beaker from '../model/Beaker.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import BLLConstants from '../../common/BLLConstants.js';

// constants
const MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

export default class SolutionNode extends Rectangle {

  public constructor( solution: ConcentrationSolution, beaker: Beaker, modelViewTransform: ModelViewTransform2 ) {

    super( 0, 0, 1, 1, {
      lineWidth: BLLConstants.SOLUTION_LINE_WIDTH
    } );

    // Update the color of the solution, accounting for saturation.
    solution.colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    // Updates the amount of stuff in the beaker, based on solution volume.
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.volumeProperty.link( volume => {

      // determine dimensions in model coordinates
      let solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height
      if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
        // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
        solutionHeight = MIN_NONZERO_HEIGHT;
      }

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );
      this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'SolutionNode', SolutionNode );