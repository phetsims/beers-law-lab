// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BLLFaucetNode( faucet, mvt ) {
    var scale = 0.75;
    var horizontalPipeLength = mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRate, faucet.enabled, { horizontalPipeLength: horizontalPipeLength, scale: scale } );
    this.translation = mvt.modelToViewPosition( faucet.location );
  }

  return inherit( FaucetNode, BLLFaucetNode );
} );