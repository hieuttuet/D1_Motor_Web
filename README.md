B1:Cài Node.js    
Sau đó kiểm tra bằng cmd:    
node -v    
npm -v    

B2: Cài PM2 + PM2 WINDOWN SERVICE bằng lệnh:  
npm install pm2 -g  
npm install -g pm2 pm2-windows-service  

B3: Tạo Windows Service chạy PM2  
pm2-service-install -n D1_Motor_Web  

B4: Install ở thư mục backend  
npm install

B5:Start ứng dụng NodeJS với PM2  
cd C:\it\D1_Motor_Web\backend
pm2 start server.js --name D1_Motor_Web
pm2 save

B6: Mở port Windows Firewall (nếu cần truy cập LAN)  
netsh advfirewall firewall add rule name="NodeJS 8000" dir=in action=allow protocol=TCP localport=8000  

B7: Quản lý service   
net start D1_Motor_Web
net stop D1_Motor_Web
pm2 logs D1_Motor_Web




