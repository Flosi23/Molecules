import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import React from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Atom } from "~/domain/entity";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  mass: zfd.numeric(z.number().min(0)),
});

interface AtomDialogProps {
  existingAtom?: Atom;
  onSubmit: (atom: Atom) => void;
}

export default function AtomDialog({ existingAtom, onSubmit }: AtomDialogProps) {
  const [open, setOpen] = React.useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: existingAtom ?? undefined,
  });

  function submit(values: z.infer<typeof formSchema>) {
    let atom = existingAtom
      ? { ...existingAtom, ...values }
      : Atom.create(values.name, values.mass);
    onSubmit(atom);
    setOpen(false);
  }

  function onOpenChange(open: boolean) {
    form.reset();
    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">{existingAtom ? "Edit" : "Add"} Atom</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Atom</DialogTitle>
          <DialogDescription>Atoms are the building blocks of your molecules.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mass</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {existingAtom ? "Save" : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
