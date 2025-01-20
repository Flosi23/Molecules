import type { ColumnDef } from "@tanstack/react-table";
import type { GenerationResult } from "~/domain/aggregate/GenerationResult";
import type { Molecule } from "~/domain/entity";
import { DataTable } from "~/components/ui/data-table";

const columns: ColumnDef<GenerationResult>[] = [
  {
    id: "molecule",
    header: "Molecule",
    cell: ({ row }) => {
      const molecule: Molecule = row.original.molecule;

      return (
        <div className="flex flex-row items-center gap-x-2">
          {molecule.getAtomNameQtyPairs().map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}</span>: {value}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "deviation",
    header: "Deviation",
    cell: ({ row }) => {
      const deviation = row.original.deviation;
      // to fixed 4 decimal places
      return <div className="font-medium">{deviation.toFixed(2)}</div>;
    },
  },
  {
    id: "mass",
    header: "Mass",
    cell: ({ row }) => {
      const mass = row.original.molecule.getMass();
      // to fixed 4 decimal places
      return <div className="font-medium">{mass.toFixed(2)}</div>;
    },
  },
];

interface ResultTableProps {
  results: GenerationResult[];
}

export function ResultTable({ results }: ResultTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={results} />
    </div>
  );
}
