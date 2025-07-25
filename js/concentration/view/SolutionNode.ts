// Copyright 2013-2025, University of Colorado Boulder

/**
 * SolutionNode is the solution that appears in the beaker. Its origin is at the bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Beaker from '../model/Beaker.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import { linear } from '../../../../dot/js/util/linear.js';
import BLLColors from '../../common/BLLColors.js';

const MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

export default class SolutionNode extends Rectangle {

  public constructor( solution: ConcentrationSolution, beaker: Beaker, modelViewTransform: ModelViewTransform2 ) {

    super( 0, 0, 1, 1, {
      stroke: BLLColors.solutionStrokeProperty,
      lineWidth: BLLConstants.SOLUTION_LINE_WIDTH,
      isDisposable: false
    } );

    // Update the color of the solution, accounting for saturation.
    solution.colorProperty.link( color => {
      this.fill = color;
    } );

    // Updates the amount of stuff in the beaker, based on solution volume.
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.volumeProperty.link( volume => {

      // determine dimensions in model coordinates
      let solutionHeight = linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height
      if ( volume > 0 && solutionHeight < MIN_NONZERO_HEIGHT ) {
        // constrain non-zero volume to minimum height, so that the solution is visible to the user and detectable by the concentration probe
        solutionHeight = MIN_NONZERO_HEIGHT;
      }

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );
      this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );
  }
}

beersLawLab.register( 'SolutionNode', SolutionNode );