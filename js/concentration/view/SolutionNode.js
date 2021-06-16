// Copyright 2013-2021, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';
import Beaker from '../model/Beaker.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';

// constants
const MIN_NONZERO_HEIGHT = 5; // minimum height for a solution with non-zero volume, set by visual inspection

class SolutionNode extends Rectangle {

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( solution, beaker, modelViewTransform ) {
    assert && assert( solution instanceof ConcentrationSolution );
    assert && assert( beaker instanceof Beaker );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    super( 0, 0, 1, 1, { lineWidth: 1 } );

    // @private
    this.solution = solution;
    this.beaker = beaker;

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution volume.
     * @param {number} volume
     */
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
}

beersLawLab.register( 'SolutionNode', SolutionNode );
export default SolutionNode;