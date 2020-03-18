# Beer's Law Lab - implementation notes

This implementation was ported from the Java version of this sim. These notes are adapted from
the Java version, with changes to reflect differences in the HTML5 version.

Source code directory structure is as follows:
* stuff under the "common" subpackage is used by >1 screen
* stuff under the "concentration" subpackage is used only by the "Concentration" screen
* stuff under the "beerslaw" subpackage is used only by the "Beer's Law" screen
* each of the above directories is further divided into model and view packages

In the "Concentration" screen, spatial units (distance, size, location) have no relevance to the model.
For consistency with the other screen, we use an identity model-view transform.

In the "Beer's Law" screen, spatial units *are* relevant, and are in centimeters. In this screen we do have
a model-view transform, defined in BeersLawModel. The transform performs scaling only. The orientation
of the axes is the same in model and view coordinate frames; positive x is to the right, positive y is down.

The "Concentration" and "Beer's Law" screens have very different requirements and models. So you'll notice
that there are 2 different solution models with very little overlap. The solution types are named
ConcentrationSolution and BeersLawSolution to make it clear which screens they belong to.