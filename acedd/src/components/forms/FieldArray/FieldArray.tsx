/**
 * FieldArray - Reusable Dynamic Field Array Component
 * 
 * Sprint 16 - Block C: Dinamik Form Engine (Public)
 * 
 * A reusable component for managing dynamic field arrays in forms using React Hook Form.
 * This component handles add/remove operations and error display for array items.
 * 
 * @example
 * ```tsx
 * <FieldArray
 *   name="relatives"
 *   control={control}
 *   addLabel="Akraba Ekle"
 *   removeLabel="Kaldır"
 *   minItems={1}
 *   renderItem={(field, index, errors) => (
 *     <div>
 *       <Input {...register(`relatives.${index}.name`)} />
 *       {errors?.name && <span>{errors.name.message}</span>}
 *     </div>
 *   )}
 * />
 * ```
 */

"use client";

import React from "react";
import { useFieldArray, Control, FieldErrors, FieldPath, FieldValues, ArrayPath } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface FieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
> {
  /**
   * Field name path (e.g., "relatives", "educationHistory")
   */
  name: TFieldArrayName;
  
  /**
   * React Hook Form control instance
   */
  control: Control<TFieldValues>;
  
  /**
   * Render function for each field item
   * @param field - Field array field object from useFieldArray
   * @param index - Current item index
   * @param errors - Field errors for this index (errors[name]?.[index])
   * @returns React node to render for this item
   */
  renderItem: (
    field: { id: string },
    index: number,
    errors: any
  ) => React.ReactNode;
  
  /**
   * Label for the "Add" button
   * @default "Ekle"
   */
  addLabel?: string;
  
  /**
   * Label for the "Remove" button
   * @default "Kaldır"
   */
  removeLabel?: string;
  
  /**
   * Default value for new items when added
   */
  defaultValue?: any;
  
  /**
   * Minimum number of items required (prevents deletion below this count)
   * @default 1
   */
  minItems?: number;
  
  /**
   * Maximum number of items allowed
   */
  maxItems?: number;
  
  /**
   * Custom title renderer for each item card
   * @param index - Current item index
   * @returns Title string or React node
   */
  itemTitle?: (index: number) => string | React.ReactNode;
  
  /**
   * Whether to wrap each item in a Card component
   * @default true
   */
  wrapInCard?: boolean;
  
  /**
   * Custom className for the container
   */
  className?: string;
  
  /**
   * Form errors object
   */
  errors?: FieldErrors<TFieldValues>;
}

export function FieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
>({
  name,
  control,
  renderItem,
  addLabel = "Ekle",
  removeLabel = "Kaldır",
  defaultValue,
  minItems = 1,
  maxItems,
  itemTitle,
  wrapInCard = true,
  className,
  errors,
}: FieldArrayProps<TFieldValues, TFieldArrayName>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any, // Type assertion needed due to RHF type limitations
  });

  const fieldErrors = errors?.[name] as any[] | undefined;

  const handleAdd = () => {
    if (maxItems && fields.length >= maxItems) {
      return;
    }
    
    if (defaultValue !== undefined) {
      append(defaultValue as any);
    } else {
      append({} as any);
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length > minItems) {
      remove(index);
    }
  };

  const canRemove = fields.length > minItems;
  const canAdd = maxItems === undefined || fields.length < maxItems;

  return (
    <div className={className}>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const itemErrors = fieldErrors?.[index];
          const title = itemTitle ? itemTitle(index) : `Öğe ${index + 1}`;
          
          const content = (
            <div key={field.id} className="space-y-4">
              {(wrapInCard || canRemove || title) && (
                <div className="flex justify-between items-center">
                  {title && (
                    <div className="text-md font-semibold text-gray-900">
                      {typeof title === "string" ? title : title}
                    </div>
                  )}
                  {canRemove && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={removeLabel}
                    >
                      <Trash2 className="w-4 h-4" />
                      {removeLabel && <span className="ml-2">{removeLabel}</span>}
                    </Button>
                  )}
                </div>
              )}
              
              <div>
                {renderItem(field, index, itemErrors)}
              </div>
            </div>
          );

          if (wrapInCard) {
            return (
              <Card key={field.id} className="p-6">
                {content}
              </Card>
            );
          }

          return content;
        })}
      </div>

      {canAdd && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="mt-4 w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addLabel}
        </Button>
      )}

      {maxItems && fields.length >= maxItems && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Maksimum {maxItems} öğe eklenebilir.
        </p>
      )}
    </div>
  );
}

