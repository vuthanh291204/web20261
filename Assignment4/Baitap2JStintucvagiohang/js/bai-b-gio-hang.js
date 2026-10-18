/* BÀI B — VIẾT CODE: Giỏ hàng của xưởng in */

// ---------- DỮ LIỆU ĐÃ CHO (không sửa) ----------
const DANH_MUC = [
	{ id: "TC01", ten: "Thiệp cưới cotton", loai: "thiep cuoi", gia: 1500 },
	{ id: "TC02", ten: "Thiệp cưới kraft", loai: "thiep cuoi", gia: 900 },
	{ id: "DT01", ten: "Danh thiếp ép kim", loai: "danh thiep", gia: 1200 },
	{ id: "PB01", ten: "Phong bì lót lụa", loai: "phu kien", gia: 500 }
];


// ---------- PHẦN BẠN VIẾT ----------

class GioHang {
	constructor() {
		this.dsDong = [];
	}

	// 1. them(sanPham, soLuong)
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

	// 2. xoa(id)
	xoa(id) {
		const viTri = this.dsDong.findIndex(item => item.id === id);
		if (viTri !== -1) {
			this.dsDong.splice(viTri, 1);
			return true;
		}
		return false;
	}

	// 3. tongTien()
	tongTien() {
		return this.dsDong.reduce((tong, item) => tong + item.gia * item.soLuong, 0);
	}

	// 4. thongKeTheoLoai()
	thongKeTheoLoai() {
		const thongKe = {};
		for (const item of this.dsDong) {
			const tien = item.gia * item.soLuong;
			thongKe[item.loai] = (thongKe[item.loai] || 0) + tien;
		}
		return thongKe;
	}

	// 5. dongDatNhat()
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

	// 6. layDanhSach()
	layDanhSach() {
		return this.dsDong.map(item => ({
			...item,
			thanhTien: item.gia * item.soLuong
		}));
	}

	// 7. xuatJSON()
	xuatJSON() {
		return JSON.stringify(this.dsDong);
	}
}

// 8. napGioHang(chuoiJSON)
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

// ---------- CHẠY THỬ & HIỂN THỊ LÊN TRANG ----------
const gioHangMau = new GioHang();
gioHangMau.them(DANH_MUC[0], 100);
gioHangMau.them(DANH_MUC[0], 50); // cộng dồn thành 150 cái = 225.000 đ
gioHangMau.them(DANH_MUC[1], 200); // 200 cái = 100.000 đ -> Tổng = 325.000 đ

// Hiển thị chuỗi JSON vào khung kết quả nếu có hàm hienThi
if (typeof hienThi === "function") {
	hienThi(`JSON gửi lên máy chủ: ${gioHangMau.xuatJSON()}`);
	hienThi("");
}

// Render dữ liệu vào cột Giỏ hàng
const khungGioHang = document.querySelector("#cart, .cart, #gio-hang, .block-cart");
if (khungGioHang) {
	const danhSach = gioHangMau.layDanhSach();
	let html = '<h3 class="title">Giỏ hàng</h3>';
	for (const item of danhSach) {
		html += `
			<div class="cart-item" style="margin-bottom: 12px;">
				<div style="font-weight: bold; color: #fff;">${item.ten}</div>
				<div style="font-size: 0.9em; opacity: 0.85;">${item.soLuong} cái — ${item.thanhTien} đ</div>
			</div>
		`;
	}
	html += `
		<h4 style="margin: 15px 0 10px 0; font-size: 1.1em; color: #222;">Tổng: ${gioHangMau.tongTien()} đ</h4>
		<a href="#" class="button"><img src="images/viewmore.png" alt="View More" style="max-width: 100%;"></a>
	`;
	khungGioHang.innerHTML = html;
}