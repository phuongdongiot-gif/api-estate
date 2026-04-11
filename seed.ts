import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { createClient as createSanityClient } from '@sanity/client';

dotenv.config();

// SUPABASE CONFIG
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// SANITY CONFIG (Cần thêm vào bảng .env của backend dự án)
const sanityProjectId = process.env.SANITY_PROJECT_ID || 'Nhập Project ID của bạn';
const sanityDataset = process.env.SANITY_DATASET || 'production';
const sanityToken = process.env.SANITY_TOKEN || ''; // Bắt buộc phải có token cấp quyền ghi

const sanity = createSanityClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  token: sanityToken,
  useCdn: false, // write operations should bypass CDN
  apiVersion: '2024-04-11',
});

const properties = [
  {
    _type: 'property',
    name: 'Căn hộ Góc Biển Alize',
    slug: { _type: 'slug', current: 'can-ho-goc-bien-alize' },
    transaction_type: 'sale',
    property_category: 'apartments',
    price: '8.5 Tỷ',
    price_num: 8500000000,
    location: 'Sơn Trà, Đà Nẵng',
    area: '100m2',
    area_num: 100,
    beds: 3,
    baths: 2,
    img_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80',
  },
  {
    _type: 'property',
    name: 'Biệt Thự Đảo Sinh Thái Ánh Dương',
    slug: { _type: 'slug', current: 'biet-thu-dao-sinh-thai' },
    transaction_type: 'rent',
    property_category: 'villas',
    price: '40 Triệu/Tháng',
    price_num: 40000000,
    location: 'Hòa Xuân, Đà Nẵng',
    area: '300m2',
    area_num: 300,
    beds: 5,
    baths: 6,
    img_url: 'https://images.unsplash.com/photo-1613490908592-fd5e64efebcc?q=80',
  }
];

const projects = [
  {
    _type: 'project',
    name: 'ALIZE Mega Residence',
    slug: { _type: 'slug', current: 'alize-mega-residence' },
    hero_data: {
      tagline: 'BIỂU TƯỢNG SỐNG THƯỢNG LƯU',
      titleLine1: 'TUYỆT TÁC',
      titleLine2: 'Không Gian',
      description: 'Dự án hoàng kim ven biển Mỹ Khê.'
    },
    overview_data: {
      sectionTag: '01 - TỔNG QUAN',
      titleLine1: 'Một Biểu Tượng',
      titleLine2: 'Kiến Trúc Đương Đại',
      description: 'Alize nâng tầm chuẩn mực sống...',
      details: [
        { label: 'Chủ đầu tư', value: 'A&T Group' },
        { label: 'Quy mô', value: '1 tòa, 640 căn hộ' }
      ]
    }
  }
];

async function seed() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...');

  if (!sanityToken) {
    console.error('❌ LỖI: Bạn chưa thêm SANITY_TOKEN vào file backend/.env!');
    console.error('Hãy vào Sanity Manage -> API -> Tokens -> Add New Token (Quyền Editor) và dán nó vào file .env');
    return;
  }

  try {
    // 1. Tạo trên Sanity
    console.log('1️⃣ Đang đẩy lên Sanity CMS...');
    for (const prop of properties) {
      const res = await sanity.create(prop);
      console.log(`✅ Sanity Created Property: ${res.name}`);

      // 2. Chèn thẳng 1 bản copy xuống Supabase (phòng trường hợp Webhook của bạn chưa kết nối tới mạng)
      const supaProp = {
        id: res._id,
        name: prop.name,
        transaction_type: prop.transaction_type,
        property_category: prop.property_category,
        price: prop.price,
        price_num: prop.price_num,
        location: prop.location,
        beds: prop.beds,
        baths: prop.baths,
        area: prop.area,
        area_num: prop.area_num,
        img_url: prop.img_url,
      };
      await supabase.from('properties').upsert(supaProp);
    }

    for (const proj of projects) {
      const res = await sanity.create(proj);
      console.log(`✅ Sanity Created Project: ${res.name}`);

      // Chèn thẳng 1 bản copy xuống Supabase
      const supaProj = {
        id: res._id,
        slug: proj.slug.current,
        name: proj.name,
        hero_data: proj.hero_data,
        overview_data: proj.overview_data,
      };
      await supabase.from('projects').upsert(supaProj);
    }

    console.log('🚀 HOÀN TẤT ĐẨY DỮ LIỆU ĐA NỀN TẢNG (SANITY & SUPABASE)!');
  } catch (error) {
    console.error('❌ CÓ LỖI XẢY RA: ', error);
  }
}

seed();
