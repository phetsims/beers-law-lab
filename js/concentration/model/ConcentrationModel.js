// Copyright 2013, University of Colorado

/**
 * Model container for the "Concentration" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    'PHETCOMMON/math/Dimension2D',
    'PHETCOMMON/math/Point2D',
    'PHETCOMMON/model/property/Property',
    'common/model/Rectangle',
    'concentration/model/Beaker',
    'concentration/model/Shaker',
    'concentration/model/Faucet',
    'concentration/model/DrinkMix'
  ],
  function ( Dimension2D, Point2D, Property, Rectangle, Beaker, Shaker, Faucet, DrinkMix ) {

    function ConcentrationModel() {

      // constants
      var SHAKER_MAX_DISPENSING_RATE = 0.2; // mol/sec
      var MAX_INPUT_FLOW_RATE = 0.25; // L/sec
      var MAX_OUTPUT_FLOW_RATE = MAX_INPUT_FLOW_RATE; // L/sec

      // model elements
      this.soluteProperty = new Property( new DrinkMix() );
      this.beaker = new Beaker( new Point2D( 400, 550 ), new Dimension2D( 600, 300 ), 1 );
      this.shaker = new Shaker( new Point2D( 340, 170 ), new Rectangle( 225, 50, 400, 160 ), 0.75 * Math.PI, this.soluteProperty, SHAKER_MAX_DISPENSING_RATE );
      this.solventFaucet = new Faucet( new Point2D( 150, 190 ), 1000, MAX_INPUT_FLOW_RATE );
      this.drainFaucet = new Faucet( new Point2D( 825, 618 ), 20, MAX_OUTPUT_FLOW_RATE );
    }

    // Resets all model elements
    ConcentrationModel.prototype.reset = function () {
      this.soluteProperty.reset();
      this.beaker.reset();
      this.shaker.reset();
      this.solventFaucet.reset();
      this.drainFaucet.reset();
    };

    // Animates the model, called by Easel.Ticker
    ConcentrationModel.prototype.tick = function () {
      this.shaker.tick();
    };

    return ConcentrationModel;
  } );
