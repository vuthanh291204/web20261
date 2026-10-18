class GioHang {
	constructor() {
		// Lưu các dòng sản phẩm, mỗi dòng gồm: id, ten, loai, gia, soLuong
		this.dsDong = [];
	}

	// 1. Thêm sản phẩm vào giỏ
	them(sanPham, soLuong) {
		// Kiểm tra hợp lệ: kiểu number, là số nguyên, lớn hơn 0
		if (typeof soLuong !== "number" || !Number.isInteger(soLuong) || soLuong <= 0) {
			return false;
		}

		const dong = this.dsDong.find(item => item.id === sanPham.id);
		if (dong) {
			dong.soLuong += soLuong;
		} else {
			// Tạo bản sao độc lập với object bên ngoài
			this.dsDong.push({
				id: sanPham.id,
				ten: sanPham.ten,
				loai: sanPham.loai,
				gia: sanPham.gia,
				soLuong: soLuong
			});
		}
		return true;
	}

	// 2. Xoá dòng theo id
	xoa(id) {
		const viTri = this.dsDong.findIndex(item => item.id === id);
		if (viTri !== -1) {
			this.dsDong.splice(viTri, 1);
			return true;
		}
		return false;
	}

	// 3. Tính tổng tiền cả giỏ
	tongTien() {
		return this.dsDong.reduce((tong, item) => tong + item.gia * item.soLuong, 0);
	}

	// 4. Thống kê tổng tiền theo loại
	thongKeTheoLoai() {
		const thongKe = {};
		for (const item of this.dsDong) {
			const tien = item.gia * item.soLuong;
			thongKe[item.loai] = (thongKe[item.loai] || 0) + tien;
		}
		return thongKe;
	}

	// 5. Tìm dòng đắt nhất (thành tiền lớn nhất)
	dongDatNhat() {
		if (this.dsDong.length === 0) {
			return null;
		}

		// Giữ nguyên dòng đứng trước nếu thành tiền bằng nhau
		const maxDong = this.dsDong.reduce((max, item) => {
			const tienItem = item.gia * item.soLuong;
			const tienMax = max.gia * max.soLuong;
			return tienItem > tienMax ? item : max;
		});

		// Trả về bản sao có kèm thuộc tính thanhTien
		return {
			...maxDong,
			thanhTien: maxDong.gia * maxDong.soLuong
		};
	}

	// 6. Lấy danh sách các dòng kèm thành tiền (bản sao độc lập)
	layDanhSach() {
		return this.dsDong.map(item => ({
			...item,
			thanhTien: item.gia * item.soLuong
		}));
	}

	// 7. Xuất mảng các dòng thành chuỗi JSON (chỉ gồm 5 thuộc tính gốc)
	xuatJSON() {
		return JSON.stringify(this.dsDong);
	}
}

// 8. Hàm độc lập nạp dữ liệu từ chuỗi JSON tạo ra một đối tượng GioHang mới
function napGioHang(chuoiJSON) {
	const gio = new GioHang();
	try {
		const mangDong = JSON.parse(chuoiJSON);
		if (Array.isArray(mangDong)) {
			// Sao chép sâu/độc lập từng dòng để đảm bảo tính an toàn dữ liệu
			gio.dsDong = mangDong.map(item => ({
				id: item.id,
				ten: item.ten,
				loai: item.loai,
				gia: item.gia,
				soLuong: item.soLuong
			}));
		}
	} catch (e) {
		console.error("Lỗi cú pháp JSON:", e);
	}
	return gio;
}