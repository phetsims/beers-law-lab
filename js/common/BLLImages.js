// Copyright 2002-2013, University of Colorado Boulder

/**
 * Images loader for this simulation.
 * <p>
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather having to
 * pass as a parameter everywhere or resort to using a global.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  "use strict";
  return {
    imageNames: [
      "at-detector-body-center.png",
      "at-detector-body-left.png",
      "at-detector-body-right.png",
      "at-detector-probe.png",
      "Beers-Law-icon.jpg",
      "Concentration-icon.jpg",
      "concentration-meter-body-center.png",
      "concentration-meter-body-left.png",
      "concentration-meter-body-right.png",
      "concentration-meter-probe.png",
      "dropper-icon.png",
      "dropper_background.png",
      "dropper_foreground.png",
      "faucet_flange.png",
      "faucet_flange_disabled.png",
      "faucet_knob.png",
      "faucet_knob_disabled.png",
      "faucet_pipe.png",
      "faucet_shaft.png",
      "faucet_spout.png",
      "faucet_stop.png",
      "light.png",
      "red_button_disabled.png",
      "red_button_pressed.png",
      "red_button_unpressed.png",
      "shaker.png",
      "shaker-icon.png"
    ]
  };
} );