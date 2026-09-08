import type {
  AdminCreateProductRequest,
  AdminProductDetail,
  AdminProductDietaryTag,
  AdminProductMediaRole,
  AdminProductOptionsResult,
  AdminProductStatus,
  AdminProductVisibility,
  AdminUpdateProductRequest,
} from '@healthyhub/shared-types';
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  ErrorState,
  FormField,
  Input,
  Radio,
  Select,
  Skeleton,
  Switch,
  Textarea,
} from '../components';
import { buttonClassName } from '../components/ui/Button';
import { adminApi } from '../features/admin/adminApi';
import { useAuth } from '../features/auth/AuthContext';

const dietaryLabels: Record<AdminProductDietaryTag, string> = {
  'low-sugar': 'Ít đường',
  'sugar-free': 'Không đường',
  'high-protein': 'Giàu protein',
  vegan: 'Thuần chay',
  vegetarian: 'Ăn chay',
  'lactose-free': 'Không lactose',
  'gluten-free': 'Không gluten',
  organic: 'Hữu cơ',
};

interface ProductFormState {
  sku: string;
  name: string;
  slug: string;
  price: string;
  brandId: string;
  categoryIds: string[];
  primaryCategoryId: string;
  featured: boolean;
  content: {
    description: string;
    summary: string;
    usageNote: string;
    storageNote: string;
    seoTitle: string;
    seoDescription: string;
    status: 'draft' | 'review' | 'published';
  };
  nutrition: {
    servingSize: string;
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    sugar: string;
    note: string;
  };
  ingredients: Array<{
    name: string;
    description: string;
    nutritionNote: string;
    allergyWarning: string;
  }>;
  dietaryTags: AdminProductDietaryTag[];
  media: Array<{ mediaAssetId: string; role: AdminProductMediaRole }>;
}

const emptyForm: ProductFormState = {
  sku: '',
  name: '',
  slug: '',
  price: '0.00',
  brandId: '',
  categoryIds: [],
  primaryCategoryId: '',
  featured: false,
  content: {
    description: '',
    summary: '',
    usageNote: '',
    storageNote: '',
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
  },
  nutrition: {
    servingSize: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    sugar: '',
    note: '',
  },
  ingredients: [],
  dietaryTags: [],
  media: [],
};

export function AdminProductFormPage() {
  const { productId } = useParams();
  const createMode = !productId;
  const auth = useAuth();
  const canManage = auth.hasPermission('products:manage');
  const navigate = useNavigate();
  const [options, setOptions] = useState<AdminProductOptionsResult | null>(null);
  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [status, setStatus] = useState<{
    productStatus: AdminProductStatus;
    visibility: AdminProductVisibility;
  }>({ productStatus: 'draft', visibility: 'hidden' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        if (createMode) {
          setOptions(await adminApi.products.options(signal));
          setProduct(null);
          setForm(emptyForm);
        } else {
          const [nextOptions, nextProduct] = await Promise.all([
            adminApi.products.options(signal),
            adminApi.products.detail(productId, signal),
          ]);
          setOptions(nextOptions);
          applyProduct(nextProduct);
        }
        setDirty(false);
      } catch (loadError) {
        if (!signal?.aborted) setError(message(loadError));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [createMode, productId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function applyProduct(nextProduct: AdminProductDetail) {
    setProduct(nextProduct);
    setForm(fromProduct(nextProduct));
    setStatus({
      productStatus: nextProduct.productStatus,
      visibility: nextProduct.visibility,
    });
  }

  function change(update: (current: ProductFormState) => ProductFormState) {
    setForm(update);
    setDirty(true);
    setSuccess(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const validation = validate(form, createMode);
    if (validation) {
      setError(validation);
      return;
    }
    setSaving(true);
    try {
      if (createMode) {
        const result = await adminApi.products.create(toCreateRequest(form));
        setDirty(false);
        navigate(`/admin/products/${result.product.id}`, { replace: true });
      } else if (product) {
        const result = await adminApi.products.update(product.id, {
          ...toAggregateRequest(form),
          version: product.version,
        });
        applyProduct(result.product);
        setDirty(false);
        setSuccess('Đã lưu Product aggregate vào persistence canonical.');
      }
    } catch (saveError) {
      setError(message(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function saveStatus() {
    if (!product) return;
    setStatusSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await adminApi.products.updateStatus(product.id, {
        ...status,
        version: product.version,
      });
      applyProduct(result.product);
      setDirty(false);
      setSuccess('Đã cập nhật lifecycle; Public Catalog sẽ phản ánh trạng thái mới.');
    } catch (statusError) {
      setError(message(statusError));
    } finally {
      setStatusSaving(false);
    }
  }

  async function deleteProduct() {
    if (!product) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.products.delete(product.id, product.version);
      setDirty(false);
      navigate('/admin/products', { replace: true });
    } catch (deleteError) {
      setError(message(deleteError));
      setDeleteOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (!canManage && createMode)
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <ErrorState
          title="Không có quyền tạo sản phẩm"
          description="Phiên hiện tại cần products:manage. Backend vẫn là authority cuối."
          action={
            <Link to="/admin/products" className={buttonClassName({ variant: 'outline' })}>
              Về danh sách
            </Link>
          }
        />
      </main>
    );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/products"
            className="text-sm font-semibold text-primary-700 hover:underline"
          >
            ← Danh sách sản phẩm
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {createMode ? 'Tạo sản phẩm' : product?.name || 'Chi tiết sản phẩm'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            SKU không thể đổi sau khi tạo. Inventory quantity không thuộc form này.
          </p>
        </div>
        {!createMode && product ? (
          <div className="text-right text-xs text-neutral-500">
            <p>Version {product.version}</p>
            <p>Cập nhật {new Date(product.updatedAt).toLocaleString('vi-VN')}</p>
          </div>
        ) : null}
      </div>

      {loading ? (
        <FormSkeleton />
      ) : error && !options ? (
        <div className="mt-6">
          <ErrorState
            title="Không tải được Product form"
            description={error}
            action={<Button onClick={() => void load()}>Thử lại</Button>}
          />
        </div>
      ) : options ? (
        <>
          {error ? (
            <Alert tone="error" title="Không thể hoàn tất thao tác" className="mt-6">
              {error}
            </Alert>
          ) : null}
          {success ? (
            <Alert tone="success" title="Thành công" className="mt-6">
              {success}
            </Alert>
          ) : null}

          <form className="mt-6 space-y-6" onSubmit={submit} noValidate>
            <fieldset disabled={!canManage || saving} className="space-y-6 disabled:opacity-80">
              <Section title="Thông tin cơ bản" description="Identity, giá và Brand canonical.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField id="admin-product-sku" label="SKU" required>
                    <Input
                      id="admin-product-sku"
                      value={form.sku}
                      readOnly={!createMode}
                      maxLength={64}
                      onChange={(event) =>
                        change((current) => ({ ...current, sku: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField id="admin-product-name" label="Tên sản phẩm" required>
                    <Input
                      id="admin-product-name"
                      value={form.name}
                      maxLength={255}
                      onChange={(event) =>
                        change((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField id="admin-product-slug" label="Slug" required>
                    <Input
                      id="admin-product-slug"
                      value={form.slug}
                      maxLength={191}
                      onChange={(event) =>
                        change((current) => ({ ...current, slug: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField
                    id="admin-product-price"
                    label="Giá VND"
                    required
                    helperText="DecimalString, ví dụ 69000.00."
                  >
                    <Input
                      id="admin-product-price"
                      value={form.price}
                      inputMode="decimal"
                      onChange={(event) =>
                        change((current) => ({ ...current, price: event.target.value }))
                      }
                    />
                  </FormField>
                  <FormField id="admin-product-brand" label="Thương hiệu">
                    <Select
                      id="admin-product-brand"
                      value={form.brandId}
                      onChange={(event) =>
                        change((current) => ({ ...current, brandId: event.target.value }))
                      }
                    >
                      <option value="">Không thương hiệu</option>
                      {options.brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <div className="flex items-end pb-1">
                    <Switch
                      label="Sản phẩm nổi bật"
                      checked={form.featured}
                      onChange={(featured) => change((current) => ({ ...current, featured }))}
                    />
                  </div>
                </div>
              </Section>

              <Section
                title="Danh mục"
                description="Chọn ít nhất một Category và đúng một Category chính."
              >
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {options.categories.map((category) => {
                    const selected = form.categoryIds.includes(category.id);
                    return (
                      <div
                        key={category.id}
                        className="rounded-control border border-neutral-200 px-3 py-2"
                      >
                        <Checkbox
                          label={`${category.name}${category.visibility === 'private' ? ' (private)' : ''}`}
                          checked={selected}
                          onChange={(event) =>
                            change((current) =>
                              toggleCategory(current, category.id, event.target.checked),
                            )
                          }
                        />
                        {selected ? (
                          <Radio
                            name="primary-category"
                            label="Danh mục chính"
                            checked={form.primaryCategoryId === category.id}
                            onChange={() =>
                              change((current) => ({ ...current, primaryCategoryId: category.id }))
                            }
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Section>

              <Section title="Nội dung" description="Public Product chỉ dùng content published.">
                <div className="grid gap-4">
                  <FormField id="admin-product-description" label="Mô tả" required>
                    <Textarea
                      id="admin-product-description"
                      value={form.content.description}
                      maxLength={10_000}
                      onChange={(event) => changeContent(change, 'description', event.target.value)}
                    />
                  </FormField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Tóm tắt"
                      field="summary"
                      form={form}
                      change={change}
                      maxLength={500}
                    />
                    <FormField id="admin-product-content-status" label="Trạng thái nội dung">
                      <Select
                        id="admin-product-content-status"
                        value={form.content.status}
                        onChange={(event) =>
                          changeContent(
                            change,
                            'status',
                            event.target.value as ProductFormState['content']['status'],
                          )
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                      </Select>
                    </FormField>
                    <TextInput
                      label="Hướng dẫn sử dụng"
                      field="usageNote"
                      form={form}
                      change={change}
                      maxLength={2000}
                    />
                    <TextInput
                      label="Bảo quản"
                      field="storageNote"
                      form={form}
                      change={change}
                      maxLength={2000}
                    />
                    <TextInput
                      label="SEO title"
                      field="seoTitle"
                      form={form}
                      change={change}
                      maxLength={255}
                    />
                    <TextInput
                      label="SEO description"
                      field="seoDescription"
                      form={form}
                      change={change}
                      maxLength={500}
                    />
                  </div>
                </div>
              </Section>

              <Section
                title="Dinh dưỡng"
                description="Giữ canonical string + unit; không suy diễn bằng AI."
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ['servingSize', 'Khẩu phần'],
                      ['calories', 'Calories'],
                      ['protein', 'Protein'],
                      ['carbohydrates', 'Carbohydrates'],
                      ['fat', 'Chất béo'],
                      ['sugar', 'Đường'],
                      ['note', 'Ghi chú'],
                    ] as const
                  ).map(([field, label]) => (
                    <FormField key={field} id={`nutrition-${field}`} label={label}>
                      <Input
                        id={`nutrition-${field}`}
                        value={form.nutrition[field]}
                        maxLength={field === 'note' ? 500 : 100}
                        onChange={(event) =>
                          change((current) => ({
                            ...current,
                            nutrition: { ...current.nutrition, [field]: event.target.value },
                          }))
                        }
                      />
                    </FormField>
                  ))}
                </div>
              </Section>

              <Section
                title="Thành phần"
                description="Thứ tự hiển thị theo danh sách; tên không trùng."
              >
                <div className="space-y-4">
                  {form.ingredients.map((ingredient, index) => (
                    <div key={index} className="rounded-card border border-neutral-200 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(['name', 'description', 'nutritionNote', 'allergyWarning'] as const).map(
                          (field) => (
                            <FormField
                              key={field}
                              id={`ingredient-${index}-${field}`}
                              label={ingredientLabel(field)}
                              required={field === 'name'}
                            >
                              <Input
                                id={`ingredient-${index}-${field}`}
                                value={ingredient[field]}
                                maxLength={
                                  field === 'name' ? 255 : field === 'allergyWarning' ? 500 : 2000
                                }
                                onChange={(event) =>
                                  change((current) => ({
                                    ...current,
                                    ingredients: current.ingredients.map((item, itemIndex) =>
                                      itemIndex === index
                                        ? { ...item, [field]: event.target.value }
                                        : item,
                                    ),
                                  }))
                                }
                              />
                            </FormField>
                          ),
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        className="mt-3"
                        onClick={() =>
                          change((current) => ({
                            ...current,
                            ingredients: current.ingredients.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          }))
                        }
                      >
                        Xóa thành phần
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      change((current) => ({
                        ...current,
                        ingredients: [
                          ...current.ingredients,
                          { name: '', description: '', nutritionNote: '', allergyWarning: '' },
                        ],
                      }))
                    }
                  >
                    Thêm thành phần
                  </Button>
                </div>
              </Section>

              <Section
                title="Dietary tags"
                description="Chỉ dùng whitelist canonical, không tự suy diễn."
              >
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {options.dietaryTags.map((tag) => (
                    <Checkbox
                      key={tag}
                      label={dietaryLabels[tag]}
                      checked={form.dietaryTags.includes(tag)}
                      onChange={(event) =>
                        change((current) => ({
                          ...current,
                          dietaryTags: event.target.checked
                            ? [...current.dietaryTags, tag]
                            : current.dietaryTags.filter((item) => item !== tag),
                        }))
                      }
                    />
                  ))}
                </div>
              </Section>

              <Section
                title="Media hiện có"
                description="Chỉ link Media Asset active; không upload hoặc nhận URL tùy ý."
              >
                {options.media.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {options.media.map((asset) => {
                      const relation = form.media.find((item) => item.mediaAssetId === asset.id);
                      return (
                        <div
                          key={asset.id}
                          className="rounded-control border border-neutral-200 p-3"
                        >
                          <Checkbox
                            label={`${asset.name} (${asset.visibility})`}
                            checked={Boolean(relation)}
                            onChange={(event) =>
                              change((current) => ({
                                ...current,
                                media: event.target.checked
                                  ? [...current.media, { mediaAssetId: asset.id, role: 'gallery' }]
                                  : current.media.filter((item) => item.mediaAssetId !== asset.id),
                              }))
                            }
                          />
                          {relation ? (
                            <Select
                              aria-label={`Vai trò ${asset.name}`}
                              value={relation.role}
                              onChange={(event) =>
                                change((current) => ({
                                  ...current,
                                  media: current.media.map((item) =>
                                    item.mediaAssetId === asset.id
                                      ? {
                                          ...item,
                                          role: event.target.value as AdminProductMediaRole,
                                        }
                                      : item,
                                  ),
                                }))
                              }
                            >
                              <option value="main">Ảnh chính</option>
                              <option value="gallery">Gallery</option>
                              <option value="nutrition">Dinh dưỡng</option>
                            </Select>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">
                    Chưa có Media Asset active phù hợp. Upload infrastructure nằm ngoài Prompt 35.
                  </p>
                )}
              </Section>

              <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-card border border-neutral-200 bg-white/95 p-4 shadow-medium backdrop-blur">
                <Button type="submit" loading={saving} loadingLabel="Đang lưu…">
                  {createMode ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
                </Button>
                <Link to="/admin/products" className={buttonClassName({ variant: 'ghost' })}>
                  Hủy
                </Link>
                {dirty ? (
                  <span className="text-sm text-warning-dark">Có thay đổi chưa lưu</span>
                ) : null}
              </div>
            </fieldset>
          </form>

          {!createMode && product ? (
            <Card className="mt-6">
              <h2 className="text-lg font-bold">Publication và lifecycle</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Public không đồng nghĩa còn hàng; Inventory vẫn quyết định availability.
              </p>
              <fieldset
                disabled={!canManage || statusSaving}
                className="mt-4 grid gap-4 sm:grid-cols-2"
              >
                <FormField id="product-lifecycle-status" label="Product status">
                  <Select
                    id="product-lifecycle-status"
                    value={status.productStatus}
                    onChange={(event) =>
                      setStatus((current) => ({
                        ...current,
                        productStatus: event.target.value as AdminProductStatus,
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="discontinued">Discontinued</option>
                  </Select>
                </FormField>
                <FormField id="product-lifecycle-visibility" label="Visibility">
                  <Select
                    id="product-lifecycle-visibility"
                    value={status.visibility}
                    onChange={(event) =>
                      setStatus((current) => ({
                        ...current,
                        visibility: event.target.value as AdminProductVisibility,
                      }))
                    }
                  >
                    <option value="hidden">Hidden</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </Select>
                </FormField>
              </fieldset>
              <div className="mt-4 flex flex-wrap gap-3">
                {canManage ? (
                  <Button loading={statusSaving} onClick={() => void saveStatus()}>
                    Cập nhật lifecycle
                  </Button>
                ) : null}
                {canManage ? (
                  <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                    Xóa mềm sản phẩm
                  </Button>
                ) : null}
              </div>
            </Card>
          ) : null}
        </>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => void deleteProduct()}
        title="Xóa mềm sản phẩm"
        description="Product sẽ biến mất khỏi Public Catalog và commerce validation. Inventory, Order và Review history được giữ nguyên."
        confirmLabel="Xóa sản phẩm"
        pending={saving}
        danger
      />
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function TextInput({
  label,
  field,
  form,
  change,
  maxLength,
}: {
  label: string;
  field: 'summary' | 'usageNote' | 'storageNote' | 'seoTitle' | 'seoDescription';
  form: ProductFormState;
  change(update: (current: ProductFormState) => ProductFormState): void;
  maxLength: number;
}) {
  const id = `admin-product-${field}`;
  return (
    <FormField id={id} label={label}>
      <Input
        id={id}
        value={form.content[field]}
        maxLength={maxLength}
        onChange={(event) => changeContent(change, field, event.target.value)}
      />
    </FormField>
  );
}

function changeContent<K extends keyof ProductFormState['content']>(
  change: (update: (current: ProductFormState) => ProductFormState) => void,
  field: K,
  value: ProductFormState['content'][K],
) {
  change((current) => ({ ...current, content: { ...current.content, [field]: value } }));
}

function toggleCategory(current: ProductFormState, categoryId: string, checked: boolean) {
  const categoryIds = checked
    ? [...current.categoryIds, categoryId]
    : current.categoryIds.filter((item) => item !== categoryId);
  return {
    ...current,
    categoryIds,
    primaryCategoryId: checked
      ? current.primaryCategoryId || categoryId
      : current.primaryCategoryId === categoryId
        ? (categoryIds[0] ?? '')
        : current.primaryCategoryId,
  };
}

function fromProduct(product: AdminProductDetail): ProductFormState {
  return {
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    price: product.price,
    brandId: product.brand?.id ?? '',
    categoryIds: product.categories.map((category) => category.id),
    primaryCategoryId: product.primaryCategory?.id ?? '',
    featured: product.featured,
    content: {
      description: product.content.description,
      summary: product.content.summary ?? '',
      usageNote: product.content.usageNote ?? '',
      storageNote: product.content.storageNote ?? '',
      seoTitle: product.content.seoTitle ?? '',
      seoDescription: product.content.seoDescription ?? '',
      status: product.content.status,
    },
    nutrition: {
      servingSize: product.nutrition?.servingSize ?? '',
      calories: product.nutrition?.calories ?? '',
      protein: product.nutrition?.protein ?? '',
      carbohydrates: product.nutrition?.carbohydrates ?? '',
      fat: product.nutrition?.fat ?? '',
      sugar: product.nutrition?.sugar ?? '',
      note: product.nutrition?.note ?? '',
    },
    ingredients: product.ingredients.map((item) => ({
      name: item.name,
      description: item.description ?? '',
      nutritionNote: item.nutritionNote ?? '',
      allergyWarning: item.allergyWarning ?? '',
    })),
    dietaryTags: [...product.dietaryTags],
    media: product.media.map((item) => ({ mediaAssetId: item.mediaAssetId, role: item.role })),
  };
}

function toAggregateRequest(form: ProductFormState): Omit<AdminUpdateProductRequest, 'version'> {
  const nutritionValues = Object.values(form.nutrition);
  return {
    name: form.name.trim(),
    slug: form.slug.trim().toLowerCase(),
    price: form.price,
    brandId: form.brandId || null,
    categoryIds: form.categoryIds,
    primaryCategoryId: form.primaryCategoryId,
    featured: form.featured,
    content: {
      description: form.content.description.trim(),
      summary: nullable(form.content.summary),
      usageNote: nullable(form.content.usageNote),
      storageNote: nullable(form.content.storageNote),
      seoTitle: nullable(form.content.seoTitle),
      seoDescription: nullable(form.content.seoDescription),
      status: form.content.status,
    },
    nutrition: nutritionValues.some((value) => value.trim())
      ? {
          servingSize: nullable(form.nutrition.servingSize),
          calories: nullable(form.nutrition.calories),
          protein: nullable(form.nutrition.protein),
          carbohydrates: nullable(form.nutrition.carbohydrates),
          fat: nullable(form.nutrition.fat),
          sugar: nullable(form.nutrition.sugar),
          note: nullable(form.nutrition.note),
        }
      : null,
    ingredients: form.ingredients.map((item) => ({
      name: item.name.trim(),
      description: nullable(item.description),
      nutritionNote: nullable(item.nutritionNote),
      allergyWarning: nullable(item.allergyWarning),
    })),
    dietaryTags: form.dietaryTags,
    media: form.media,
  };
}

function toCreateRequest(form: ProductFormState): AdminCreateProductRequest {
  return { ...toAggregateRequest(form), sku: form.sku.trim().toUpperCase() };
}

function validate(form: ProductFormState, createMode: boolean) {
  if (createMode && !/^[A-Za-z0-9][A-Za-z0-9._-]{1,63}$/.test(form.sku.trim()))
    return 'SKU không hợp lệ.';
  if (!form.name.trim()) return 'Vui lòng nhập tên sản phẩm.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) return 'Slug không hợp lệ.';
  if (!/^(?:0|[1-9]\d{0,9})\.\d{2}$/.test(form.price))
    return 'Giá phải là DecimalString có hai chữ số thập phân.';
  if (!form.categoryIds.length || !form.categoryIds.includes(form.primaryCategoryId))
    return 'Vui lòng chọn danh mục và danh mục chính.';
  if (form.content.description.trim().length < 3) return 'Mô tả cần ít nhất 3 ký tự.';
  const names = form.ingredients.map((item) => item.name.trim().toLocaleLowerCase('vi-VN'));
  if (names.some((name) => !name)) return 'Tên thành phần không được để trống.';
  if (new Set(names).size !== names.length) return 'Tên thành phần không được trùng.';
  return null;
}

function nullable(value: string) {
  return value.trim() || null;
}

function ingredientLabel(field: 'name' | 'description' | 'nutritionNote' | 'allergyWarning') {
  return {
    name: 'Tên thành phần',
    description: 'Mô tả',
    nutritionNote: 'Ghi chú dinh dưỡng',
    allergyWarning: 'Cảnh báo dị ứng',
  }[field];
}

function FormSkeleton() {
  return (
    <div className="mt-6 space-y-5" role="status" aria-label="Đang tải Product form">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-48" />
      ))}
    </div>
  );
}

function message(error: unknown) {
  return error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
    ? error.message
    : 'Không thể kết nối máy chủ.';
}
