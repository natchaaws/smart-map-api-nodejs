const pool = require("../config/database");

const getProvinceId = async (provinceName) => {
  const query = `
    SELECT id 
    FROM public.a_provinces 
    WHERE name_th = $1;
  `;
  const values = [provinceName];
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log(`${provinceName}, ${result.rows.length} provinces found`);
    return result.rows[0].id;
  } else {
    console.log(`Province ${provinceName} not found`);
    return null; // ถ้าไม่พบจังหวัด ให้รีเทิร์น null
  }
};

const getGeographyByProvinceId = async (provinceId) => {
  const query = `
      SELECT geography_id
	FROM public.a_provinces
       WHERE id = $1;
    `;
  const values = [provinceId];
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log(
      `Geography found for province ID ${provinceId}:`,
      result.rows[0].geography_id
    );
    return result.rows[0].geography_id; // Return geography information
  } else {
    console.log(`No geography found for province ID ${provinceId}`);
    return null; // If no geography found, return null
  }
};

const cleanAmphureName = (amphureName) => {
  // ลบคำว่า "เขต" หรือ "อำเภอ" และลบช่องว่างทั้งหมดในชื่ออำเภอ
  return amphureName
    .replace(/^(เขต|อำเภอ)\s*/, "")
    .replace(/\s+/g, "")
    .trim();
};

const getAmphureId = async (provinceId, amphureName) => {
  const cleanedAmphureName = cleanAmphureName(amphureName); // ทำความสะอาดชื่ออำเภอ
  const query = `
    SELECT id 
    FROM public.a_amphures 
    WHERE province_id = $1 AND name_th ILIKE '%' || $2 || '%';
  `;
  const values = [provinceId, cleanedAmphureName];
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log(
      `${amphureName}, ${result.rows.length} amphures found in province ${provinceId}`
    );
    return result.rows[0].id;
  } else {
    console.log(
      `Amphure ${amphureName} not found in province with ID ${provinceId}`
    );
    return null; // ถ้าไม่พบอำเภอ ให้รีเทิร์น null
  }
};

const cleanTambonName = (tambonName) => {
  // ลบช่องว่างทั้งหมดในชื่อตำบล เพื่อให้การค้นหาทำงานได้แม่นยำขึ้น
  return tambonName
    .replace(/^(แขวง|ตำบล)\s*/, "")
    .replace(/\s+/g, "")
    .trim();
};

const getTambonId = async (amphureId, tambonName) => {
  const cleanedTambonName = cleanTambonName(tambonName); // ทำความสะอาดชื่อ tambon
  const query = `
      SELECT id 
      FROM public.a_tambon 
      WHERE amphure_id = $1 AND name_th ILIKE '%' || $2 || '%';
    `;
  const values = [amphureId, cleanedTambonName];
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log(
      `${cleanedTambonName}, ${result.rows.length} tambons found in amphure ${amphureId}`
    );
    return result.rows[0].id;
  } else {
    console.log(
      `Tambon ${tambonName} not found in amphure with ID ${amphureId}`
    );
    return null; // ถ้าไม่พบตำบล ให้รีเทิร์น null
  }
};

module.exports = {
  getProvinceId,
  getAmphureId,
  getTambonId,
  getGeographyByProvinceId,
};
