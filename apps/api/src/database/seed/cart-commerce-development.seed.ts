import type { EntityManager } from 'typeorm';

import { BrandEntity } from '../../data/brand/entities';
import {
  CategoryDisplayRuleEntity,
  CategoryEntity,
  ProductCategoryLinkEntity,
} from '../../data/category/entities';
import { InventoryItemEntity } from '../../data/inventory/entities';
import {
  ProductContentEntity,
  ProductDietaryTagEntity,
  ProductEntity,
  ProductIngredientEntity,
  ProductNutritionFactEntity,
  type ProductDietaryTag,
} from '../../data/product/entities';

const categories = [
  ['plant-milk', 'Sữa hạt'],
  ['yogurt', 'Sữa chua'],
  ['healthy-drinks', 'Đồ uống healthy'],
  ['whole-grains', 'Granola & ngũ cốc'],
  ['healthy-snacks', 'Snack healthy'],
  ['ready-meals', 'Salad & bữa ăn'],
  ['high-protein', 'Thực phẩm giàu protein'],
  ['low-sugar', 'Thực phẩm ít đường'],
] as const;
const brands = [
  ['healthyhub-select', 'HealthyHub Select'],
  ['moc-nhien', 'Mộc Nhiên'],
  ['green-farm', 'Green Farm'],
  ['nutri-day', 'NutriDay'],
] as const;
type ProductSeed = readonly [
  name: string,
  slug: string,
  price: number,
  category: string,
  brand: string,
  summary: string,
  tags: ProductDietaryTag[],
  featured: boolean,
];
const products: ProductSeed[] = [
  [
    'Sữa yến mạch nguyên bản',
    'oat-milk-original',
    69000,
    'plant-milk',
    'healthyhub-select',
    'Vị thanh nhẹ, thông tin thành phần rõ ràng.',
    ['vegan', 'lactose-free'],
    true,
  ],
  [
    'Sữa hạnh nhân không đường',
    'almond-milk-unsweetened',
    79000,
    'plant-milk',
    'moc-nhien',
    'Lựa chọn từ hạnh nhân, không bổ sung đường.',
    ['sugar-free', 'vegan', 'lactose-free'],
    true,
  ],
  [
    'Sữa hạt điều cacao',
    'cashew-cocoa-milk',
    75000,
    'plant-milk',
    'green-farm',
    'Hương cacao kết hợp nền sữa hạt điều.',
    ['vegetarian', 'lactose-free'],
    false,
  ],
  [
    'Sữa chua kiểu Hy Lạp nguyên vị',
    'greek-yogurt-plain',
    42000,
    'yogurt',
    'nutri-day',
    'Kết cấu sánh, phù hợp bữa phụ tiện lợi.',
    ['high-protein', 'low-sugar', 'gluten-free'],
    true,
  ],
  [
    'Sữa chua dừa vị xoài',
    'coconut-yogurt-mango',
    39000,
    'yogurt',
    'moc-nhien',
    'Nền dừa kết hợp vị xoài dịu nhẹ.',
    ['vegan', 'lactose-free'],
    false,
  ],
  [
    'Kombucha gừng và chanh',
    'kombucha-ginger',
    45000,
    'healthy-drinks',
    'green-farm',
    'Đồ uống lên men với gừng và chanh.',
    ['vegan', 'organic'],
    true,
  ],
  [
    'Cold brew nước dừa',
    'cold-brew-coconut',
    49000,
    'healthy-drinks',
    'healthyhub-select',
    'Cà phê ủ lạnh kết hợp nước dừa.',
    ['vegan', 'gluten-free'],
    false,
  ],
  [
    'Nước chanh hạt chia',
    'chia-lemon-drink',
    35000,
    'healthy-drinks',
    'moc-nhien',
    'Thức uống tiện lợi với hạt chia.',
    ['vegetarian', 'low-sugar'],
    false,
  ],
  [
    'Granola hạt và quả mọng',
    'berry-granola',
    119000,
    'whole-grains',
    'healthyhub-select',
    'Yến mạch, các loại hạt và quả mọng sấy.',
    ['vegetarian', 'high-protein'],
    true,
  ],
  [
    'Granola cacao ít đường',
    'cocoa-granola',
    109000,
    'whole-grains',
    'nutri-day',
    'Granola cacao có vị ngọt vừa phải.',
    ['low-sugar', 'vegetarian'],
    false,
  ],
  [
    'Yến mạch ngâm táo quế',
    'overnight-oats-apple',
    62000,
    'whole-grains',
    'green-farm',
    'Bữa sáng yến mạch gọn nhẹ với táo quế.',
    ['vegetarian', 'high-protein'],
    false,
  ],
  [
    'Hạt dinh dưỡng phối trộn',
    'mixed-nuts',
    89000,
    'healthy-snacks',
    'healthyhub-select',
    'Hỗn hợp hạt rang không tẩm vị đậm.',
    ['vegan', 'gluten-free'],
    true,
  ],
  [
    'Snack rong biển giòn',
    'seaweed-chips',
    32000,
    'healthy-snacks',
    'moc-nhien',
    'Rong biển giòn dùng cho bữa phụ.',
    ['vegan', 'gluten-free'],
    false,
  ],
  [
    'Bánh giòn đậu gà',
    'chickpea-bites',
    48000,
    'healthy-snacks',
    'nutri-day',
    'Bánh giòn từ đậu gà, đóng gói tiện lợi.',
    ['vegan', 'high-protein'],
    false,
  ],
  [
    'Salad quinoa rau củ',
    'quinoa-salad',
    85000,
    'ready-meals',
    'green-farm',
    'Quinoa và rau củ theo khẩu phần tiện lợi.',
    ['vegan', 'gluten-free'],
    true,
  ],
  [
    'Bowl gà và ngũ cốc nguyên hạt',
    'chicken-grain-bowl',
    99000,
    'ready-meals',
    'healthyhub-select',
    'Bữa ăn gồm gà, rau và ngũ cốc.',
    ['high-protein'],
    true,
  ],
  [
    'Bowl đậu hũ và mì soba',
    'tofu-soba-bowl',
    89000,
    'ready-meals',
    'moc-nhien',
    'Đậu hũ, rau củ và mì soba.',
    ['vegetarian', 'high-protein'],
    false,
  ],
  [
    'Thanh protein bơ đậu phộng',
    'protein-bar-peanut',
    45000,
    'high-protein',
    'nutri-day',
    'Thanh ăn nhẹ giàu protein vị bơ đậu phộng.',
    ['high-protein', 'low-sugar'],
    true,
  ],
  [
    'Bánh quy protein đậu nành',
    'soy-protein-cookie',
    52000,
    'high-protein',
    'green-farm',
    'Bánh quy dùng đậu nành làm nguồn protein.',
    ['high-protein', 'vegetarian'],
    false,
  ],
  [
    'Chia pudding vị xoài',
    'chia-pudding-mango',
    55000,
    'low-sugar',
    'healthyhub-select',
    'Pudding hạt chia với xoài theo khẩu phần.',
    ['low-sugar', 'vegetarian', 'gluten-free'],
    true,
  ],
  [
    'Bánh giòn dừa không đường',
    'coconut-crackers',
    59000,
    'low-sugar',
    'moc-nhien',
    'Bánh giòn vị dừa không bổ sung đường.',
    ['sugar-free', 'vegan'],
    false,
  ],
  [
    'Cốc yến mạch hữu cơ',
    'organic-oat-cup',
    58000,
    'whole-grains',
    'green-farm',
    'Yến mạch dạng cốc, thuận tiện chuẩn bị.',
    ['organic', 'vegan'],
    false,
  ],
  [
    'Bowl protein thực vật',
    'vegan-protein-bowl',
    105000,
    'high-protein',
    'healthyhub-select',
    'Đậu, quinoa và rau củ trong một khẩu phần.',
    ['vegan', 'high-protein', 'gluten-free'],
    true,
  ],
  [
    'Sữa chua hạt nguyên vị',
    'plain-nut-yogurt',
    44000,
    'yogurt',
    'moc-nhien',
    'Sữa chua nền hạt với vị nguyên bản.',
    ['vegan', 'lactose-free', 'low-sugar'],
    false,
  ],
];

const lowStockIds = new Set([2, 8, 11, 16, 21]);
const outOfStockIds = new Set([5, 14]);

export async function seedCartCommerceDevelopment(manager: EntityManager): Promise<void> {
  const brandRepository = manager.getRepository(BrandEntity);
  const categoryRepository = manager.getRepository(CategoryEntity);
  const productRepository = manager.getRepository(ProductEntity);
  const inventoryRepository = manager.getRepository(InventoryItemEntity);
  await brandRepository.upsert(
    brands.map(([brandSlug, brandName], index) => ({
      id: String(index + 1),
      tenantId: '1',
      brandSlug,
      brandName,
      brandOrigin: null,
      brandStatus: 'active' as const,
      description: null,
    })),
    ['id'],
  );
  await categoryRepository.upsert(
    categories.map(([slug, categoryName], index) => ({
      id: String(index + 1),
      tenantId: '1',
      slug,
      categoryName,
      description: null,
      parentCategoryId: null,
      categoryStatus: 'active' as const,
      categoryVisibility: 'public' as const,
    })),
    ['id'],
  );
  await manager.getRepository(CategoryDisplayRuleEntity).upsert(
    categories.map((_category, index) => ({
      tenantId: '1',
      categoryId: String(index + 1),
      displayChannel: 'web' as const,
      displayOrder: index + 1,
      ruleStatus: 'active' as const,
      effectiveFrom: new Date('2026-08-13T00:00:00.000Z'),
      effectiveTo: null,
    })),
    ['tenantId', 'categoryId', 'displayChannel'],
  );
  await productRepository.upsert(
    products.map(
      ([productName, slug, price, _category, brand, _summary, _tags, featured], index) => {
        const id = index + 1;
        const unavailable = outOfStockIds.has(id);
        return {
          id: String(id),
          tenantId: '1',
          brandId: String(brands.findIndex(([brandSlug]) => brandSlug === brand) + 1),
          productCode: `HH-${String(id).padStart(4, '0')}`,
          productName,
          slug,
          basePrice: `${price}.00`,
          sellableStatus: unavailable ? ('out_of_stock' as const) : ('sellable' as const),
          productVisibility: 'public' as const,
          productStatus: 'active' as const,
          isFeatured: featured,
        };
      },
    ),
    ['id'],
  );
  await inventoryRepository.upsert(
    products.map((_product, index) => {
      const productId = index + 1;
      const outOfStock = outOfStockIds.has(productId);
      const lowStock = lowStockIds.has(productId);
      return {
        tenantId: '1',
        productId: String(productId),
        availableQuantity: outOfStock ? 0 : lowStock ? 3 : 25,
        reservedQuantity: 0,
        stockThreshold: 3,
        stockStatus: outOfStock
          ? ('out_of_stock' as const)
          : lowStock
            ? ('low_stock' as const)
            : ('available' as const),
      };
    }),
    ['tenantId', 'productId'],
  );

  const categoryLinks = manager.getRepository(ProductCategoryLinkEntity);
  await categoryLinks.upsert(
    products.map(([, , , category], index) => ({
      tenantId: '1',
      productId: String(index + 1),
      categoryId: String(categories.findIndex(([slug]) => slug === category) + 1),
      isPrimary: true,
      linkStatus: 'active' as const,
      linkedAt: new Date('2026-08-13T00:00:00.000Z'),
    })),
    ['tenantId', 'productId', 'categoryId'],
  );
  await manager.getRepository(ProductContentEntity).upsert(
    products.map(([name, , , , , summary], index) => ({
      tenantId: '1',
      productId: String(index + 1),
      description: `${summary} Thông tin được quản lý trong Product catalog authority của HealthyHub.`,
      summary,
      usageNote: null,
      storageNote: 'Bảo quản theo hướng dẫn trên bao bì sản phẩm.',
      seoTitle: name,
      seoDescription: summary,
      contentStatus: 'published' as const,
    })),
    ['tenantId', 'productId', 'contentStatus'],
  );
  await manager.getRepository(ProductDietaryTagEntity).upsert(
    products.flatMap(([, , , , , , tags], index) =>
      tags.map((dietaryTag) => ({ tenantId: '1', productId: String(index + 1), dietaryTag })),
    ),
    ['tenantId', 'productId', 'dietaryTag'],
  );
  await manager.getRepository(ProductIngredientEntity).upsert(
    [
      ['1', 'Nước', null, null, 0],
      ['1', 'Yến mạch', 'Thành phần nền của sản phẩm.', 'Có chứa yến mạch.', 1],
      ['1', 'Dầu thực vật', null, null, 2],
      ['1', 'Muối', null, null, 3],
      ['2', 'Nước', null, null, 0],
      ['2', 'Hạnh nhân', null, 'Có chứa hạnh nhân.', 1],
      ['5', 'Nền dừa', null, null, 0],
      ['5', 'Xoài', null, null, 1],
    ].map(([productId, ingredientName, ingredientDescription, allergyWarning, displayOrder]) => ({
      tenantId: '1',
      productId: String(productId),
      ingredientName: String(ingredientName),
      ingredientDescription: ingredientDescription ? String(ingredientDescription) : null,
      nutritionNote: null,
      allergyWarning: allergyWarning ? String(allergyWarning) : null,
      displayOrder: Number(displayOrder),
    })),
    ['tenantId', 'productId', 'ingredientName'],
  );
  await manager.getRepository(ProductNutritionFactEntity).upsert(
    [
      {
        tenantId: '1',
        productId: '1',
        servingSize: '250 ml',
        calories: '120 kcal',
        protein: '3 g',
        carbohydrates: '18 g',
        fat: '4 g',
        sugar: '6 g',
        note: 'Thông tin theo một khẩu phần; đối chiếu nhãn sản phẩm trước khi sử dụng.',
      },
      {
        tenantId: '1',
        productId: '2',
        servingSize: '250 ml',
        calories: '70 kcal',
        protein: '2 g',
        carbohydrates: '5 g',
        fat: '4 g',
        sugar: '0 g',
        note: null,
      },
    ],
    ['tenantId', 'productId'],
  );
}
