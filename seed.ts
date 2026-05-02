import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { LocationEntity } from './src/database/entities/location.entity';
import { ProjectEntity } from './src/database/entities/project.entity';
import { ProjectAmenityEntity } from './src/database/entities/project-amenity.entity';
import { ProjectFloorplanEntity } from './src/database/entities/project-floorplan.entity';
import { PropertyEntity } from './src/database/entities/property.entity';
import { BlogEntity } from './src/database/entities/blog.entity';

dotenv.config();

// NEON POSTGRESQL VIA TYPEORM
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [
    LocationEntity,
    ProjectEntity,
    ProjectAmenityEntity,
    ProjectFloorplanEntity,
    PropertyEntity,
    BlogEntity,
  ],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Khởi Động Máy Cày Dữ Liệu (Neon PostgreSQL Direct)...');

  // Kết nối Database
  await AppDataSource.initialize();
  console.log('✅ Đã kết nối Neon PostgreSQL thành công!');

  const locationRepo = AppDataSource.getRepository(LocationEntity);
  const projectRepo = AppDataSource.getRepository(ProjectEntity);
  const amenityRepo = AppDataSource.getRepository(ProjectAmenityEntity);
  const floorplanRepo = AppDataSource.getRepository(ProjectFloorplanEntity);
  const propertyRepo = AppDataSource.getRepository(PropertyEntity);
  const blogRepo = AppDataSource.getRepository(BlogEntity);

  try {
    console.log('🧹 1. Dọn dẹp dữ liệu cũ (Xóa toàn bộ)...');
    await blogRepo.query('TRUNCATE TABLE "blogs" CASCADE');
    await propertyRepo.query('TRUNCATE TABLE "properties" CASCADE');
    await projectRepo.query('TRUNCATE TABLE "projects" CASCADE');
    await locationRepo.query('TRUNCATE TABLE "locations" CASCADE');
    console.log('✅ Đã dọn sạch database!');

    // 1. TẠO KHU VỰC
    console.log('📍 2. Tạo Locations...');
    const locations = [
      { id: 'loc-da-nang', slug: 'da-nang', name: 'Đà Nẵng', hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000', lat: 16.0544, lng: 108.2022 },
      { id: 'loc-hoi-an', slug: 'hoi-an', name: 'Hội An, Quảng Nam', hero_image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000', lat: 15.8794, lng: 108.3350 },
      { id: 'loc-phu-quoc', slug: 'phu-quoc', name: 'Phú Quốc, Kiên Giang', hero_image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000', lat: 10.2289, lng: 103.9572 }
    ];
    for (const loc of locations) await locationRepo.save(loc);
    console.log(`✅ Đã tạo ${locations.length} Khu Vực`);

    // 2. TẠO SIÊU DỰ ÁN (PROJECTS)
    console.log('🏢 3. Tạo Siêu Dự Án...');
    const projects = [
      {
        id: 'proj-alize-danang',
        slug: 'alize-da-nang',
        location_id: 'loc-da-nang',
        name: 'ALIZE Residence Đà Nẵng',
        hero_title: 'ALIZE RESIDENCE',
        hero_desc: 'Biểu tượng sống thượng lưu bên bờ biển Mỹ Khê.',
        hero_data: { tagline: 'LUXURY BEACHFRONT', titleLine1: 'ALIZE', titleLine2: 'RESIDENCE', description: 'Biểu tượng mới của giới thượng lưu bên bờ biển Mỹ Khê Đà Nẵng.' } as any,
        overview_data: { content: 'ALIZE Residence là tổ hợp căn hộ nghỉ dưỡng hạng sang tọa lạc tại vị trí kim cương mặt biển Mỹ Khê.' },
        lat: 16.0357, lng: 108.2435,
      }
    ];
    for (const proj of projects) await projectRepo.save(proj);
    console.log(`✅ Đã tạo ${projects.length} Dự án`);

    // 3. TẠO TIỆN ÍCH
    console.log('🌟 4. Tạo Tiện ích dự án...');
    const amenities = [
      { id: 'amen-alize-pool', project_id: 'proj-alize-danang', title: 'Hồ bơi vô cực Skypool', description: 'Tầm nhìn 360 độ toàn cảnh biển Mỹ Khê' },
      { id: 'amen-alize-gym', project_id: 'proj-alize-danang', title: 'Phòng Gym tiêu chuẩn 5 Sao', description: 'Trang thiết bị TechnoGym tối tân' }
    ];
    for (const amen of amenities) await amenityRepo.save(amen);

    // 4. TẠO MẶT BẰNG
    console.log('📐 5. Tạo Mặt bằng...');
    const floorplans = [
      { id: 'fp-alize-2pn', project_id: 'proj-alize-danang', name: 'Căn Hộ 2 Phòng Ngủ Ocean View', area: '95', beds: 2, baths: 2 },
      { id: 'fp-alize-penthouse', project_id: 'proj-alize-danang', name: 'Penthouse Duplex', area: '320', beds: 4, baths: 5 }
    ];
    for (const fp of floorplans) await floorplanRepo.save(fp);

    // 5. TẠO BẤT ĐỘNG SẢN BÁN LẺ
    console.log('🏘️ 6. Tạo Bất Động Sản Bán Lẻ...');
    const properties = [
      {
        id: 'prop-alize-1', transaction_type: 'sale', property_category: 'apartments', is_new: true,
        name: 'Penthouse Signature ALIZE Da Nang', project_id: 'proj-alize-danang', project_name: 'ALIZE Residence Đà Nẵng',
        price: '35 Tỷ', price_num: 35000000000, location: 'Sơn Trà, Đà Nẵng',
        area: '320m2', area_num: 320, beds: 4, baths: 5,
        description: 'Tuyệt tác không gian sống giữa tầng mây. Bàn giao full nội thất nhập khẩu Ý.',
        img_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070',
        gallery: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000'],
        lat: 16.0357, lng: 108.2435
      },
      {
        id: 'prop-alize-2', transaction_type: 'rent', property_category: 'apartments', is_new: false,
        name: 'Căn hộ 2PN View Trực Diện Biển', project_id: 'proj-alize-danang', project_name: 'ALIZE Residence Đà Nẵng',
        price: '45 Triệu/Tháng', price_num: 45000000, location: 'Sơn Trà, Đà Nẵng',
        area: '95m2', area_num: 95, beds: 2, baths: 2,
        description: 'Tận hưởng bình minh trên biển ngay từ giường ngủ. Phù hợp cho chuyên gia quốc tế.',
        img_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
        gallery: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000'],
        legal_status: 'Sổ hồng lâu dài',
        furniture: 'Full nội thất cao cấp',
        house_direction: 'Đông Nam',
        balcony_direction: 'Đông',
        floors: 35,
        agent_name: 'Trần Văn Sang',
        agent_phone: '0901234567',
        agent_zalo: '0901234567',
        agent_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80',
        video_url: 'https://youtube.com',
        tour_3d_url: 'https://my.matterport.com/show/?m=xxx',
        lat: 16.0359, lng: 108.2438
      },
      {
        id: 'prop-phuquoc-1', transaction_type: 'sale', property_category: 'villas', is_new: false,
        name: 'Ocean Front Villa Sun Premier', project_id: null, project_name: null,
        price: '120 Tỷ', price_num: 120000000000, location: 'Nam Đảo, Phú Quốc',
        area: '800m2', area_num: 800, beds: 6, baths: 7,
        description: 'Biệt thự mũi Ông Đội, 2 mặt biển hiếm có tại Việt Nam. Bến du thuyền cá nhân.',
        img_url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000',
        gallery: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000'],
        lat: 10.2289, lng: 103.9572
      }
    ];
    for (const p of properties) await propertyRepo.save(p);
    console.log(`✅ Đã tạo ${properties.length} Bất Động Sản`);

    // 6. TẠO BLOGS
    console.log('📝 7. Tạo Blogs (Tin tức)...');
    const blogs = [
      {
        id: 'blog-1', slug: 'xu-huong-bds-nghi-duong-2026', title: 'Xu Hướng Bất Động Sản Nghỉ Dưỡng Hạng Sang 2026',
        date: new Date('2026-05-01'), description: 'Giới siêu giàu đang chuyển hướng đầu tư vào các dự án mang tính biểu tượng và trải nghiệm độc bản.',
        img_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000', content: { blocks: [] }
      },
      {
        id: 'blog-2', slug: 'thi-truong-da-nang-don-song', title: 'Thị Trường Đà Nẵng Đón Sóng Đầu Tư Nước Ngoài',
        date: new Date('2026-05-02'), description: 'Hàng loạt quỹ đầu tư FDI đang rót vốn vào phân khúc Branded Residences tại thành phố đáng sống nhất Việt Nam.',
        img_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000', content: { blocks: [] }
      }
    ];
    for (const b of blogs) await blogRepo.save(b);
    console.log(`✅ Đã tạo ${blogs.length} Bài Viết Blog`);

    console.log('🚀 HOÀN THÀNH SEEDING DỮ LIỆU CHUẨN CAO CẤP!');
  } catch (error) {
    console.error('❌ LỖI NGHIÊM TRỌNG: ', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Đã ngắt kết nối Database.');
  }
}

seed();
