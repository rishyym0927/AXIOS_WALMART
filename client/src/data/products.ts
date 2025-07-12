import { Product } from '../types';

export const mockProducts: Product[] = [
  // Electronics
  { id: 'p1', name: 'DSLR Camera', category: 'electronics', width: 15, height: 12, depth: 10, color: '#2563eb', price: 899 },
  { id: 'p2', name: 'Laptop', category: 'electronics', width: 35, height: 25, depth: 3, color: '#1f2937', price: 1299 },
  { id: 'p3', name: 'Smartphone', category: 'electronics', width: 8, height: 16, depth: 1, color: '#374151', price: 699 },
  { id: 'p4', name: 'Tablet', category: 'electronics', width: 25, height: 18, depth: 1, color: '#6b7280', price: 499 },
  { id: 'p5', name: 'Headphones', category: 'electronics', width: 20, height: 15, depth: 8, color: '#111827', price: 199 },
  { id: 'p6', name: 'Smart Watch', category: 'electronics', width: 12, height: 8, depth: 3, color: '#4f46e5', price: 299 },
  { id: 'p33', name: 'Gaming Console', category: 'electronics', width: 40, height: 10, depth: 30, color: '#1e293b', price: 499 },
  { id: 'p34', name: 'Smart TV 55"', category: 'electronics', width: 120, height: 70, depth: 8, color: '#0f172a', price: 799 },
  { id: 'p35', name: 'Bluetooth Speaker', category: 'electronics', width: 18, height: 12, depth: 8, color: '#3730a3', price: 89 },
  { id: 'p36', name: 'Wireless Earbuds', category: 'electronics', width: 6, height: 8, depth: 3, color: '#4338ca', price: 149 },
  { id: 'p37', name: 'Power Bank', category: 'electronics', width: 12, height: 2, depth: 6, color: '#1e40af', price: 39 },
  { id: 'p38', name: 'Drone', category: 'electronics', width: 35, height: 12, depth: 35, color: '#1d4ed8', price: 599 },
  { id: 'p39', name: 'VR Headset', category: 'electronics', width: 25, height: 20, depth: 15, color: '#2563eb', price: 399 },
  { id: 'p40', name: 'Gaming Keyboard', category: 'electronics', width: 45, height: 3, depth: 15, color: '#3b82f6', price: 129 },
  { id: 'p41', name: 'Wireless Mouse', category: 'electronics', width: 12, height: 4, depth: 7, color: '#60a5fa', price: 59 },
  { id: 'p42', name: 'Webcam HD', category: 'electronics', width: 8, height: 6, depth: 5, color: '#93c5fd', price: 79 },
  { id: 'p126', name: 'Electric Kettle', category: 'home', width: 20, height: 25, depth: 15, color: '#4b5563', price: 39.99 },
  { id: 'p127', name: 'Air Fryer', category: 'home', width: 30, height: 35, depth: 30, color: '#1e293b', price: 129.99 },
  { id: 'p128', name: 'Microwave Oven', category: 'home', width: 50, height: 30, depth: 40, color: '#374151', price: 199.99 },
  { id: 'p129', name: 'Espresso Machine', category: 'home', width: 25, height: 35, depth: 20, color: '#6b7280', price: 249.99 },
  { id: 'p130', name: 'Rice Cooker', category: 'home', width: 25, height: 20, depth: 20, color: '#f59e0b', price: 59.99 },

  // Clothing & Fashion
  { id: 'p7', name: 'T-Shirt', category: 'clothing', width: 30, height: 40, depth: 2, color: '#dc2626', price: 25 },
  { id: 'p8', name: 'Jeans', category: 'clothing', width: 35, height: 45, depth: 3, color: '#1e40af', price: 65 },
  { id: 'p9', name: 'Jacket', category: 'clothing', width: 40, height: 50, depth: 5, color: '#059669', price: 120 },
  { id: 'p10', name: 'Sneakers', category: 'clothing', width: 25, height: 15, depth: 35, color: '#7c2d12', price: 89 },
  { id: 'p11', name: 'Dress', category: 'clothing', width: 35, height: 55, depth: 3, color: '#be185d', price: 75 },
  { id: 'p43', name: 'Hoodie', category: 'clothing', width: 45, height: 60, depth: 5, color: '#374151', price: 85 },
  { id: 'p44', name: 'Formal Shirt', category: 'clothing', width: 35, height: 45, depth: 2, color: '#e5e7eb', price: 45 },
  { id: 'p45', name: 'Skirt', category: 'clothing', width: 30, height: 35, depth: 2, color: '#f3f4f6', price: 35 },
  { id: 'p46', name: 'Shorts', category: 'clothing', width: 30, height: 25, depth: 3, color: '#6b7280', price: 28 },
  { id: 'p47', name: 'Socks Pack', category: 'clothing', width: 15, height: 20, depth: 8, color: '#9ca3af', price: 15 },
  { id: 'p48', name: 'Belt', category: 'clothing', width: 120, height: 3, depth: 1, color: '#4b5563', price: 25 },
  { id: 'p49', name: 'Hat', category: 'clothing', width: 25, height: 15, depth: 25, color: '#6b7280', price: 22 },
  { id: 'p50', name: 'Scarf', category: 'clothing', width: 150, height: 2, depth: 20, color: '#ef4444', price: 18 },
  { id: 'p51', name: 'Winter Coat', category: 'clothing', width: 50, height: 80, depth: 8, color: '#1f2937', price: 180 },
  { id: 'p52', name: 'Swimwear', category: 'clothing', width: 25, height: 30, depth: 1, color: '#06b6d4', price: 32 },

  // Food & Beverages
  { id: 'p12', name: 'Cereal Box', category: 'food', width: 20, height: 30, depth: 8, color: '#d97706', price: 4.99 },
  { id: 'p13', name: 'Milk Carton', category: 'food', width: 10, height: 25, depth: 10, color: '#ffffff', price: 3.49 },
  { id: 'p14', name: 'Bread Loaf', category: 'food', width: 25, height: 15, depth: 12, color: '#92400e', price: 2.99 },
  { id: 'p15', name: 'Pasta Box', category: 'food', width: 18, height: 28, depth: 6, color: '#fbbf24', price: 1.99 },
  { id: 'p16', name: 'Soda Can', category: 'food', width: 6, height: 12, depth: 6, color: '#ef4444', price: 1.25 },
  { id: 'p53', name: 'Orange Juice', category: 'food', width: 8, height: 25, depth: 8, color: '#f97316', price: 3.99 },
  { id: 'p54', name: 'Yogurt Cup', category: 'food', width: 8, height: 12, depth: 8, color: '#fbbf24', price: 1.49 },
  { id: 'p55', name: 'Frozen Pizza', category: 'food', width: 30, height: 3, depth: 30, color: '#dc2626', price: 5.99 },
  { id: 'p56', name: 'Ice Cream Tub', category: 'food', width: 15, height: 12, depth: 15, color: '#f3e8ff', price: 4.99 },
  { id: 'p57', name: 'Chocolate Bar', category: 'food', width: 12, height: 2, depth: 6, color: '#7c2d12', price: 2.49 },
  { id: 'p58', name: 'Bag of Chips', category: 'food', width: 20, height: 30, depth: 8, color: '#fbbf24', price: 2.99 },
  { id: 'p59', name: 'Energy Drink', category: 'food', width: 6, height: 17, depth: 6, color: '#10b981', price: 2.79 },
  { id: 'p60', name: 'Coffee Beans', category: 'food', width: 15, height: 20, depth: 8, color: '#451a03', price: 12.99 },
  { id: 'p61', name: 'Tea Box', category: 'food', width: 18, height: 12, depth: 6, color: '#16a34a', price: 5.99 },
  { id: 'p62', name: 'Honey Jar', category: 'food', width: 8, height: 15, depth: 8, color: '#f59e0b', price: 7.99 },

  // Books & Media
  { id: 'p63', name: 'Novel Book', category: 'books', width: 15, height: 23, depth: 3, color: '#7c3aed', price: 14.99 },
  { id: 'p64', name: 'Cookbook', category: 'books', width: 20, height: 26, depth: 4, color: '#dc2626', price: 24.99 },
  { id: 'p65', name: 'Magazine', category: 'books', width: 21, height: 28, depth: 1, color: '#06b6d4', price: 4.99 },
  { id: 'p66', name: 'DVD Movie', category: 'books', width: 14, height: 19, depth: 1, color: '#1f2937', price: 9.99 },
  { id: 'p67', name: 'Audio Book CD', category: 'books', width: 12, height: 14, depth: 1, color: '#6366f1', price: 19.99 },
  { id: 'p68', name: 'Comic Book', category: 'books', width: 17, height: 26, depth: 1, color: '#f59e0b', price: 3.99 },
  { id: 'p69', name: 'Textbook', category: 'books', width: 22, height: 28, depth: 5, color: '#059669', price: 89.99 },
  { id: 'p70', name: 'Children Book', category: 'books', width: 20, height: 25, depth: 2, color: '#ec4899', price: 8.99 },

  // Sports & Outdoors
  { id: 'p71', name: 'Basketball', category: 'sports', width: 24, height: 24, depth: 24, color: '#f97316', price: 29.99 },
  { id: 'p72', name: 'Tennis Racket', category: 'sports', width: 68, height: 28, depth: 3, color: '#059669', price: 79.99 },
  { id: 'p73', name: 'Dumbbells 5kg', category: 'sports', width: 15, height: 12, depth: 35, color: '#374151', price: 39.99 },
  { id: 'p74', name: 'Running Shoes', category: 'sports', width: 30, height: 15, depth: 35, color: '#1e40af', price: 119.99 },
  { id: 'p75', name: 'Camping Tent', category: 'sports', width: 50, height: 15, depth: 20, color: '#16a34a', price: 149.99 },
  { id: 'p76', name: 'Fishing Rod', category: 'sports', width: 180, height: 3, depth: 3, color: '#0d9488', price: 59.99 },
  { id: 'p77', name: 'Bicycle Helmet', category: 'sports', width: 25, height: 20, depth: 30, color: '#dc2626', price: 49.99 },
  { id: 'p78', name: 'Soccer Ball', category: 'sports', width: 22, height: 22, depth: 22, color: '#000000', price: 24.99 },
  { id: 'p136', name: 'Yoga Block', category: 'sports', width: 23, height: 15, depth: 8, color: '#10b981', price: 19.99 },
  { id: 'p137', name: 'Hiking Backpack', category: 'sports', width: 50, height: 70, depth: 30, color: '#374151', price: 89.99 },
  { id: 'p138', name: 'Kayak', category: 'sports', width: 300, height: 40, depth: 80, color: '#f97316', price: 599.99 },
  { id: 'p139', name: 'Climbing Rope', category: 'sports', width: 30, height: 30, depth: 10, color: '#dc2626', price: 79.99 },
  { id: 'p140', name: 'Camping Stove', category: 'sports', width: 25, height: 15, depth: 20, color: '#059669', price: 49.99 },

  // Beauty & Personal Care
  { id: 'p79', name: 'Shampoo Bottle', category: 'beauty', width: 8, height: 20, depth: 5, color: '#06b6d4', price: 8.99 },
  { id: 'p80', name: 'Face Cream', category: 'beauty', width: 6, height: 8, depth: 6, color: '#f3e8ff', price: 24.99 },
  { id: 'p81', name: 'Lipstick', category: 'beauty', width: 2, height: 8, depth: 2, color: '#dc2626', price: 18.99 },
  { id: 'p82', name: 'Perfume Bottle', category: 'beauty', width: 6, height: 12, depth: 4, color: '#ec4899', price: 89.99 },
  { id: 'p83', name: 'Toothbrush', category: 'beauty', width: 2, height: 18, depth: 1, color: '#10b981', price: 3.99 },
  { id: 'p84', name: 'Body Lotion', category: 'beauty', width: 8, height: 18, depth: 5, color: '#fbbf24', price: 12.99 },
  { id: 'p85', name: 'Makeup Kit', category: 'beauty', width: 25, height: 15, depth: 20, color: '#ec4899', price: 49.99 },
  { id: 'p86', name: 'Hair Dryer', category: 'beauty', width: 20, height: 25, depth: 12, color: '#374151', price: 39.99 },
  { id: 'p141', name: 'Electric Toothbrush', category: 'beauty', width: 5, height: 20, depth: 5, color: '#10b981', price: 39.99 },
  { id: 'p142', name: 'Hair Straightener', category: 'beauty', width: 30, height: 5, depth: 5, color: '#ec4899', price: 59.99 },
  { id: 'p143', name: 'Nail Polish Set', category: 'beauty', width: 15, height: 10, depth: 5, color: '#fbbf24', price: 24.99 },
  { id: 'p144', name: 'Face Mask Pack', category: 'beauty', width: 20, height: 15, depth: 5, color: '#f3e8ff', price: 19.99 },
  { id: 'p145', name: 'Electric Shaver', category: 'beauty', width: 10, height: 15, depth: 5, color: '#374151', price: 89.99 },

  // Toys & Games
  { id: 'p87', name: 'LEGO Set', category: 'toys', width: 35, height: 25, depth: 15, color: '#dc2626', price: 79.99 },
  { id: 'p88', name: 'Puzzle 1000pc', category: 'toys', width: 30, height: 20, depth: 5, color: '#7c3aed', price: 19.99 },
  { id: 'p89', name: 'Action Figure', category: 'toys', width: 8, height: 30, depth: 5, color: '#059669', price: 24.99 },
  { id: 'p90', name: 'Remote Control Car', category: 'toys', width: 25, height: 15, depth: 40, color: '#f59e0b', price: 89.99 },
  { id: 'p91', name: 'Doll', category: 'toys', width: 15, height: 40, depth: 8, color: '#ec4899', price: 34.99 },
  { id: 'p92', name: 'Playing Cards', category: 'toys', width: 9, height: 6, depth: 2, color: '#1f2937', price: 4.99 },
  { id: 'p146', name: 'Board Game Expansion', category: 'toys', width: 30, height: 30, depth: 8, color: '#7c3aed', price: 29.99 },
  { id: 'p147', name: 'RC Drone', category: 'toys', width: 35, height: 15, depth: 35, color: '#1d4ed8', price: 129.99 },
  { id: 'p148', name: 'Stuffed Animal', category: 'toys', width: 25, height: 40, depth: 20, color: '#f59e0b', price: 19.99 },
  { id: 'p149', name: 'Building Blocks Set', category: 'toys', width: 40, height: 30, depth: 20, color: '#dc2626', price: 49.99 },
  { id: 'p150', name: 'Interactive Puzzle', category: 'toys', width: 30, height: 20, depth: 5, color: '#059669', price: 24.99 },

  // Office & Stationery
  { id: 'p17', name: 'Notebook', category: 'general', width: 21, height: 30, depth: 2, color: '#6366f1', price: 12.99 },
  { id: 'p18', name: 'Pen Set', category: 'general', width: 15, height: 20, depth: 3, color: '#1f2937', price: 8.99 },
  { id: 'p19', name: 'Calendar', category: 'general', width: 25, height: 35, depth: 1, color: '#7c3aed', price: 15.99 },
  { id: 'p20', name: 'Desk Lamp', category: 'general', width: 20, height: 35, depth: 20, color: '#059669', price: 45.99 },
  { id: 'p93', name: 'Stapler', category: 'general', width: 12, height: 6, depth: 25, color: '#374151', price: 14.99 },
  { id: 'p94', name: 'Paper Pack', category: 'general', width: 21, height: 30, depth: 5, color: '#ffffff', price: 9.99 },
  { id: 'p95', name: 'Highlighter Set', category: 'general', width: 12, height: 15, depth: 3, color: '#fbbf24', price: 6.99 },
  { id: 'p96', name: 'Desk Organizer', category: 'general', width: 25, height: 12, depth: 15, color: '#6b7280', price: 19.99 },

  // Automotive
  { id: 'p97', name: 'Car Wax', category: 'automotive', width: 10, height: 15, depth: 10, color: '#fbbf24', price: 16.99 },
  { id: 'p98', name: 'Motor Oil', category: 'automotive', width: 12, height: 25, depth: 8, color: '#1f2937', price: 24.99 },
  { id: 'p99', name: 'Car Freshener', category: 'automotive', width: 6, height: 10, depth: 2, color: '#10b981', price: 3.99 },
  { id: 'p100', name: 'Jumper Cables', category: 'automotive', width: 40, height: 8, depth: 12, color: '#dc2626', price: 29.99 },
  { id: 'p101', name: 'Tire Gauge', category: 'automotive', width: 3, height: 15, depth: 3, color: '#374151', price: 12.99 },
  { id: 'p151', name: 'Car Vacuum Cleaner', category: 'automotive', width: 15, height: 20, depth: 10, color: '#374151', price: 49.99 },
  { id: 'p152', name: 'Dash Cam', category: 'automotive', width: 10, height: 5, depth: 5, color: '#1e40af', price: 99.99 },
  { id: 'p153', name: 'Car Seat Cover', category: 'automotive', width: 50, height: 100, depth: 5, color: '#6b7280', price: 79.99 },
  { id: 'p154', name: 'Portable Tire Inflator', category: 'automotive', width: 20, height: 15, depth: 10, color: '#fbbf24', price: 59.99 },
  { id: 'p155', name: 'Car Cleaning Kit', category: 'automotive', width: 30, height: 20, depth: 15, color: '#dc2626', price: 39.99 },

  // Pet Supplies
  { id: 'p102', name: 'Dog Food Bag', category: 'pets', width: 30, height: 45, depth: 15, color: '#92400e', price: 39.99 },
  { id: 'p103', name: 'Cat Litter', category: 'pets', width: 25, height: 20, depth: 35, color: '#6b7280', price: 18.99 },
  { id: 'p104', name: 'Pet Toy', category: 'pets', width: 12, height: 8, depth: 6, color: '#f59e0b', price: 9.99 },
  { id: 'p105', name: 'Pet Leash', category: 'pets', width: 150, height: 2, depth: 1, color: '#1e40af', price: 14.99 },
  { id: 'p106', name: 'Pet Bowl', category: 'pets', width: 20, height: 8, depth: 20, color: '#ef4444', price: 11.99 },
  { id: 'p156', name: 'Pet Carrier', category: 'pets', width: 40, height: 30, depth: 25, color: '#6b7280', price: 49.99 },
  { id: 'p157', name: 'Automatic Pet Feeder', category: 'pets', width: 30, height: 40, depth: 20, color: '#1e40af', price: 89.99 },
  { id: 'p158', name: 'Pet Grooming Kit', category: 'pets', width: 25, height: 15, depth: 10, color: '#f59e0b', price: 29.99 },
  { id: 'p159', name: 'Dog Chew Toy', category: 'pets', width: 15, height: 10, depth: 5, color: '#dc2626', price: 9.99 },
  { id: 'p160', name: 'Cat Scratching Post', category: 'pets', width: 40, height: 60, depth: 40, color: '#374151', price: 59.99 },

  // Health & Pharmacy
  { id: 'p107', name: 'Vitamins Bottle', category: 'health', width: 6, height: 12, depth: 6, color: '#f59e0b', price: 19.99 },
  { id: 'p108', name: 'First Aid Kit', category: 'health', width: 25, height: 15, depth: 8, color: '#dc2626', price: 24.99 },
  { id: 'p109', name: 'Pain Relief', category: 'health', width: 8, height: 12, depth: 4, color: '#1e40af', price: 8.99 },
  { id: 'p110', name: 'Thermometer', category: 'health', width: 2, height: 15, depth: 1, color: '#6b7280', price: 12.99 },
  { id: 'p111', name: 'Bandages Box', category: 'health', width: 12, height: 8, depth: 6, color: '#f3f4f6', price: 5.99 },
  { id: 'p161', name: 'Blood Pressure Monitor', category: 'health', width: 15, height: 10, depth: 10, color: '#1e40af', price: 49.99 },
  { id: 'p162', name: 'Digital Weighing Scale', category: 'health', width: 30, height: 5, depth: 30, color: '#6b7280', price: 39.99 },
  { id: 'p163', name: 'Hand Sanitizer Pack', category: 'health', width: 10, height: 20, depth: 5, color: '#fbbf24', price: 19.99 },
  { id: 'p164', name: 'Reusable Face Masks', category: 'health', width: 15, height: 10, depth: 5, color: '#374151', price: 14.99 },
  { id: 'p165', name: 'Infrared Thermometer', category: 'health', width: 5, height: 15, depth: 5, color: '#dc2626', price: 29.99 },

  // Garden & Hardware
  { id: 'p112', name: 'Garden Gloves', category: 'garden', width: 15, height: 25, depth: 5, color: '#16a34a', price: 8.99 },
  { id: 'p113', name: 'Plant Seeds', category: 'garden', width: 8, height: 12, depth: 2, color: '#65a30d', price: 3.99 },
  { id: 'p114', name: 'Watering Can', category: 'garden', width: 30, height: 25, depth: 20, color: '#059669', price: 19.99 },
  { id: 'p115', name: 'Hammer', category: 'hardware', width: 30, height: 12, depth: 3, color: '#7c2d12', price: 16.99 },
  { id: 'p116', name: 'Screwdriver Set', category: 'hardware', width: 20, height: 15, depth: 5, color: '#1f2937', price: 22.99 },
  { id: 'p117', name: 'Measuring Tape', category: 'hardware', width: 8, height: 8, depth: 3, color: '#fbbf24', price: 9.99 },
  { id: 'p166', name: 'Lawn Mower', category: 'garden', width: 100, height: 50, depth: 60, color: '#16a34a', price: 299.99 },
  { id: 'p167', name: 'Garden Hose', category: 'garden', width: 30, height: 10, depth: 30, color: '#059669', price: 39.99 },
  { id: 'p168', name: 'Pruning Shears', category: 'garden', width: 20, height: 5, depth: 5, color: '#7c2d12', price: 19.99 },
  { id: 'p169', name: 'Toolbox', category: 'hardware', width: 40, height: 20, depth: 20, color: '#374151', price: 59.99 },
  { id: 'p170', name: 'Cordless Drill', category: 'hardware', width: 30, height: 20, depth: 10, color: '#1f2937', price: 99.99 },

  // Specialty products (expanded)
  { id: 'p221', name: 'Pottery Wheel', category: 'specialty', width: 50, height: 40, depth: 30, color: '#a21caf', price: 299.99 },
  { id: 'p222', name: 'Calligraphy Set', category: 'specialty', width: 20, height: 10, depth: 5, color: '#f59e42', price: 49.99 },
  { id: 'p223', name: 'Model Train Set', category: 'specialty', width: 60, height: 20, depth: 15, color: '#2563eb', price: 159.99 },
  { id: 'p224', name: 'Rare Coin Collection', category: 'specialty', width: 15, height: 5, depth: 10, color: '#fbbf24', price: 499.99 },
  { id: 'p225', name: 'Antique Map', category: 'specialty', width: 40, height: 30, depth: 2, color: '#92400e', price: 349.99 },
  { id: 'p226', name: 'Chess Set (Luxury)', category: 'specialty', width: 40, height: 10, depth: 40, color: '#374151', price: 199.99 },
  { id: 'p227', name: 'Vintage Vinyl Record', category: 'specialty', width: 32, height: 32, depth: 1, color: '#1e293b', price: 89.99 },
  { id: 'p228', name: 'Handmade Quilt', category: 'specialty', width: 200, height: 2, depth: 200, color: '#f59e0b', price: 299.99 },
  { id: 'p229', name: 'Collectible Figurine', category: 'specialty', width: 10, height: 20, depth: 10, color: '#be185d', price: 79.99 },
  { id: 'p230', name: 'Artisan Soap Set', category: 'specialty', width: 15, height: 8, depth: 10, color: '#fbbf24', price: 29.99 },

  // Premium products (expanded)
  { id: 'p231', name: 'Diamond Necklace', category: 'premium', width: 10, height: 2, depth: 10, color: '#f3f4f6', price: 4999 },
  { id: 'p232', name: 'Luxury Sunglasses', category: 'premium', width: 15, height: 5, depth: 5, color: '#1e293b', price: 399 },
  { id: 'p233', name: 'Designer Shoes', category: 'premium', width: 30, height: 15, depth: 35, color: '#7c2d12', price: 599 },
  { id: 'p234', name: 'Gold Bracelet', category: 'premium', width: 8, height: 2, depth: 8, color: '#f59e0b', price: 799 },
  { id: 'p235', name: 'Silk Bedding Set', category: 'premium', width: 60, height: 10, depth: 40, color: '#8b5cf6', price: 999 },
  { id: 'p236', name: 'Luxury Fountain Pen', category: 'premium', width: 15, height: 2, depth: 2, color: '#374151', price: 349 },
  { id: 'p237', name: 'Premium Whiskey', category: 'premium', width: 10, height: 30, depth: 10, color: '#92400e', price: 499 },
  { id: 'p238', name: 'Designer Suit', category: 'premium', width: 45, height: 60, depth: 5, color: '#1e40af', price: 1299 },
  { id: 'p239', name: 'Luxury Perfume Set', category: 'premium', width: 20, height: 15, depth: 10, color: '#ec4899', price: 299 },
  { id: 'p240', name: 'Platinum Cufflinks', category: 'premium', width: 5, height: 2, depth: 5, color: '#f3f4f6', price: 599 },

  // Home products (existing)
  { id: 'p29', name: 'Coffee Mug', category: 'home', width: 12, height: 10, depth: 12, color: '#92400e', price: 14.99 },
  { id: 'p30', name: 'Picture Frame', category: 'home', width: 20, height: 25, depth: 3, color: '#059669', price: 19.99 },
  { id: 'p31', name: 'Candle', category: 'home', width: 8, height: 12, depth: 8, color: '#f59e0b', price: 12.99 },
  { id: 'p32', name: 'Plant Pot', category: 'home', width: 15, height: 18, depth: 15, color: '#16a34a', price: 24.99 },

  // Additional Home & Kitchen
  { id: 'p118', name: 'Blender', category: 'home', width: 20, height: 35, depth: 18, color: '#1f2937', price: 89.99 },
  { id: 'p119', name: 'Toaster', category: 'home', width: 28, height: 20, depth: 25, color: '#6b7280', price: 49.99 },
  { id: 'p120', name: 'Kitchen Knife Set', category: 'home', width: 35, height: 20, depth: 5, color: '#374151', price: 79.99 },
  { id: 'p121', name: 'Dinner Plates Set', category: 'home', width: 30, height: 15, depth: 30, color: '#f3f4f6', price: 39.99 },
  { id: 'p122', name: 'Vacuum Cleaner', category: 'home', width: 35, height: 110, depth: 30, color: '#ef4444', price: 199.99 },
  { id: 'p123', name: 'Iron', category: 'home', width: 25, height: 15, depth: 12, color: '#1e40af', price: 34.99 },
  { id: 'p124', name: 'Bedsheets Set', category: 'home', width: 40, height: 30, depth: 8, color: '#06b6d4', price: 59.99 },
  { id: 'p125', name: 'Pillow', category: 'home', width: 60, height: 15, depth: 40, color: '#f8fafc', price: 24.99 },

  // Additional Electronics
  { id: 'p171', name: 'Smart Light Bulb', category: 'electronics', width: 6, height: 12, depth: 6, color: '#f59e0b', price: 19.99 },
  { id: 'p172', name: 'Gaming Monitor', category: 'electronics', width: 70, height: 50, depth: 20, color: '#1e293b', price: 399.99 },
  { id: 'p173', name: 'External Hard Drive', category: 'electronics', width: 12, height: 8, depth: 2, color: '#374151', price: 89.99 },
  { id: 'p174', name: 'Wireless Router', category: 'electronics', width: 20, height: 5, depth: 15, color: '#2563eb', price: 129.99 },
  { id: 'p175', name: 'Smart Home Hub', category: 'electronics', width: 15, height: 10, depth: 5, color: '#4f46e5', price: 149.99 },
  { id: 'p176', name: 'Action Camera', category: 'electronics', width: 8, height: 6, depth: 4, color: '#1d4ed8', price: 299.99 },
  { id: 'p177', name: 'E-Reader', category: 'electronics', width: 15, height: 20, depth: 1, color: '#6b7280', price: 129.99 },
  { id: 'p178', name: 'Portable Charger', category: 'electronics', width: 10, height: 2, depth: 5, color: '#1e40af', price: 39.99 },
  { id: 'p179', name: 'Smart Glasses', category: 'electronics', width: 15, height: 5, depth: 5, color: '#3b82f6', price: 499.99 },
  { id: 'p180', name: 'Digital Camera', category: 'electronics', width: 20, height: 15, depth: 10, color: '#2563eb', price: 599.99 },

  // Additional Clothing & Fashion
  { id: 'p181', name: 'Raincoat', category: 'clothing', width: 40, height: 60, depth: 5, color: '#059669', price: 75.99 },
  { id: 'p182', name: 'Leather Jacket', category: 'clothing', width: 45, height: 60, depth: 5, color: '#7c2d12', price: 199.99 },
  { id: 'p183', name: 'Wool Sweater', category: 'clothing', width: 35, height: 50, depth: 3, color: '#374151', price: 89.99 },
  { id: 'p184', name: 'Sports Cap', category: 'clothing', width: 25, height: 15, depth: 15, color: '#1e40af', price: 19.99 },
  { id: 'p185', name: 'Gloves', category: 'clothing', width: 20, height: 10, depth: 5, color: '#dc2626', price: 25.99 },
  { id: 'p186', name: 'Rain Boots', category: 'clothing', width: 30, height: 40, depth: 20, color: '#6b7280', price: 49.99 },
  { id: 'p187', name: 'Formal Pants', category: 'clothing', width: 35, height: 50, depth: 3, color: '#e5e7eb', price: 65.99 },
  { id: 'p188', name: 'Casual Shorts', category: 'clothing', width: 30, height: 25, depth: 3, color: '#6b7280', price: 29.99 },
  { id: 'p189', name: 'Wool Scarf', category: 'clothing', width: 150, height: 2, depth: 20, color: '#ef4444', price: 35.99 },
  { id: 'p190', name: 'Winter Hat', category: 'clothing', width: 25, height: 15, depth: 25, color: '#6b7280', price: 22.99 },

  // Additional Food & Beverages
  { id: 'p191', name: 'Granola Bars', category: 'food', width: 15, height: 10, depth: 5, color: '#d97706', price: 4.99 },
  { id: 'p192', name: 'Almond Milk', category: 'food', width: 10, height: 25, depth: 10, color: '#ffffff', price: 3.99 },
  { id: 'p193', name: 'Bag of Rice', category: 'food', width: 30, height: 40, depth: 10, color: '#92400e', price: 12.99 },
  { id: 'p194', name: 'Pack of Cookies', category: 'food', width: 20, height: 15, depth: 8, color: '#fbbf24', price: 2.99 },
  { id: 'p195', name: 'Bottle of Olive Oil', category: 'food', width: 8, height: 25, depth: 8, color: '#16a34a', price: 9.99 },
  { id: 'p196', name: 'Pack of Spices', category: 'food', width: 10, height: 15, depth: 5, color: '#f59e0b', price: 5.99 },
  { id: 'p197', name: 'Energy Bars', category: 'food', width: 15, height: 10, depth: 5, color: '#10b981', price: 3.99 },
  { id: 'p198', name: 'Pack of Tea Bags', category: 'food', width: 15, height: 10, depth: 5, color: '#16a34a', price: 4.99 },
  { id: 'p199', name: 'Bottle of Vinegar', category: 'food', width: 8, height: 25, depth: 8, color: '#f59e0b', price: 3.99 },
  { id: 'p200', name: 'Pack of Pasta', category: 'food', width: 20, height: 15, depth: 5, color: '#fbbf24', price: 2.49 },

  // Additional Books & Media
  { id: 'p201', name: 'Travel Guide', category: 'books', width: 15, height: 23, depth: 3, color: '#7c3aed', price: 14.99 },
  { id: 'p202', name: 'Science Fiction Novel', category: 'books', width: 20, height: 26, depth: 4, color: '#dc2626', price: 24.99 },
  { id: 'p203', name: 'Photography Magazine', category: 'books', width: 21, height: 28, depth: 1, color: '#06b6d4', price: 4.99 },
  { id: 'p204', name: 'Music Album CD', category: 'books', width: 14, height: 19, depth: 1, color: '#1f2937', price: 9.99 },
  { id: 'p205', name: 'Self-Help Book', category: 'books', width: 12, height: 14, depth: 1, color: '#6366f1', price: 19.99 },
  { id: 'p206', name: 'Graphic Novel', category: 'books', width: 17, height: 26, depth: 1, color: '#f59e0b', price: 3.99 },
  { id: 'p207', name: 'Academic Journal', category: 'books', width: 22, height: 28, depth: 5, color: '#059669', price: 89.99 },
  { id: 'p208', name: 'Children Storybook', category: 'books', width: 20, height: 25, depth: 2, color: '#ec4899', price: 8.99 },
  { id: 'p209', name: 'Cookbook for Beginners', category: 'books', width: 20, height: 26, depth: 4, color: '#dc2626', price: 24.99 },
  { id: 'p210', name: 'Historical Biography', category: 'books', width: 15, height: 23, depth: 3, color: '#7c3aed', price: 14.99 },

  // Additional Sports & Outdoors
  { id: 'p211', name: 'Soccer Cleats', category: 'sports', width: 30, height: 15, depth: 35, color: '#1e40af', price: 119.99 },
  { id: 'p212', name: 'Trekking Poles', category: 'sports', width: 100, height: 5, depth: 5, color: '#059669', price: 49.99 },
  { id: 'p213', name: 'Sleeping Bag', category: 'sports', width: 50, height: 20, depth: 20, color: '#16a34a', price: 79.99 },
  { id: 'p214', name: 'Fishing Tackle Box', category: 'sports', width: 30, height: 15, depth: 20, color: '#0d9488', price: 39.99 },
  { id: 'p215', name: 'Cycling Gloves', category: 'sports', width: 15, height: 10, depth: 5, color: '#dc2626', price: 19.99 },
  { id: 'p216', name: 'Rock Climbing Shoes', category: 'sports', width: 30, height: 15, depth: 20, color: '#374151', price: 99.99 },
  { id: 'p217', name: 'Waterproof Jacket', category: 'sports', width: 40, height: 60, depth: 5, color: '#059669', price: 129.99 },
  { id: 'p218', name: 'Portable Hammock', category: 'sports', width: 30, height: 10, depth: 10, color: '#16a34a', price: 49.99 },
  { id: 'p219', name: 'Sports Water Bottle', category: 'sports', width: 10, height: 25, depth: 10, color: '#1e40af', price: 14.99 },
  { id: 'p220', name: 'Camping Lantern', category: 'sports', width: 15, height: 20, depth: 15, color: '#f59e0b', price: 29.99 },
];

// Export products by category for easy filtering
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => 
    product.category.toLowerCase().includes(category.toLowerCase()) ||
    category.toLowerCase().includes(product.category.toLowerCase())
  );
};

// Export all available categories
export const productCategories = [
  'electronics',
  'clothing',
  'food',
  'books',
  'sports',
  'beauty',
  'toys',
  'general',
  'automotive',
  'pets',
  'health',
  'garden',
  'hardware',
  'specialty',
  'premium',
  'home'
];

export default mockProducts;
