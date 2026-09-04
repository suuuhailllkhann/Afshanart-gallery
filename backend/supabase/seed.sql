-- Afshan Art Gallery — seed data
-- Migrates everything currently hardcoded in the HTML into the database,
-- so switching to dynamic rendering doesn't lose or change anything.
-- Run this AFTER schema.sql, once, in the Supabase SQL Editor.

-- ============================================================
-- PRODUCTS (Shop / Featured Arts)
-- ============================================================

insert into products (category, title, price, sold_out, image_url) values
  ('Painting', 'Daydream', 2900, false, 'assets/img/d10243de-ed08-4723-9074-95868dd95e7f.jpg'),
  ('Painting', 'Climate Change', 1500, false, 'assets/img/fdedda0d-3ee3-4b2c-8276-4b6f5235762d.jpg'),
  ('Painting', 'Travel Diaries', 899, false, 'assets/img/feaf11a0-0d48-4d0f-864f-0ae984cf3b5e.jpg'),
  ('Painting', 'Nature', 3200, true, 'assets/img/8388e767-754c-45ec-9864-36ba8e23e710.jpg'),
  ('Painting', 'Peace and Justice', 1500, false, 'assets/img/198f5f2d-930e-4159-923c-677f2af4ac6f.jpg'),
  ('Painting', 'Ashoka Stamb', 4000, false, 'assets/img/55fa123f-9868-4db9-a081-4e3adb9a7b51.jpg'),
  ('Model', 'Noor Mosque Sharjah', 1500, false, 'assets/img/3ba0fbd7-317e-4f75-bbfa-6d456ac7801d.jpg'),
  ('Painting', 'Greek Apollo', 1500, false, 'assets/img/06bf56ad-0de4-4126-8027-a306cbf08311.jpg'),
  ('Painting', 'Muhammed SAWS', 550, false, 'assets/img/ea630a14-9a36-4a9c-b05d-69e3cbe3b8db.jpg'),
  ('Painting', 'Rhythm of Success', 2500, false, 'assets/img/65397ec4-7671-4e16-ab64-9e4b4cad40a2.jpg'),
  ('Painting', 'Arabic Calligraphy Gold Leaf', 1500, false, 'assets/img/8f0dfd31-04d1-467e-9ace-bf080f2d0a44.jpg'),
  ('Cup Painting', 'Mandla mug Purple', 150, false, 'assets/img/3710935e-5391-4fac-b442-5328e9401d84.jpg'),
  ('Cup Painting', 'Mandla Mug Blue', 150, false, 'assets/img/05b48eff-c8fd-46f3-8294-73c09a5b8145.jpg'),
  ('Cup Painting', 'Mandla Mug Pink', 150, false, 'assets/img/0eab8c19-9a68-4d01-9a06-8f3bd74ad39c.jpg'),
  ('Painting', 'Crusade', 1000, false, 'assets/img/90136daa-5dfd-4e30-80da-bde025f6b339.jpg'),
  ('Painting', 'Dome of Rock', 4000, true, 'assets/img/78433209-f1e3-4e2e-8f33-544f991ec39f.jpg'),
  ('Painting', 'Arabic Calligraphy Gold Leaf', 500, false, 'assets/img/47b91a93-832c-429e-8759-f0eb5e694bd1.jpg'),
  ('Painting', 'Blue Jay', 850, false, 'assets/img/afef5747-c566-4669-8b65-25be6d0ee87c.jpg'),
  ('Painting', 'Greek Eye Mandala', 500, false, 'assets/img/c8be8038-b25d-4ef2-a83d-cb602e91515b.jpg'),
  ('Painting', 'Galaxy Mandala', 500, false, 'assets/img/83ca1a2a-fd7c-411b-b8d9-455b8ffc0068.jpg'),
  ('Painting', 'Kaaba Painting', 1500, false, 'assets/img/c5a50c13-7764-4995-a509-d6b5b47f166e.jpg'),
  ('Painting', 'Aesthetic Autumn', 1500, true, 'assets/img/44f54cbb-6848-4568-af29-91f947b4fa1f.jpg');

-- ============================================================
-- BLOG POSTS (press / exhibitions / awards)
-- ============================================================

insert into blog_posts (title, subtitle, description, image_url, image_url_2, link_url, link_label, link2_url, link2_label) values
  ('EMERGING ARTIST AFSHAN NAWAZ KHAN', 'featured in Gulf Today - August 31, 2023.',
   'Emerging artist Afshan Nawaz Khan is a star in the established art world',
   'assets/img/94450d94-102c-4db1-93a6-36147f75a07b.jpg', 'assets/img/d5166931-ab8b-469e-a65f-e5427a60cce2 (1).jpg',
   'https://www.gulftoday.ae/culture/2023/08/31/emerging-artist-afshan-nawaz-khan-is-a-star-in-the-established-art-world?fbclid=PAAabFeOJ2f1QjcoZH3w-FpOKsIMoiSgqZ9OXv0AXn0tdR-FePqTNdnzW8ffo',
   'READ THE ARTICLE', null, null),

  ('ARABIC FORUM', 'featured in Al Khaleej - October 8, 2023.',
   'Fortunate enough to meet and welcome Ruler of Sharjah H.H Sheikh Sultan Bin Mohammed Bin Sultan Al Qasimi at Sharjah Education Academy for Arabic forum',
   'assets/img/5e897a4a-b2da-4473-956d-7188d052dec3.jpg', 'assets/img/6b92914b-2042-43f4-83af-a5ba1ba45ac2.jpg',
   'https://youtu.be/k7RSKVuhSr4?si=0mmT3SPtAKTf14ul', 'WATCH THE FULL VIDEO',
   'https://www.instagram.com/reel/CyQotz_Syrk/?igshid=MzRlODBiNWFlZA==', 'WATCH MY SPEECH'),

  ('MAGRUDY''S AUGUST EDITION', 'August 2023',
   'Bagged 3rd place as winner for Magrudys August Edition Art gallery Jumeirah Dubai',
   'assets/img/0fb329ca-1220-41a4-8d78-e28f030b2a2b.jpg', null, null, null, null, null),

  ('FOREVER SOUL EXHIBITION', '2023',
   'Certificate of Participation from Reem Art Gallery and Artezaar for participating in the Forever Soul Exhibition 2023.',
   'assets/img/9c0599cc-6e4c-48b2-a9ba-35648676b529.jpg', null, null, null, null, null),

  ('CELEBRATING ARTISTIC EXPRESSION', '2023',
   'Certificate of Participation for successful participation in the ''Celebrating Artistic Expression'' in collaboration with Artezaar at Gallery 76-DIAC (Dubai International Art Centre since 1976).',
   'assets/img/2b0acaa7-6001-429f-9d7a-ad8ce3f38ab4.jpg', null, null, null, null, null),

  ('INTERSCHOOL SURAH ILLUSTRATION COMPETITION', 'October 28, 2023',
   'Alhamdulillah Afshan Nawaz Khan bagged 2nd Prize in Surah Illustation Interschool Competition.',
   'assets/img/533b27ae-010b-48aa-89f3-c56699d34713.jpg', null, null, null, null, null),

  ('QUEEN ELIZABETH EXHIBITION', 'June, 2023',
   'Certificate of Participation for successful participation in the ''Seasons'' exhibition organised by DIAC in collaboration with QUEEN ELIZABETH 2 HOTEL',
   'assets/img/c8deb62c-db76-4820-90eb-71eb966f0ecf.jpg', null, null, null, null, null),

  ('BHARAT UTSAV BY FUNUN ARTS', null,
   'Certificate of Appreciation for participating in the art exhibition of Bharat Utsav organised by Funun Arts Group along with D com designs at Anantara Hotel, Downtown, Dubai.',
   'assets/img/e6f12058-489e-4ad0-bda3-77fc5c9d8de5.jpg', null, null, null, null, null),

  ('ARTBEAT', null,
   'Certificate of Achievement from Artbeat for bagging 3rd place in kids category for outstanding creativity and skillful expression in the field of art.',
   'assets/img/0496516f-1ded-4005-8d3a-df772cb78500.jpg', null, null, null, null, null),

  ('ART THERAPHY', 'July 31, 2013',
   'Certificate of Recognition for participating in the live painting event, "Art Therapy" organised by Funun Arts Group along with Gargash Hospital',
   'assets/img/423190af-ddee-4593-aef5-351224b1e550.jpg', null, null, null, null, null),

  ('WORLD ART DUBAI', '2023',
   'Certificate of appreciation from World Art Dubai and Magzoid magazine for exhibiting exceptional artworks at World Art Dubai 2023 at Dubai World Trade Centre.',
   'assets/img/7c503ce9-7a5c-4a2f-a841-4887ceffe34f.jpg', null, null, null, null, null),

  ('EKTA 2023', null,
   'Certificate of Participation for participating in Ekta 2023 to celebrate unity and diversity with art in an immersive exhibition of exceptional artworks at the Theatre Of Digital Arts (TODA), Jumeriah.',
   'assets/img/da0f22d4-7df6-4c66-8f9c-2680f80806c8.jpg', null, null, null, null, null),

  ('ARTEZAAR!', null,
   'Certificate of Participation in the Nature''s Palette 2023 at Reem Art Gallery along with Artezaar.co',
   'assets/img/8faff369-cf0e-4d5b-8ccc-dbb25c93f7a3.jpg', null, null, null, null, null),

  ('ARTOZE INTER SCHOOL ART EXHIBITION', 'September 2023',
   'Certificate of appreciation for being one of the 30 finalists of out of 2500 entries of Create 2.0 in Artoze Inter-School Art Exhibition and Competition',
   'assets/img/05055007-2e20-4e88-a95e-a31cb6a4ddc7.jpg', null, null, null, null, null),

  ('EXPRESSIONS', 'September 2023',
   'Certificate of Participation for participating in the Art Exhibition ''Expressions'', organised by Funun Arts Group with Novotel Sharjah Expo Centre',
   'assets/img/e02add7e-bd73-4606-b1a7-b6a4bc5e1a70.jpg', null, null, null, null, null),

  ('A JOURNEY THROUGH CREATIVITY', 'September 2023',
   'Certificate of Participation for successful participation in ''A journey through creativity'' Exhibition organised by DIAC in collaboration with The H Dubai Hotel',
   'assets/img/d2075280-5012-49a2-bc61-11012ecd0033.jpg', null, null, null, null, null);

-- ============================================================
-- STORY CONTENT (singleton row for "My Story" page)
-- ============================================================

insert into story_content (id, quote, body) values (
  1,
  'ART IS THE HEART AND SOUL OF AN ARTIST',
  $body$I, Afshan Nawaz Khan @cre8ivekidcreations now 14, young emerging artist, pursuing my higher school studies at Our Own English High School Sharjah. I'm a self taught artist, who loves to paint, sketch, do Calligraphy and draw mandalas. I've won multiple awards and participation certificates for exhibiting my artworks.

I had always been interested in art since a very young age but at the age of nine my interest in art reach its peak as I was able to express my ideas on canvas. The beauty of nature inspired me to paint and explore art. Like the changing shades of ocean, sunsets and basically all the elements of nature amused me. Along with this I'm a Bibliophile and love to read lot of books which creates certain images in my mind which I depict through art. My parents noticed my hidden talent and started sharing it on Instagram for which I received positive responses which inspired me to create more.

I've won many prizes in Inter and Intra school competitions. I have also participated in many art exhibitions and have received participation certificates for it. Recently I've exhibited my artwork in World Art Dubai 2023 which was an incredible experience as an artist. Under one roof I was able to meet global artists from around the world. Along with this I've participated and received certificate for the exceptional 360°immersive display of my artwork at Theatre of Digital Art Dubai for Ekta23. It was very fortunate for me to have participate and be a part of Exhibition hosted by Queen Elizabeth 2 Hotel and Dubai International Art Centre which was unique opportunity of its kind. Recently, exhibited my Ashoka Stambh painting for Bharat utsav 2023. I've also displayed my artworks in many art galleries like, DIAC , Funun Art Group, Reem gallery, and Artezaar. Currently my painting has been selected by Magrudys Jumeirah for August Edition Art Exhibition and will be display there from 31st August to 15th September.

I've participated in voluntary acts of live painting with people of determination at DIAC and give me opportunity to do live painting with Doctors and medical staff of Gargash hospital. It was fortunate enough to meet some eminent and incredible personalities: His Excellency Yakoob Al Ali, Mr. Faisal Abdul Qader, Mr. Ahmed Rukni, Mr. Khalil Abdul Wahid, Ms. Maitha Al Balooshi , Ms. Rafaah, and M.C. Bassim.

Working consistently hard on social media platform helped me to collaborate with many popular Art sharing pages. Along with this, I was fortunate enough to sell my paintings and work.

I've participated recently in Sharjah Education Academy and was fortunate enough to welcome and greet the Ruler and king of Sharjah His Highness Sheikh Sultan Bin Mohammed Bin Sultan Al Qasimi at Arabic Forum. Along with this my, my Noor Masjid model was on display at Sharjah Education Academy.

In addition to this, I've participated recently participated in The H Dubai art exhibition hosted by DIAC Dubai, Sharjah Novotel Expressions Art Exhibition hosted by Funun Art Group.$body$
)
on conflict (id) do update set
  quote = excluded.quote,
  body = excluded.body,
  updated_at = now();
