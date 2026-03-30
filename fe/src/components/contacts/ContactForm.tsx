import { Controller, useForm } from "react-hook-form";
import {
  Contact,
  CreateContactBodySchema,
  CreateContactBodyType,
} from "@/lib/validations/contacts.scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ContactFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateContactBodyType) => void;
  isPending?: boolean;
  defaultValues?: Partial<Contact>;
}

function ContactForm({ onSubmit, isPending, defaultValues }: ContactFormProps) {
  const form = useForm<CreateContactBodyType>({
    resolver: zodResolver(CreateContactBodySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      company: defaultValues?.company ?? "",
      position: defaultValues?.position ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      company: defaultValues?.company ?? "",
      position: defaultValues?.position ?? "",
    });
  }, [defaultValues]);

  return (
    <form id="form-rhf-contact" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-contact-name">
                Tên liên hệ
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-contact-name"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập tên liên hệ"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-contact-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-rhf-contact-email"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập email"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-contact-phone">
                Số điện thoại
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-contact-phone"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập số điện thoại"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-contact-company">
                Công ty
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-contact-company"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập tên công ty"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="position"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-contact-position">
                Vị trí
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-contact-position"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập vị trí công việc"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal" className="pt-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="form-rhf-contact" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Lưu"}
        </Button>
      </Field>
    </form>
  );
}

export default ContactForm;
