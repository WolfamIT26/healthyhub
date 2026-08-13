import { useId } from 'react';

import { Button, Checkbox, FormField, Input, Select } from '../../components';
import { productBrands, productCategories } from './catalog.data';
import {
  dietaryTagLabels,
  stockStatusLabels,
  type CatalogQuery,
  type DietaryTag,
} from './product.types';

const dietaryOptions = Object.entries(dietaryTagLabels) as Array<[DietaryTag, string]>;

export function ProductFilters({
  query,
  onChange,
  onClear,
  onApply,
}: {
  query: CatalogQuery;
  onChange(patch: Partial<CatalogQuery>): void;
  onClear(): void;
  onApply?: () => void;
}) {
  const fieldId = useId();
  function toggleDietary(tag: DietaryTag, checked: boolean) {
    onChange({
      dietary: checked ? [...query.dietary, tag] : query.dietary.filter((item) => item !== tag),
    });
  }

  return (
    <div className="space-y-6">
      <FormField id={`${fieldId}-category`} label="Danh mục">
        <Select
          id={`${fieldId}-category`}
          value={query.category}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          <option value="">Tất cả danh mục</option>
          {productCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField id={`${fieldId}-brand`} label="Thương hiệu">
        <Select
          id={`${fieldId}-brand`}
          value={query.brand}
          onChange={(event) => onChange({ brand: event.target.value })}
        >
          <option value="">Tất cả thương hiệu</option>
          {productBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </FormField>
      <fieldset>
        <legend className="text-sm font-semibold text-neutral-800">Khoảng giá</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            aria-label="Giá tối thiểu"
            inputMode="numeric"
            min="0"
            step="1000"
            type="number"
            placeholder="Từ"
            value={query.minPrice ?? ''}
            onChange={(event) =>
              onChange({
                minPrice:
                  event.target.value === '' ? undefined : Math.max(0, Number(event.target.value)),
              })
            }
          />
          <Input
            aria-label="Giá tối đa"
            inputMode="numeric"
            min="0"
            step="1000"
            type="number"
            placeholder="Đến"
            value={query.maxPrice ?? ''}
            onChange={(event) =>
              onChange({
                maxPrice:
                  event.target.value === '' ? undefined : Math.max(0, Number(event.target.value)),
              })
            }
          />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-neutral-800">Chế độ ăn</legend>
        <div className="mt-2 grid grid-cols-1">
          {dietaryOptions.map(([value, label]) => (
            <Checkbox
              key={value}
              label={label}
              checked={query.dietary.includes(value)}
              onChange={(event) => toggleDietary(value, event.target.checked)}
            />
          ))}
        </div>
      </fieldset>
      <FormField id={`${fieldId}-availability`} label="Tình trạng hàng">
        <Select
          id={`${fieldId}-availability`}
          value={query.availability}
          onChange={(event) =>
            onChange({ availability: event.target.value as CatalogQuery['availability'] })
          }
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(stockStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
        {onApply ? (
          <Button type="button" className="flex-1" onClick={onApply}>
            Áp dụng bộ lọc
          </Button>
        ) : null}
        <Button type="button" variant="outline" className="flex-1" onClick={onClear}>
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}
