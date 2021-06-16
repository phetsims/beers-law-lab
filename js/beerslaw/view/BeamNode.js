// Copyright 2013-2021, University of Colorado Boulder

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Path from '../../../../scenery/js/nodes/Path.js';
import beersLawLab from '../../beersLawLab.js';
import Beam from '../model/Beam.js';

class BeamNode extends Path {

  /**
   * @param {Beam} beam
   */
  constructor( beam ) {
    assert && assert( beam instanceof Beam );

    super( null, {
      visibleProperty: beam.visibleProperty,
      stroke: 'rgba( 192, 192, 192, 0.8 )',
      lineWidth: 0.5,
      pickable: false
    } );

    // shape
    beam.shapeProperty.link( shape => this.setShape( shape ) );

    // fill
    beam.fillProperty.link( fill => {
      this.fill = fill;
    } );
  }
}

beersLawLab.register( 'BeamNode', BeamNode );
export default BeamNode;