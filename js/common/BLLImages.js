// Copyright 2002-2013, University of Colorado

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
      <!-- TODO delete all but one set of faucet images -->
      "faucet1_lever.png",
      "faucet1_pipe.png",
      "faucet1_pivot.png",
      "faucet1_spout.png",
      "faucet2_pipe.png",
      "faucet2_shooter.png",
      "faucet2_spout.png",
      "faucet3_pipe.png",
      "faucet3_spout.png",
      "faucet4_pipe.png",
      "faucet4_spout.png",
      "light.png",
      "momentary_button_pressed.png",
      "momentary_button_pressed_disabled.png",
      "momentary_button_unpressed.png",
      "momentary_button_unpressed_disabled.png",
      "shaker.png",
      "shaker-icon.png"
    ]
  };
} );