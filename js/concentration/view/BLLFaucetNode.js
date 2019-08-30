// Copyright 2013-2019, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BLLFaucetNode( faucet, modelViewTransform, tandem, options ) {
    var scale = 0.75;
    var horizontalPipeLength = modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;

    options = _.extend( {
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