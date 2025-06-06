-- Thêm dữ liệu vào bảng users (người dùng)
INSERT INTO users (id, full_name, phone_number, email, password, address, user_type, status)
VALUES
(1, 'Nguyễn Văn A', '0912345678', 'nguyenvana@gmail.com', '123', '123 Đường Ba Trạc, Quận 8, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(2, 'Trần Thị Bích', '0987654321', 'tranthib@gmail.com', '123', '456 Lê Lợi, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(3, 'Lê Văn Cường', '0909123456', 'levanc@gmail.com', '123', '789 Nguyễn Trãi, Quận 5, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(4, 'Phạm Thị Dung', '0932123456', 'phamthid@gmail.com', '123', '101 Võ Văn Tần, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(5, 'Hoàng Văn Em', '0978123456', 'hoangvane@gmail.com', '123', '202 Trần Hưng Đạo, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(6, 'Võ Thị Fương', '0922345678', 'vothif@gmail.com', '123', '303 Lý Thường Kiệt, Quận 10, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(7, 'Bùi Văn Giang', '0945678901', 'buivang@gmail.com', '123', '404 Hai Bà Trưng, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(8, 'Ngô Thị Hạnh', '0967890123', 'ngothih@gmail.com', '123', '505 Cách Mạng Tháng 8, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(9, 'Đặng Văn Ích', '0918901234', 'dangvani@gmail.com', '123', '606 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(10, 'Lý Thị Kiều', '0989012345', 'lythik@gmail.com', '123', '707 Lê Hồng Phong, Quận 10, TP.HCM', 'EMPLOYEE', 'ACTIVE'),
(11, 'admin', '0324564621', 'admin@gmail.com', '123', '707 Lê Hồng Phong, Quận 10, TP.HCM', 'EMPLOYEE', 'ACTIVE');
-- Insert into customers
INSERT INTO customers ( user_id)
VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9);
-- Thêm dữ liệu vào bảng employees (nhân viên)
INSERT INTO employees (user_id, position)
VALUES
(10, 'Nhân viên'),
(11, 'Quản lí');
-- Thêm thêm dữ liệu vào bảng partners (đối tác)
INSERT INTO partners (id, partner_name, address, phone_number, partnership_status, note)
VALUES
(1, 'Công Ty TNHH ABC', '111 Nguyễn Huệ, Quận 1, TP.HCM', '0901234567', 'ACTIVE', 'Đối tác cung cấp xe uy tín'),
(2, 'Công Ty Cổ Phần XYZ', '222 Trần Phú, Quận 5, TP.HCM', '0912345678', 'ACTIVE', 'Hợp tác dài hạn'),
(3, 'Doanh Nghiệp Tư Nhân DEF', '333 Lê Lợi, Quận 1, TP.HCM', '0923456789', 'INACTIVE', 'Tạm dừng hợp tác'),
(4, 'Công Ty TNHH Vận Tải Sài Gòn', '444 Cách Mạng Tháng 8, Quận 10, TP.HCM', '0934567890', 'ACTIVE', 'Chuyên cho thuê xe tải và xe du lịch'),
(5, 'Công Ty Cổ Phần Dịch Vụ Ánh Dương', '555 Nguyễn Trãi, Quận 5, TP.HCM', '0945678901', 'ACTIVE', 'Đối tác lâu năm trong lĩnh vực vận chuyển'),
(6, 'Doanh Nghiệp Tư Nhân Thành Công', '666 Lý Thường Kiệt, Quận Tân Bình, TP.HCM', '0956789012', 'INACTIVE', 'Tạm ngừng hợp tác do tái cơ cấu nội bộ');
-- Insert into consignment_contracts
INSERT INTO consignment_contracts (id, import_price, start_date, end_date, termination_date, payment_cycle, status, partner_id)
VALUES
(1, 5000000.0, '2025-01-01', '2025-12-31', NULL, 'MONTHLY', 'ACTIVE', 1),
(2, 6000000.0, '2025-02-01', '2025-11-30', NULL, 'MONTHLY', 'ACTIVE', 2),
(3, 4500000.0, '2025-03-01', '2025-09-30', NULL, 'MONTHLY', 'ACTIVE', 4),
(4, 7000000.0, '2024-06-01', '2025-05-31', NULL, 'MONTHLY', 'ACTIVE', 5),
(5, 5500000.0, '2024-04-01', '2025-06-30', '2025-04-01', 'MONTHLY', 'TERMINATED', 3),
(6, 8000000.0, '2025-04-01', '2026-03-31', '2025-04-15', 'MONTHLY', 'TERMINATED', 6);
-- Insert into vehicles
INSERT INTO vehicles (id, name, license_plate, brand, type, seat_count, manufacture_year, description, rental_price, vehicle_condition, owner_type, status, consignment_contract_id)
VALUES
(1, 'Toyota Innova', '51H-12345', 'Toyota', 'MPV', 7, 2020, 'Toyota Innova là dòng xe MPV rất phổ biến tại Việt Nam, được nhiều gia đình và doanh nghiệp tin dùng. Xe có thiết kế rộng rãi với 7 chỗ ngồi thoải mái, khoang hành lý lớn phù hợp cho những chuyến đi xa. Động cơ của Innova được đánh giá là bền bỉ, dễ bảo dưỡng. Ngoài ra, xe còn trang bị nhiều tính năng an toàn cơ bản, phù hợp với nhu cầu sử dụng hằng ngày. Đây là sự lựa chọn đáng tin cậy cho khách hàng muốn thuê xe gia đình.', 800000.0, 'GOOD', 'STORE', 'RENTED', null),
(2, 'Honda CR-V', '51G-67890', 'Honda', 'SUV', 5, 2021, 'Honda CR-V mang lại trải nghiệm lái mượt mà và hiện đại. Xe có khoang nội thất tiện nghi, tích hợp nhiều công nghệ như hỗ trợ giữ làn, cảnh báo va chạm và phanh tự động. Không gian bên trong rộng rãi, ghế ngồi thoải mái cho cả 5 hành khách. CR-V có kiểu dáng thể thao, động cơ tiết kiệm nhiên liệu. Phù hợp với nhóm khách gia đình hoặc khách công tác dài ngày.', 1000000.0, 'EXCELLENT', 'STORE', 'RENTED', null),
(3, 'Hyundai Accent', '51F-23456', 'Hyundai', 'Sedan', 5, 2019, 'Hyundai Accent là chiếc sedan nhỏ gọn lý tưởng cho các tuyến đường nội thành. Với thiết kế hiện đại và khả năng vận hành ổn định, Accent đáp ứng tốt nhu cầu đi lại cá nhân hoặc theo nhóm nhỏ. Xe có khả năng tiết kiệm nhiên liệu tốt, đồng thời nội thất được thiết kế tối ưu hóa không gian. Đây là mẫu xe phù hợp cho người mới lái hoặc khách cần di chuyển linh hoạt.', 600000.0, 'GOOD', 'STORE', 'RENTED', null),
(4, 'Kia Seltos', '51E-78901', 'Kia', 'SUV', 5, 2022, 'Kia Seltos sở hữu ngoại hình bắt mắt với thiết kế trẻ trung, thể thao. Nội thất bên trong hiện đại, được trang bị màn hình giải trí trung tâm và hệ thống âm thanh sống động. Seltos phù hợp cho các chuyến đi du lịch hoặc công tác. Khả năng vận hành ổn định trên nhiều loại địa hình là một điểm mạnh lớn. Xe còn tích hợp nhiều tính năng an toàn như cảm biến, camera lùi.', 900000.0, 'EXCELLENT', 'STORE', 'RENTED', null),
(5, 'Ford Ranger', '51D-34567', 'Ford', 'Pickup', 5, 2020, 'Ford Ranger là dòng bán tải mạnh mẽ, phù hợp cho những chuyến đi xa hoặc chuyên chở hàng hóa. Xe có động cơ Diesel bền bỉ, tiết kiệm nhiên liệu. Cabin rộng rãi, tiện nghi với các trang bị hiện đại như màn hình cảm ứng, điều hòa tự động. Ranger có khả năng vượt địa hình tốt, gầm cao giúp di chuyển dễ dàng ở vùng cao hay vùng ngập.', 1200000.0, 'GOOD', 'STORE', 'RENTED', null),
(6, 'Mazda CX-5', '51C-89012', 'Mazda', 'SUV', 5, 2021, 'Mazda CX-5 nổi bật với thiết kế KODO sang trọng, tinh tế. Nội thất bọc da cao cấp, vô-lăng tích hợp nút điều khiển và hệ thống giải trí hiện đại. Xe vận hành êm ái, cách âm tốt, phù hợp cho khách hàng yêu cầu cao về trải nghiệm lái. CX-5 là lựa chọn tuyệt vời cho gia đình hoặc người đi công tác cần sự thoải mái và an toàn.', 950000.0, 'EXCELLENT', 'STORE', 'RENTED', null),
(7, 'Toyota Vios', '51B-45678', 'Toyota', 'Sedan', 5, 2018, 'Toyota Vios là mẫu sedan được ưa chuộng nhiều năm liền nhờ độ bền cao và chi phí sử dụng thấp. Xe có thiết kế đơn giản nhưng hiệu quả, vận hành nhẹ nhàng trong đô thị. Nội thất tiện nghi cơ bản, phù hợp với nhu cầu di chuyển hàng ngày. Vios là lựa chọn hàng đầu cho người cần thuê xe giá rẻ và ổn định.', 550000.0, 'GOOD', 'STORE', 'RENTED', null),
(8, 'VinFast Lux A2.0', '51A-90123', 'VinFast', 'Sedan', 5, 2020, 'VinFast Lux A2.0 mang lại trải nghiệm lái cao cấp nhờ khung gầm được phát triển từ BMW. Xe có nội thất rộng rãi, hệ thống giải trí cảm ứng, điều hòa tự động 2 vùng. Động cơ mạnh mẽ giúp xe tăng tốc nhanh, cảm giác lái đầm chắc. Đây là mẫu xe sedan cao cấp phù hợp với khách hàng doanh nhân hoặc người muốn trải nghiệm thương hiệu Việt.', 850000.0, 'GOOD', 'STORE', 'ACTIVE', null),
(9, 'Mitsubishi Xpander', '51K-56789', 'Mitsubishi', 'MPV', 7, 2021, 'Mitsubishi Xpander được biết đến với khả năng chở 7 người thoải mái, thiết kế hiện đại và tiết kiệm nhiên liệu. Xe có khoang hành lý rộng, phù hợp cho gia đình hoặc nhóm du lịch. Nội thất bền bỉ, vận hành ổn định, giá thuê hợp lý. Đây là mẫu MPV phổ thông rất được ưa chuộng tại Việt Nam.', 750000.0, 'GOOD', 'STORE', 'ACTIVE', null),
(10, 'Suzuki Ertiga', '51M-01234', 'Suzuki', 'MPV', 7, 2020, 'Suzuki Ertiga là mẫu xe 7 chỗ với giá thành hợp lý, thích hợp cho khách hàng thuê đi tỉnh hoặc đi du lịch cuối tuần. Xe có động cơ tiết kiệm, nội thất bố trí hợp lý, điều hòa 2 vùng cho hàng ghế sau. Ertiga nhẹ nhàng, dễ lái, phù hợp với nhu cầu sử dụng đơn giản.', 700000.0, 'GOOD', 'PARTNER', 'ACTIVE', null),
(11, 'Hyundai Tucson', '52A-67890', 'Hyundai', 'SUV', 5, 2022, 'Hyundai Tucson mang dáng vẻ hiện đại, đậm chất châu Âu. Xe có không gian rộng rãi, trang bị hệ thống an toàn chủ động như cảnh báo điểm mù, hỗ trợ đỗ xe và cruise control thông minh. Động cơ mạnh mẽ, vận hành mượt mà. Tucson thích hợp cho những khách hàng yêu thích trải nghiệm cao cấp và an toàn.', 970000.0, 'EXCELLENT', 'PARTNER', 'ACTIVE', null),
(12, 'Kia Carnival', '52B-12345', 'Kia', 'MPV', 7, 2023, 'Kia Carnival là mẫu xe gia đình cao cấp với thiết kế đậm chất sang trọng. Khoang nội thất cực kỳ rộng rãi, đầy đủ tiện nghi như ghế chỉnh điện, màn hình giải trí cho hàng ghế sau và điều hòa đa vùng. Xe phù hợp cho các chuyến du lịch dài hoặc đưa đón khách VIP.', 1100000.0, 'EXCELLENT', 'PARTNER', 'ACTIVE', null),
(13, 'Toyota Fortuner', '52C-23456', 'Toyota', 'SUV', 7, 2021, 'Toyota Fortuner là mẫu SUV 7 chỗ mạnh mẽ, gầm cao, khả năng vận hành đa địa hình vượt trội. Nội thất tiện nghi, có nhiều tính năng hỗ trợ lái và an toàn. Xe thích hợp cho cả mục đích gia đình và công việc cần di chuyển đường dài hoặc khu vực đồi núi.', 1150000.0, 'GOOD', 'PARTNER', 'ACTIVE', null),
(14, 'Honda City', '52D-34567', 'Honda', 'Sedan', 5, 2019, 'Honda City là lựa chọn lý tưởng cho khách hàng trẻ năng động. Với thiết kế thể thao, động cơ tiết kiệm và khả năng xử lý linh hoạt, City đáp ứng tốt nhu cầu di chuyển trong đô thị. Nội thất đơn giản nhưng tiện nghi, dễ sử dụng.', 580000.0, 'GOOD', 'PARTNER', 'INACTIVE', null),
(15, 'Mazda 3', '52E-45678', 'Mazda', 'Sedan', 5, 2020, 'Mazda 3 mang đậm phong cách thiết kế KODO sắc sảo, nội thất hiện đại như một chiếc xe sang. Hệ thống cách âm tốt, cảm giác lái mượt mà và tiết kiệm nhiên liệu. Đây là mẫu xe rất được ưa chuộng trong phân khúc sedan hạng C.', 750000.0, 'GOOD', 'PARTNER', 'INACTIVE', null);

-- Insert into payment_partners
-- INSERT INTO payment_partners (id, period, total_rental_days, start_period, end_period, total_amout, status, created_date)
-- VALUES
-- (1, '2025-M1', 30, '2025-01-01', '2025-01-31', 15000000.0, 'APPROVED', '2025-02-01'),
-- (2, '2025-M2', 30, '2025-02-01', '2025-02-27', 18000000.0, 'APPROVED', '2025-03-01'),
-- (3, '2025-M3', 30, '2025-03-01', '2025-03-31', 20000000.0, 'APPROVED', '2025-04-01'),
-- (4, '2025-M4', 30, '2025-04-01', '2025-04-30', 15000000.0, 'APPROVED', '2025-05-01'),
-- (5, '2025-M5', 30, '2025-05-01', '2025-05-31', 18000000.0, 'APPROVED', '2025-06-01'),
-- (6, '2025-M6', 30, '2025-03-01', '2025-06-30', 20000000.0, 'APPROVED', '2025-07-01');
-- Insert into consignment_payments
-- INSERT INTO consignment_payments (id, rental_days, payment_amount, consignment_contract_id, payment_partner_id)
-- VALUES
-- (1, 30, 5000000.0, 1, 1),
-- (2, 30, 6000000.0, 2, 2),
-- (3, 30, 4500000.0, 3, 3),
-- (4, 30, 7000000.0, 4, 4),
-- (5, 30, 5500000.0, 5, 5),
-- (6, 30, 8000000.0, 6, 6);

-- Rental Contract for Toyota Innova (800,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (1,'2025-05-09', 480000.0, 1920000.0, 2400000.0, 'BOOKING', 1, null);

-- Rental Contract for Honda CR-V (1,000,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (2,'2025-05-09', 600000.0, 2400000.0, 3000000.0, 'BOOKING', 2, null);

-- Rental Contract for Hyundai Accent (600,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (3,'2025-05-09', 360000.0, 1440000.0, 1800000.0, 'BOOKING', 3, null);

INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (4,'2025-05-09', 840000.0, 3360000.0, 4200000.0, 'ACTIVE', 4, 11);

-- Rental Contract for Honda CR-V (1,000,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (5,'2025-05-09', 600000.0, 2400000.0, 3000000.0, 'ACTIVE', 5, 11);


-- Insert into contract_vehicle_details
INSERT INTO contract_vehicle_details (id, rental_price, start_date, end_date, total_estimated_amount, deposit_amount, due_amount, status, vehicle_id, rental_contract_id)
VALUES
(1, 800000.0, '2025-05-09', '2025-05-11', 2400000.0, 480000.0, 1920000.0, 'BOOKING', 1, 1),
(2, 1000000.0, '2025-05-09', '2025-05-11', 3000000.0, 600000.0, 2400000.0, 'BOOKING', 2, 2),
(3, 600000.0, '2025-05-09', '2025-05-11', 1800000.0, 360000.0, 1440000.0, 'BOOKING', 3, 3),
(4, 900000.0, '2025-05-09', '2025-05-10', 1800000.0, 360000.0, 1440000.0, 'ACTIVE', 4, 4),
(5, 1200000.0, '2025-05-09', '2025-05-10', 2400000.0, 480000.0, 1920000.0, 'ACTIVE', 5, 4),
(6, 950000.0, '2025-05-09', '2025-05-10', 1900000.0, 380000.0, 1520000.0, 'ACTIVE', 6, 5),
(7, 550000.0, '2025-05-09', '2025-05-10', 1100000.0, 220000.0, 880000.0, 'ACTIVE', 7, 5);

-- Insert into penalty_types
INSERT INTO penalty_types (id, name, default_amount, description)
VALUES
(1, 'Vi phạm giao thông', 500000.0, 'Phạt do vi phạm luật giao thông'),
(2, 'Hư hỏng xe', 1000000.0, 'Phạt do làm hư hỏng xe'),
(3, 'Trễ hạn trả xe', 200000.0, 'Phạt do trả xe muộn'),
(4, 'Không đổ đầy xăng khi trả xe', 300000.0, 'Phạt do không đổ đầy bình xăng khi hoàn trả xe'),
(5, 'Làm mất giấy tờ xe', 800000.0, 'Phạt do làm mất giấy đăng ký xe hoặc bảo hiểm xe'),
(6, 'Làm mất phụ kiện đi kèm', 200000.0, 'Phạt do làm mất phụ kiện như dây sạc, đồ cứu hộ, thảm sàn'),
(7, 'Không vệ sinh xe khi trả', 100000.0, 'Phạt do không vệ sinh sạch sẽ xe khi hoàn trả'),
(8, 'Lái xe ngoài khu vực cho phép', 600000.0, 'Phạt do đưa xe ra ngoài khu vực đã cam kết'),
(9, 'Chở quá số người quy định', 400000.0, 'Phạt do chở quá số lượng hành khách cho phép theo thiết kế xe');
-- Insert into penalties
-- INSERT INTO penalties (id, penalty_amount, note, contract_vehicle_detail_id, penalty_type_id)
-- VALUES
-- (1, 500000.0, 'Chạy quá tốc độ', 1, 1),
-- (2, 1000000.0, 'Vỡ gương chiếu hậu', 2, 2),
-- (3, 200000.0, 'Trả xe muộn 1 ngày', 3, 3);

-- Insert into collaterals
INSERT INTO collaterals (id, description, rental_contract_id)
VALUES
(1, 'CMND bản sao', 1),
(2, 'Hộ khẩu bản sao', 2),
(3, 'Sổ hồng bản sao', 3),
(4, 'Hộ khẩu bản sao',4),
(5, 'CMND bản sao', 4),
(6, 'CMND bản sao', 5),
(7, 'Hộ khẩu bản sao',5);

-- Insert into invoice_details
-- INSERT INTO invoice_details (id, payment_date, penalty_amount, due_amount, total_amount, employee_id, contract_vehicle_detail_id)
-- VALUES
-- (1, '2025-05-12', 500000.0, 1920000.0, 2420000.0, 10, 1),
-- (2, '2025-05-12', 1000000.0, 2400000.0, 3400000.0, 10, 2),
-- (3, '2025-05-12', 200000.0, 1440000.0, 1640000.0, 10, 3);