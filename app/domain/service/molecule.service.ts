import { Atom, Molecule } from "~/domain/entity";
import type { AtomQtyMap } from "~/domain/value";
import type { GenerationResult } from "~/domain/aggregate/GenerationResult";

export class MoleculeService {
  /**
   * Generate molecules that have a mass in the range of targetMass ± maxDeviation and
   * do not contain more or less atoms of a certain type than specified in minAtomQtyMap and maxAtomQtyMap.
   */
  static generateMolecules(
    atoms: Atom[],
    minAtomQtyMap: AtomQtyMap,
    maxAtomQtyMap: AtomQtyMap,
    targetMass: number,
    maxDeviation: number,
  ): GenerationResult[] {
    // enrich the minAtomQtyMap so that every atom id is present
    atoms.forEach((atom) => (minAtomQtyMap[atom.id] = minAtomQtyMap[atom.id] ?? 0));
    // enrich the maxAtomQtyMap so that every atom id is present
    atoms.forEach((atom) => (maxAtomQtyMap[atom.id] = maxAtomQtyMap[atom.id] ?? Infinity));

    const results: GenerationResult[] = [];

    // We'll do a recursive backtracking: at each step, pick how many of the current atom to use.
    // Then move on to the next atom, pruning if we exceed the (targetMass + maxDeviation).
    const backtrack = (index: number, currentQtyMap: AtomQtyMap, currentMass: number) => {
      // If we've assigned all atoms, check if final mass is within range:
      if (index === atoms.length) {
        // Check the mass in [targetMass - maxDeviation, targetMass + maxDeviation].
        if (currentMass >= targetMass - maxDeviation && currentMass <= targetMass + maxDeviation) {
          // Build a molecule from currentQtyMap.
          // This may throw if not all atoms are in the map, but we've ensured that each is set.
          const molecule = Molecule.fromAtomQtyMap({ ...currentQtyMap }, atoms);
          results.push({ molecule, deviation: molecule.getMass() - targetMass });
        }
        return;
      }

      // Otherwise, pick a quantity for the next atom within min/max constraints:
      const atom = atoms[index];
      const minQty = minAtomQtyMap[atom.id];
      const maxQty = maxAtomQtyMap[atom.id];
      const atomMass = atom.mass;

      for (let qty = minQty; qty <= maxQty; qty++) {
        const newMass = currentMass + qty * atomMass;

        // If we exceed the upper mass bound, no need to explore further for larger qty.
        if (newMass > targetMass + maxDeviation) {
          break;
        }

        // Assign the chosen quantity, recurse on next atom.
        currentQtyMap[atom.id] = qty;
        backtrack(index + 1, currentQtyMap, newMass);
      }

      // restore the old value before returning
      currentQtyMap[atom.id] = minAtomQtyMap[atom.id];
    };

    backtrack(0, structuredClone(minAtomQtyMap), 0);

    // sort results by deviation
    results.sort((a, b) => Math.abs(a.deviation) - Math.abs(b.deviation));

    return results;
  }
}
