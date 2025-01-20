import type { Atom } from "~/domain/entity";
import type { AtomQtyMap } from "~/domain/value";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zfd } from "zod-form-data";
import { Separator } from "~/components/ui/separator";

interface GenerateFormProps {
  selectedAtoms: Atom[];
  onSubmit: (
    atoms: Atom[],
    minAtomQtyMap: AtomQtyMap,
    maxAtomQtyMap: AtomQtyMap,
    targetMass: number,
    maxDeviation: number,
  ) => void;
}

export default function GenerateForm({ selectedAtoms, onSubmit }: GenerateFormProps) {
  const formSchema = z.object({
    targetMass: zfd.numeric(z.number().min(0)),
    maxDeviation: zfd.numeric(z.number().min(0)),
    minAtomQtyMap: z.record(zfd.numeric(z.number().min(0).optional()).optional()),
    maxAtomQtyMap: z.record(zfd.numeric(z.number().min(0).optional()).optional()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function submit(values: z.infer<typeof formSchema>) {
    onSubmit(
      selectedAtoms,
      values.minAtomQtyMap as AtomQtyMap,
      values.maxAtomQtyMap as AtomQtyMap,
      values.targetMass,
      values.maxDeviation,
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="grid grid-cols-2 gap-x-4">
            <FormField
              control={form.control}
              name="targetMass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Mass</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDeviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Deviation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The maximum allowed deviation of molecule mass from the target mass
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-10" />

          {selectedAtoms.length > 0 && (
            <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-4 gap-y-2">
              <div />
              <div>
                <FormLabel className="text-base">Min. Qty</FormLabel>
                <FormDescription className="-mt-1">
                  Minimum quantity of the atom in the molecule
                </FormDescription>
              </div>
              <div>
                <FormLabel className="text-base">Max. Qty</FormLabel>
                <FormDescription className="-mt-1">
                  Maximum quantity of the atom in the molecule
                </FormDescription>
              </div>
              {selectedAtoms.map((atom) => (
                <React.Fragment key={atom.id}>
                  <h3 className="text-lg font-bold">{atom.name}</h3>
                  <FormField
                    control={form.control}
                    name={`minAtomQtyMap.${atom.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`maxAtomQtyMap.${atom.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </React.Fragment>
              ))}
            </div>
          )}

          {selectedAtoms.length === 0 && (
            <p className="text-base text-muted-foreground">
              Add some atoms by selecting them to start generating!
            </p>
          )}

          <Button className="mt-10 w-full" disabled={selectedAtoms.length === 0}>
            Generate
          </Button>
        </form>
      </Form>
    </div>
  );
}
