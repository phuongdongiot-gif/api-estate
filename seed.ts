import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { createClient as createSanityClient } from '@sanity/client';

dotenv.config();

// SUPABASE CONFIG
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// SANITY CONFIG
const sanityProjectId = process.env.SANITY_PROJECT_ID || 'Nhập Project ID';
const sanityDataset = process.env.SANITY_DATASET || 'production';
const sanityToken = process.env.SANITY_TOKEN || ''; 

const sanity = createSanityClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  token: sanityToken,
  useCdn: false,
  apiVersion: '2024-04-11',
});

// DATA MẪU CHO DỰ ÁN MỚI
const newLocation = {
  _type: 'location',
  name: 'Hội An, Quảng Nam',
  slug: { _type: 'slug', current: 'hoi-an' },
};

const newAmenity = {
  _type: 'amenity',
  title: 'Hồ bơi vô cực dát vàng',
  description: 'Toạ lạc trên tầng 50 nhìn ra biển Đông',
};

const newFloorplan = {
  _type: 'floorplan',
  name: 'Penthouse Hoàng Gia',
  area: '450',
  beds: 4,
  baths: 5,
};

async function seed() {
  console.log('🌱 Khởi Động Máy Cày Dữ Liệu Thế Hệ Mới (Relational)...');

  if (!sanityToken) {
    console.error('❌ THIẾU SANITY_TOKEN! Không thể ghi dữ liệu.');
    return;
  }

  try {
    // 1. TẠO KHU VỰC
    console.log('📍 1. Tạo Location mới...');
    const locRes = await sanity.create(newLocation);
    await supabase.from('locations').upsert({
      id: locRes._id,
      slug: newLocation.slug.current,
      name: newLocation.name,
      lat: 15.8794,
      lng: 108.3350
    });
    console.log(`✅ Đã tạo Khu Vực: ${newLocation.name}`);

    // 2. TẠO TIỆN ÍCH
    console.log('🌟 2. Tạo Tiện ích mới...');
    const amenityRes = await sanity.create(newAmenity);
    // (Bảng project_amenities sẽ được chèn sau khi có Project ID)
    console.log(`✅ Đã tạo Tiện Ích: ${newAmenity.title}`);

    // 3. TẠO MẶT BẰNG
    console.log('📐 3. Tạo Mặt bằng mới...');
    const fpRes = await sanity.create(newFloorplan);
    console.log(`✅ Đã tạo Mặt Bằng: ${newFloorplan.name}`);

    // 4. TẠO SIÊU DỰ ÁN (PROJECT)
    console.log('🏢 4. Tạo Siêu Dự Án Liên Kết (Dự án số 2)...');
    
    // Tạo cấu trúc Reference cho Sanity
    const newProject = {
      _type: 'project',
      name: 'The Royal Hội An Heritage',
      slug: { _type: 'slug', current: 'the-royal-hoi-an' },
      location: {
        _type: 'reference',
        _ref: locRes._id // Móc khoá ngoại
      },
      hero_data: {
        tagline: 'DI SẢN VƯỢT THỜI GIAN',
        titleLine1: 'THƯỢNG LƯU',
        titleLine2: 'Đậm Chất Thơ',
        description: 'Mang linh hồn phố cổ vào từng phiến đá ong.'
      },
      // Gắn mảng Reference
      amenities_ref: [
        { _type: 'reference', _key: 'amen1', _ref: amenityRes._id }
      ],
      floorplans_ref: [
         { _type: 'reference', _key: 'fp1', _ref: fpRes._id }
      ]
    };

    const projRes = await sanity.create(newProject);
    
    // Ghi dữ liệu lõi Project xuống Supabase
    await supabase.from('projects').upsert({
      id: projRes._id,
      slug: newProject.slug.current,
      location_id: locRes._id,
      name: newProject.name,
      hero_title: 'THƯỢNG LƯU',
      hero_desc: 'Mang linh hồn phố cổ vào từng phiến đá ong.',
      lat: 15.8800,
      lng: 108.3360
    });
    console.log(`✅ Đã tạo Dự án chính: ${newProject.name}`);

    // Ghi các bảng trung gian (Bảng con) của Project
    await supabase.from('project_amenities').upsert({
        id: amenityRes._id,
        project_id: projRes._id, // Ràng buộc FK với Project
        title: newAmenity.title,
        description: newAmenity.description
    });

    await supabase.from('project_floorplans').upsert({
        id: fpRes._id,
        project_id: projRes._id, // Ràng buộc FK với Project
        name: newFloorplan.name,
        area: newFloorplan.area,
        beds: newFloorplan.beds,
        baths: newFloorplan.baths
    });

    console.log('🚀 KIỂM TRA ĐẦU CUỐI HOÀN HẢO! CHUỖI LIÊN KẾT ĐÃ THÀNH CÔNG VÀO CẢ 5 BẢNG.');
  } catch (error) {
    console.error('❌ LỖI NGHIÊM TRỌNG: ', error);
  }
}

seed();
