// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const merge = require( 'PHET_CORE/merge' );

  // constants
  const SCALE = 0.75;

  class BLLFaucetNode extends FaucetNode {

    /**
     * @param {Faucet} faucet
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( faucet, modelViewTransform, tandem, options ) {

      const horizontalPipeLength = modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) / SCALE;

      options = merge( {
        horizontalPipeLength: horizontalPipeLength,
        scale: SCALE,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        },
        tandem: tandem
      }, options );

      super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );

      this.translation = modelViewTransform.modelToViewPosition( faucet.position );
    }
  }

  return beersLawLab.register( 'BLLFaucetNode', BLLFaucetNode );
} );