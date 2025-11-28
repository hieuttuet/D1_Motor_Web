B1: Cài Node.js và Mariadb và Github        
Sau đó kiểm tra bằng cmd:    
node -v    
npm -v    

B2: Chạy file SQL truy cập database    

B3: Cài PM2 + PM2 WINDOWN SERVICE bằng lệnh:  
npm install -g pm2 pm2-windows-service  

B4: Clone dự án trên git  
Quan trọng: Copy file .env vào thư mục gốc   

B5: Buil Dist ở thư mục frontend (không nên clone trên git)   
npm install  
npm run build  

B6: Install dependencies ở thư mục backend  
npm install

B7: Start ứng dụng NodeJS với PM2 (chạy ở folder backend và quyền admin)  
mkdir C:\it\pm2_home (tạo thư mục pm2_home)   
setx PM2_HOME "C:\it\pm2_home"
cd C:\it\D1_Motor_Web\backend  
pm2 start server.js --name D1_Motor_Web     
pm2 save    

B8: Tạo Windows Service chạy PM2 ( CMD chạy với quyền admin ở bất kỳ đâu)  
pm2-service-install -n D1_Motor_Web  
nhập đường dẫn đến thư mục pm2_home     

B9: Tắt firewall
Nếu cài eset thì mở port Windows Firewall 
netsh advfirewall firewall add rule name="NodeJS 8000" dir=in action=allow protocol=TCP localport=8000  

Note: Quản lý service   
net start D1_Motor_Web
net stop D1_Motor_Web
pm2 logs D1_Motor_Web






