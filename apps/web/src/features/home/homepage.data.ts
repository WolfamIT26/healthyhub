import aiMascot from '../../../../../assets/logos/AI Mascot.png';
import heroIllustration from '../../../../../assets/banners/Hero Illustration.png';

export interface HomepageCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface HomepageProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  visual: string;
}

export interface HomepageAiFeature {
  id: string;
  name: string;
  description: string;
}

export interface HomepageArticle {
  id: string;
  title: string;
  summary: string;
  tag: string;
}

// Presentation data for Homepage V1. Replace this source with public catalog APIs later.
export const homepageAssets = { heroIllustration, aiMascot };

export const homepageCategories: HomepageCategory[] = [
  { id: 'healthy-drinks', name: 'Đồ uống lành mạnh', description: 'Tươi mát cho nhịp sống mỗi ngày', icon: '🥤' },
  { id: 'whole-grains', name: 'Ngũ cốc', description: 'Bữa sáng gọn nhẹ, dễ lựa chọn', icon: '🌾' },
  { id: 'plant-milk', name: 'Sữa hạt', description: 'Nhiều hương vị từ thực vật', icon: '🥛' },
  { id: 'healthy-snacks', name: 'Snack healthy', description: 'Ăn nhẹ tiện lợi, thông tin rõ ràng', icon: '🥜' },
  { id: 'nutrition', name: 'Dinh dưỡng bổ sung', description: 'Chọn theo nhu cầu và hướng dẫn sử dụng', icon: '🍃' },
  { id: 'ready-meals', name: 'Bữa ăn tiện lợi', description: 'Nhanh gọn cho ngày bận rộn', icon: '🥗' },
];

export const featuredProducts: HomepageProduct[] = [
  { id: 'oat-milk', name: 'Sữa yến mạch nguyên bản', category: 'Sữa hạt', price: '69.000 ₫', badge: 'Nổi bật', visual: '🥛' },
  { id: 'granola', name: 'Granola hạt và trái cây', category: 'Ngũ cốc', price: '119.000 ₫', originalPrice: '139.000 ₫', badge: 'Ưu đãi', visual: '🥣' },
  { id: 'mixed-nuts', name: 'Hạt dinh dưỡng phối trộn', category: 'Snack healthy', price: '89.000 ₫', badge: 'Được yêu thích', visual: '🥜' },
  { id: 'chia-pudding', name: 'Chia pudding vị xoài', category: 'Bữa ăn tiện lợi', price: '55.000 ₫', visual: '🥭' },
];

export const aiFeatures: HomepageAiFeature[] = [
  { id: 'profile-advisor', name: 'AI Profile Advisor', description: 'Gợi ý cách bắt đầu dựa trên nhu cầu bạn chia sẻ.' },
  { id: 'product-finder', name: 'AI Product Finder', description: 'Hỗ trợ thu hẹp lựa chọn từ thông tin sản phẩm.' },
  { id: 'chatbot', name: 'AI Chatbot', description: 'Giải đáp câu hỏi trong phạm vi dữ liệu đã duyệt.' },
  { id: 'compare', name: 'AI Compare', description: 'Đặt thông tin sản phẩm cạnh nhau để dễ cân nhắc.' },
  { id: 'meal-planner', name: 'AI Meal Planner', description: 'Phác thảo bữa ăn ở mức tham khảo, không thay thế chuyên gia.' },
  { id: 'calories', name: 'AI Calories Calculator', description: 'Ước lượng năng lượng và luôn nêu rõ giới hạn.' },
];

export const homepageArticles: HomepageArticle[] = [
  { id: 'read-labels', tag: 'Kiến thức', title: 'Đọc nhãn sản phẩm: bắt đầu từ đâu?', summary: 'Những nhóm thông tin cơ bản giúp bạn so sánh sản phẩm minh bạch hơn.' },
  { id: 'smart-snacks', tag: 'Lối sống', title: 'Chuẩn bị món ăn nhẹ cho ngày bận rộn', summary: 'Một vài nguyên tắc đơn giản để lựa chọn thuận tiện và phù hợp nhịp sống.' },
  { id: 'plant-drinks', tag: 'Khám phá', title: 'Làm quen với các loại đồ uống từ hạt', summary: 'Khám phá hương vị, thành phần và lưu ý sử dụng trên từng sản phẩm.' },
];
