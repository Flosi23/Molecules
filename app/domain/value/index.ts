import { v4 as uuidv4 } from "uuid";

export type AtomId = string;
export const AtomId = {
  new: () => uuidv4(),
};

export type MoleculeId = string;
export const MoleculeId = {
  new: () => uuidv4(),
};

export type AtomQtyMap = Record<AtomId, number>;
