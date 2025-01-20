import { MoleculeService } from "~/domain/service/molecule.service";
import { Atom } from "~/domain/entity";
import React, { useMemo } from "react";
import AtomTable from "~/components/AtomTable";
import type { AtomId, AtomQtyMap } from "~/domain/value";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import AtomDialogContent from "~/components/AtomDialogContent";
import { AtomRepository } from "~/domain/repository/atom";
import GenerateForm from "~/components/GenerateForm";
import type { GenerationResult } from "~/domain/aggregate/GenerationResult";
import { ResultTable } from "~/components/ResultTable";

export default function Page() {
  const [atoms, _setAtoms] = React.useState<Atom[]>(AtomRepository.load());

  const [results, setResults] = React.useState<GenerationResult[]>([]);

  const [selectedAtomIds, setSelectedAtomIds] = React.useState<AtomId[]>([]);

  const [open, setOpen] = React.useState(false);

  const setAtoms = (atoms: Atom[]) => {
    _setAtoms(atoms);
    AtomRepository.save(atoms);
  };

  const onAtomAdd = (atom: Atom) => {
    setAtoms([...atoms, atom]);
    setOpen(false);
  };

  const onAtomDelete = (atomId: AtomId) => {
    setAtoms([...atoms.filter((a) => a.id !== atomId)]);
    // Remove the atom from the selected if it was selected
    setSelectedAtomIds((prev) => prev.filter((id) => id !== atomId));
  };

  const onAtomChange = (atom: Atom) => {
    setAtoms(atoms.map((a) => (a.id === atom.id ? atom : a)));
  };

  const onAtomSelectChange = (atomId: AtomId, value: boolean) => {
    setSelectedAtomIds((prev) => (value ? [...prev, atomId] : prev.filter((id) => id !== atomId)));
  };

  const selectedAtoms = useMemo(
    () => atoms.filter((a) => selectedAtomIds.includes(a.id)),
    [atoms, selectedAtomIds],
  );

  const onGenerate = (
    atoms: Atom[],
    minAtomQtyMap: AtomQtyMap,
    maxAtomQtyMap: AtomQtyMap,
    targetMass: number,
    maxDeviation: number,
  ) => {
    const results = MoleculeService.generateMolecules(
      atoms,
      minAtomQtyMap,
      maxAtomQtyMap,
      targetMass,
      maxDeviation,
    );
    setResults(results);
  };

  return (
    <div className="container mx-auto grid max-w-screen-xl grid-cols-5 gap-x-12 py-12">
      <div className="col-span-3">
        <h3 className="text-3xl font-bold">Generator</h3>
        <p className="text-base text-muted-foreground">
          Generates molecules based on the atoms you provide.{" "}
        </p>
        <div className="mt-10">
          <GenerateForm selectedAtoms={selectedAtoms} onSubmit={onGenerate} />
        </div>
        <h3 className="mb-8 mt-12 text-3xl font-bold">Results</h3>
        <ResultTable results={results} />
      </div>
      <div className="col-span-2 space-y-4">
        <div>
          <h3 className="text-3xl font-bold">Atoms</h3>
          <p className="text-base text-muted-foreground">
            Atoms are the building blocks of your molecules.
          </p>
        </div>
        <AtomTable
          onAtomSelectChange={onAtomSelectChange}
          atoms={atoms}
          onAtomChange={onAtomChange}
          onAtomDelete={onAtomDelete}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Add Atom</Button>
          </DialogTrigger>
          <AtomDialogContent onSubmit={onAtomAdd} />
        </Dialog>
      </div>
    </div>
  );
}
