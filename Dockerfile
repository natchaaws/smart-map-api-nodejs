# ใช้ Node.js เวอร์ชันล่าสุด
FROM node:20.12.2

# ตั้ง Working Directory ใน Container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install
# RUN npm rebuild bcrypt --build-from-source

# คัดลอกไฟล์แอปพลิเคชันทั้งหมดไปยัง container
COPY . .

# Expose พอร์ตที่แอปพลิเคชันรันอยู่
EXPOSE 3930

# รันแอปพลิเคชัน Node.js
CMD ["npm", "run", "serve"]
