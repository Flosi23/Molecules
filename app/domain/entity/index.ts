import { AtomId, type AtomQtyMap, MoleculeId } from "~/domain/value";

export class Atom {
  readonly id: AtomId;
  readonly name: string;
  readonly mass: number;

  private constructor(id: AtomId, name: string, mass: number) {
    this.id = id;
    this.name = name;
    this.mass = mass;
  }

  static create(name: string, mass: number): Atom {
    return new Atom(AtomId.new(), name, mass);
  }
}

export class Molecule {
  readonly id: MoleculeId;
  readonly name?: string;
  readonly atoms: Atom[];
  readonly atomQtyMap: AtomQtyMap;

  private constructor(id: MoleculeId, atomQtyMap: AtomQtyMap, atoms: Atom[]) {
    this.id = id;
    this.atomQtyMap = atomQtyMap;
    this.atoms = atoms;
  }

  static fromAtomQtyMap(atomQtyMap: AtomQtyMap, atoms: Atom[]): Molecule {
    const isAtomsComplete = Object.entries(atomQtyMap)
      .map(([id]) => id)
      .every((id) => atoms.find((a) => a.id === id));

    if (!isAtomsComplete) {
      throw new Error("atoms array does not contain all atom ids referenced in atomQtyMap");
    }

    const isAtomQtyMapComplete = atoms
      .map((atom) => atom.id)
      .every((id) => Object.keys(atomQtyMap).includes(id));

    if (!isAtomQtyMapComplete) {
      throw new Error("atomQtyMap does not contain all atom ids from atoms array");
    }

    return new Molecule(MoleculeId.new(), atomQtyMap, atoms);
  }

  getAtomNameQtyPairs(): [string, number][] {
    return this.atoms.map((atom) => [atom.name, this.atomQtyMap[atom.id] ?? 0]);
  }

  getMass(): number {
    return this.atoms.reduce((acc, atom) => acc + atom.mass * (this.atomQtyMap[atom.id] ?? 0), 0);
  }
}
