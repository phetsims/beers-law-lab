// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BLLFaucetNode( faucet, modelViewTransform ) {
    var scale = 0.75;
    var horizontalPipeLength = modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRate, faucet.enabled, { horizontalPipeLength: horizontalPipeLength, scale: scale } );
    this.translation = modelViewTransform.modelToViewPosition( faucet.location );
  }

  return inherit( FaucetNode, BLLFaucetNode );
} );