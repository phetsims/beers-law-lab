// Copyright 2013-2022, University of Colorado Boulder

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Path } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import Beam from '../model/Beam.js';

export default class BeamNode extends Path {

  public constructor( beam: Beam ) {

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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'BeamNode', BeamNode );