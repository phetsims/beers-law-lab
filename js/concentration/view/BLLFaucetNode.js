// Copyright 2013-2019, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BLLFaucetNode( faucet, modelViewTransform, tandem, options ) {
    const scale = 0.75;
    const horizontalPipeLength = modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;

    options = merge( {
      horizontalPipeLength: horizontalPipeLength,
      scale: scale,
      tandem: tandem,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    }, options );

    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );
    this.translation = modelViewTransform.modelToViewPosition( faucet.location );
  }

  beersLawLab.register( 'BLLFaucetNode', BLLFaucetNode );

  return inherit( FaucetNode, BLLFaucetNode );
} );