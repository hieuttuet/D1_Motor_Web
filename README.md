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
npm install --production

B6: Cài PM2 + PM2 WINDOWN SERVICE bằng lệnh:  
npm install -g pm2 pm2-windows-service  

B7: Thiết lập môi trường hệ thống cho PM2 (CMD quyền Admin)  
mkdir C:\pm2\pm2_home (tạo thư mục pm2_home)   
setx PM2_HOME "C:\pm2\pm2_home"  
quan trọng: Reset PC   

B8: Khởi chạy ứng dụng với PM2 (CMD backend quyền admin)    
cd C:\it\D1_Motor_Web\backend  
pm2 start server.js --name D1_Motor_Web     
pm2 save    

B9: Tạo Windows Service chạy PM2 ( CMD quyền admin ở bất kỳ đâu)  
pm2-service-install -n D1_Motor_Web  
Quan trọng: những cái nào có Y/N thì ấn Y không thì enter bỏ qua    
chú ý check đường dẫn thư mục pm2_home  

B10: Tắt firewall port  
Nếu cài eset thì mở port Windows Firewall   
netsh advfirewall firewall add rule name="NodeJS 8000" dir=in action=allow protocol=TCP localport=8000    

Note cách fix khi có vấn đề:  
pm2 delete D1_Motor_Web  
pm2-service-uninstall  
mkdir C:\pm2\pm2_home (tạo thư mục pm2_home)   
set PM2_HOME "C:\pm2\pm2_home"  
quan trọng: Reset PC   
cd C:\it\D1_Motor_Web\backend  
pm2 start server.js --name D1_Motor_Web     
pm2 save    
rồi làm B9 

Update New Ver SERVER  

B1: git pull    

B2: Buil Dist ở thư mục frontend  
cd /d C:\it\D1_Motor_Web\frontend   
npm install  
npm run build  

B3: Install dependencies ở thư mục backend  
npm install --production     

B4:   
pm2 reload D1_Motor_Web    
pm2 save  

Deloy New Web In SERVER  

Bước 1: Buil Dist ở thư mục frontend  
cd /d C:\it\D1_BGM_MES_WEB\frontend   
npm install  
npm run build    
Bước 2: Khởi chạy ứng dụng mới (CMD backend quyền admin)   
npm install --production  
pm2 start server.js --name D1_BGM_MES_WEB  
pm2 save








