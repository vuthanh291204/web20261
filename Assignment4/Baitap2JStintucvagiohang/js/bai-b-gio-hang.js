class GioHang {
	constructor() {
		this.dsDong = [];
	}

	// 1. Thêm sản phẩm vào giỏ
	them(sanPham, soLuong) {
		if (typeof soLuong !== "number" || !Number.isInteger(soLuong) || soLuong <= 0) {
			return false;
		}

		const dong = this.dsDong.find(item => item.id === sanPham.id);
		if (dong) {
			dong.soLuong += soLuong;
		} else {
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

	// 3. Tính tổng tiền
	tongTien() {
		return this.dsDong.reduce((tong, item) => tong + item.gia * item.soLuong, 0);
	}

	// 4. Thống kê theo loại
	thongKeTheoLoai() {
		const thongKe = {};
		for (const item of this.dsDong) {
			const tien = item.gia * item.soLuong;
			thongKe[item.loai] = (thongKe[item.loai] || 0) + tien;
		}
		return thongKe;
	}

	// 5. Dòng đắt nhất
	dongDatNhat() {
		if (this.dsDong.length === 0) {
			return null;
		}
		const maxDong = this.dsDong.reduce((max, item) => {
			const tienItem = item.gia * item.soLuong;
			const tienMax = max.gia * max.soLuong;
			return tienItem > tienMax ? item : max;
		});

		return {
			...maxDong,
			thanhTien: maxDong.gia * maxDong.soLuong
		};
	}

	// 6. Lấy danh sách kèm thành tiền (bản sao độc lập)
	layDanhSach() {
		return this.dsDong.map(item => ({
			...item,
			thanhTien: item.gia * item.soLuong
		}));
	}

	// 7. Xuất JSON
	xuatJSON() {
		return JSON.stringify(this.dsDong);
	}
}

// 8. Nạp giỏ hàng từ JSON
function napGioHang(chuoiJSON) {
	const gio = new GioHang();
	try {
		const mangDong = JSON.parse(chuoiJSON);
		if (Array.isArray(mangDong)) {
			gio.dsDong = mangDong.map(item => ({
				id: item.id,
				ten: item.ten,
				loai: item.loai,
				gia: item.gia,
				soLuong: item.soLuong
			}));
		}
	} catch (e) {
		console.error("Lỗi JSON:", e);
	}
	return gio;
}