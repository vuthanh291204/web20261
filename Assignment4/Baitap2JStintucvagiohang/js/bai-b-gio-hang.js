/* BÀI B — VIẾT CODE: Giỏ hàng của xưởng in
   Hoàn thiện class GioHang và hàm napGioHang.
   Không đổi tên class, tên phương thức, tên hàm; không sửa phần "DỮ LIỆU ĐÃ CHO". */

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
		// Mỗi dòng của giỏ là một object { id, ten, loai, gia, soLuong }.
		this.dsDong = [];
	}

	// 1. Thêm sản phẩm; trả về true nếu thêm được, false nếu soLuong không hợp lệ.
	them(sanPham, soLuong) {
		// Kiểm tra soLuong: phải là number (không phải chuỗi), nguyên, lớn hơn 0
		if (typeof soLuong !== "number" || !Number.isInteger(soLuong) || soLuong <= 0) {
			return false;
		}
		// Tìm xem sản phẩm (theo id) đã có trong giỏ chưa
		const dongCo = this.dsDong.find(d => d.id === sanPham.id);
		if (dongCo) {
			// Cộng dồn số lượng
			dongCo.soLuong += soLuong;
		} else {
			// Thêm dòng mới — sao chép để không phụ thuộc object bên ngoài
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

	// 2. Xoá dòng có id tương ứng; trả về true nếu có xoá, false nếu không tìm thấy.
	xoa(id) {
		const viTri = this.dsDong.findIndex(d => d.id === id);
		if (viTri === -1) {
			return false;
		}
		this.dsDong.splice(viTri, 1);
		return true;
	}

	// 3. Tổng tiền cả giỏ.
	tongTien() {
		return this.dsDong.reduce((tong, d) => tong + d.gia * d.soLuong, 0);
	}

	// 4. Object thống kê: { "<loai>": tổng tiền của loại đó, ... }.
	thongKeTheoLoai() {
		const ketQua = {};
		for (const d of this.dsDong) {
			ketQua[d.loai] = (ketQua[d.loai] || 0) + d.gia * d.soLuong;
		}
		return ketQua;
	}

	// 5. Dòng có thành tiền lớn nhất (bản sao, có thêm thanhTien); null nếu giỏ rỗng.
	dongDatNhat() {
		if (this.dsDong.length === 0) return null;
		let dongMax = this.dsDong[0];
		let thanhTienMax = dongMax.gia * dongMax.soLuong;
		for (let i = 1; i < this.dsDong.length; i++) {
			const tt = this.dsDong[i].gia * this.dsDong[i].soLuong;
			if (tt > thanhTienMax) {
				thanhTienMax = tt;
				dongMax = this.dsDong[i];
			}
		}
		// Trả về bản sao để bên ngoài không sửa được giỏ
		return { ...dongMax, thanhTien: thanhTienMax };
	}

	// 6. Mảng BẢN SAO các dòng, mỗi dòng có thêm thuộc tính thanhTien.
	layDanhSach() {
		return this.dsDong.map(d => ({ ...d, thanhTien: d.gia * d.soLuong }));
	}

	// 7. Chuỗi JSON của mảng các dòng (chỉ 5 thuộc tính, không có thanhTien).
	xuatJSON() {
		const mangXuat = this.dsDong.map(d => ({
			id: d.id,
			ten: d.ten,
			loai: d.loai,
			gia: d.gia,
			soLuong: d.soLuong
		}));
		return JSON.stringify(mangXuat);
	}
}

// 8. Tạo lại một GioHang từ chuỗi JSON do xuatJSON() sinh ra.
function napGioHang(chuoiJSON) {
	const gio = new GioHang();
	const mangDong = JSON.parse(chuoiJSON);
	for (const d of mangDong) {
		// Nạp trực tiếp vào dsDong (đã là dữ liệu sạch từ xuatJSON)
		gio.dsDong.push({
			id: d.id,
			ten: d.ten,
			loai: d.loai,
			gia: d.gia,
			soLuong: d.soLuong
		});
	}
	return gio;
}

// ---------- CHẠY THỬ (không sửa) ----------
const gio = new GioHang();
gio.them(DANH_MUC[0], 100);
gio.them(DANH_MUC[3], 200);
gio.them(DANH_MUC[0], 50);
veGioHang(gio.layDanhSach(), gio.tongTien());
console.table(gio.layDanhSach());
hienThi(`JSON gửi lên máy chủ: ${gio.xuatJSON()}`);
