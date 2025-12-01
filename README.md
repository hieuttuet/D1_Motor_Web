DEPLOY SERVER  

B1: Cài Node.js và Mariadb và Github        
Sau đó kiểm tra bằng cmd:    
node -v    
npm -v    

B2: Chạy file SQL truy cập database    

B3: Clone dự án trên git  
Quan trọng: Copy file .env vào thư mục gốc   

B4: Buil Dist ở thư mục frontend (không nên clone trên git)   
npm install  
npm run build  

B5: Install dependencies ở thư mục backend  
npm install

B6: Cài PM2 + PM2 WINDOWN SERVICE bằng lệnh:  
npm install -g pm2 pm2-windows-service  

B7: Start ứng dụng NodeJS với PM2 (chạy ở folder backend và quyền admin)  
mkdir C:\it\pm2_home (tạo thư mục pm2_home)   
setx PM2_HOME "C:\it\pm2_home"  
quan trọng: Reset PC   
cd C:\it\D1_Motor_Web\backend  
pm2 start server.js --name D1_Motor_Web     
pm2 save    


B8: Tạo Windows Service chạy PM2 ( CMD chạy với quyền admin ở bất kỳ đâu)  
pm2-service-install -n D1_Motor_Web  
Quan trọng: những cái nào có Y/N thì ấn Y không thì enter bỏ qua    
chú ý check đường dẫn thư mục pm2_home  

B9: Tắt firewall  
Nếu cài eset thì mở port Windows Firewall   
netsh advfirewall firewall add rule name="NodeJS 8000" dir=in action=allow protocol=TCP localport=8000    

Note cách fix khi có vấn đề:  
pm2 delete  
pm2-service-uninstall  
mkdir C:\it\pm2_home (tạo thư mục pm2_home)   
set PM2_HOME "C:\it\pm2_home"  
quan trọng: Reset PC   
cd C:\it\D1_Motor_Web\backend  
pm2 start server.js --name D1_Motor_Web     
pm2 save    
rồi làm B8


UPDATE SERVER  

B1: git pull    

B2: Buil Dist ở thư mục frontend
cd /d C:\it\D1_Motor_Web\frontend   
npm install  
npm run build  

B3: Install dependencies ở thư mục backend  
npm install --production     

B4:   
pm2 reload D1_Web_Motor    
pm2 save  








