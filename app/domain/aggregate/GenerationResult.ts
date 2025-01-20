import type { Molecule } from "~/domain/entity";

export interface GenerationResult {
  readonly molecule: Molecule;
  readonly deviation: number;
}
