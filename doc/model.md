# Beer's Law Lab - model description

## Concentration screen

Quantities and units:

* amountOfSolute - moles
* amountOfPrecipitate - moles
* concentration - M or mol/L
* gramsOfSolute - g
* gramsOfSolvent - g
* percentConcentration - %
* saturatedConcentration - M or mol/L
* soluteMolarMass - g/mol
* solventDensity - g/L
* stockSolutionConcentration - M or mol/L
* stockSolutionPercentConcentration - %
* volumeOfSolution - L

Concentration of a solution (M) is:

&nbsp;&nbsp;&nbsp;&nbsp;concentration = min( stockSolutionConcentration, ( amountOfSolute / volumeOfSolution ) )

When a solution is saturated, the amount of precipitate is:

&nbsp;&nbsp;&nbsp;&nbsp;amountOfPrecipitate = ( amountOfSolute / volumeOfSolution ) - saturatedConcentration

The number of precipitate particles shown in the beaker is:

&nbsp;&nbsp;&nbsp;&nbsp;numberOfParticles = amountOfPrecipitate * particlesPerMole

where particlesPerMole is specified for each solute.

Grams of solute is:

&nbsp;&nbsp;&nbsp;&nbsp;gramsOfSolute = soluteMolarMass * ( amountOfSolute - amountOfPrecipitate )

Grams of solvent is:

&nbsp;&nbsp;&nbsp;&nbsp;gramsOfSolvent = volumeOfSolution * solventDensity;

Percent Concentration of a solution is:

&nbsp;&nbsp;&nbsp;&nbsp;percentConcentration = 100 * gramsOfSolute / ( gramsOfSolute + gramsOfSolvent )

Percent Concentration of a stock solution is:

&nbsp;&nbsp;&nbsp;&nbsp;stockSolutionPercentConcentration = 100 * ( soluteMolarMass * stockSolutionConcentration ) / ( solventDensity + ( soluteMolarMass * stockSolutionConcentration ) )

The solvent is pure water. Solvent can be added to the solution using the faucet in
the upper-left corner of the play area.  Solvent can be removed from the solution using
the Evaporation control.

Solute can be added via either the shaker or dropper. The dropper contains a stock solution,
so it adds both solute and solvent. You can measure the concentration of the stock using
the Concentration meter.  Pressing the "Remove Solute" button removes all solute from
the solution.

The faucet in the lower-right corner of the play area is a drain to remove solution
(solvent and solute together). This decreases volume with no change to solution concentration.

Displaced volume due to dissolved solutes is ignored in the simulation; it is a small value,
but would be non-negligible if we chose to model it. We removed the effect of volume on dissolved
solutes for the following reasons:
(a) the effect is relatively small, since solute particles have a small mass
(b) implementation difficulty in terms of both math and software design
Regarding this latter point, it reduces to a pair of coupled equations:
molesDissolved = f(volume) and volume = f(molesDissolved)

For additional details, consult the source files in js/concentration/model/.

## Beer's Law screen

Molar absorptivity (a) is in units of 1/(cm*M), and varies with solution and wavelength.
For the solutions in this sim, we measured molar absorptivity for visible wavelengths in the laboratory.
That data is used in the sim, and can be found in Java class MolarAbsorptivityData and
file beers-law-lab/doc/wavelength-to-molarAbsorptivity.csv

Path length (b) is the amount of solution that the beam passes through, in units of cm.
It depends on the width of the cuvette and the position of the detector probe.

Concentration (C) is in units of M, and is the concentration of the solution in the cuvette.

Absorbance model: A = abC

Transmittance model: T = 10^-A

Transmittance varies between 0 (fully absorbed) and 1 (fully transmitted.)
Multiplying by 100 gives percent transmittance (%T).

For additional details, consult the source files in js/beerslaw/model/.
