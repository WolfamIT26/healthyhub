import type { EntityManager } from 'typeorm';

import { InventoryItemEntity } from '../../data/inventory/entities';
import { ProductEntity } from '../../data/product/entities';

const products = [
  ['Sữa yến mạch nguyên bản', 'oat-milk-original', 69000],
  ['Sữa hạnh nhân không đường', 'almond-milk-unsweetened', 79000],
  ['Sữa hạt điều cacao', 'cashew-cocoa-milk', 75000],
  ['Sữa chua kiểu Hy Lạp nguyên vị', 'greek-yogurt-plain', 42000],
  ['Sữa chua dừa vị xoài', 'coconut-yogurt-mango', 39000],
  ['Kombucha gừng và chanh', 'kombucha-ginger', 45000],
  ['Cold brew nước dừa', 'cold-brew-coconut', 49000],
  ['Nước chanh hạt chia', 'chia-lemon-drink', 35000],
  ['Granola hạt và quả mọng', 'berry-granola', 119000],
  ['Granola cacao ít đường', 'cocoa-granola', 109000],
  ['Yến mạch ngâm táo quế', 'overnight-oats-apple', 62000],
  ['Hạt dinh dưỡng phối trộn', 'mixed-nuts', 89000],
  ['Snack rong biển giòn', 'seaweed-chips', 32000],
  ['Bánh giòn đậu gà', 'chickpea-bites', 48000],
  ['Salad quinoa rau củ', 'quinoa-salad', 85000],
  ['Bowl gà và ngũ cốc nguyên hạt', 'chicken-grain-bowl', 99000],
  ['Bowl đậu hũ và mì soba', 'tofu-soba-bowl', 89000],
  ['Thanh protein bơ đậu phộng', 'protein-bar-peanut', 45000],
  ['Bánh quy protein đậu nành', 'soy-protein-cookie', 52000],
  ['Chia pudding vị xoài', 'chia-pudding-mango', 55000],
  ['Bánh giòn dừa không đường', 'coconut-crackers', 59000],
  ['Cốc yến mạch hữu cơ', 'organic-oat-cup', 58000],
  ['Bowl protein thực vật', 'vegan-protein-bowl', 105000],
  ['Sữa chua hạt nguyên vị', 'plain-nut-yogurt', 44000],
] as const;

const lowStockIds = new Set([2, 8, 11, 16, 21]);
const outOfStockIds = new Set([5, 14]);

export async function seedCartCommerceDevelopment(manager: EntityManager): Promise<void> {
  const productRepository = manager.getRepository(ProductEntity);
  const inventoryRepository = manager.getRepository(InventoryItemEntity);
  await productRepository.upsert(products.map(([productName, slug, price], index) => {
    const id = index + 1;
    const unavailable = outOfStockIds.has(id);
    return {
      id: String(id), tenantId: '1', brandId: null, productCode: `HH-${String(id).padStart(4, '0')}`,
      productName, slug, basePrice: `${price}.00`, sellableStatus: unavailable ? 'out_of_stock' as const : 'sellable' as const,
      productVisibility: 'public' as const, productStatus: 'active' as const,
    };
  }), ['id']);
  await inventoryRepository.upsert(products.map((_product, index) => {
    const productId = index + 1;
    const outOfStock = outOfStockIds.has(productId);
    const lowStock = lowStockIds.has(productId);
    return {
      tenantId: '1', productId: String(productId), availableQuantity: outOfStock ? 0 : lowStock ? 3 : 25,
      reservedQuantity: 0, stockThreshold: 3,
      stockStatus: outOfStock ? 'out_of_stock' as const : lowStock ? 'low_stock' as const : 'available' as const,
    };
  }), ['tenantId', 'productId']);
}
