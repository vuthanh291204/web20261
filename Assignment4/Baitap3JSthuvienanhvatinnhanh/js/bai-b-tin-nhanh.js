document.addEventListener("DOMContentLoaded", () => {
	// Lấy các phần tử trên trang
	const oTimKiem = document.getElementById("o-tim-kiem");
	const dsTin = document.getElementById("list");
	const boDem = document.getElementById("bo-dem");
	const khongThay = document.getElementById("khong-thay");

	const tinTieuDe = document.getElementById("tin-tieu-de");
	const tinNoiDung = document.getElementById("tin-noi-dung");
	const nutDang = document.getElementById("nut-dang");
	const baoLoi = document.getElementById("bao-loi");

	// F1: Cập nhật bộ đếm hiển thị
	function capNhatBoDem() {
		const cacTin = dsTin.querySelectorAll(":scope > li");
		const tongSo = cacTin.length;
		let soDangHien = 0;
		for (const li of cacTin) {
			if (!li.classList.contains("an")) {
				soDangHien++;
			}
		}
		boDem.textContent = `Đang hiển thị ${soDangHien}/${tongSo} tin`;
	}

	// F2 & F3: Lọc tin khi gõ và hiển thị thông báo
	function locTin() {
		const tuKhoa = oTimKiem.value.toLowerCase().trim();
		const cacTin = dsTin.querySelectorAll(":scope > li");
		let soTinKhop = 0;

		cacTin.forEach(li => {
			const tieuDe = (li.querySelector("h3")?.textContent || "").toLowerCase();
			const noiDung = (li.querySelector("p")?.textContent || "").toLowerCase();

			if (tuKhoa === "" || tieuDe.includes(tuKhoa) || noiDung.includes(tuKhoa)) {
				li.classList.remove("an");
				soTinKhop++;
			} else {
				li.classList.add("an");
			}
		});

		// F3: Thông báo không tìm thấy (dùng textContent để hiển thị nguyên văn)
		if (soTinKhop === 0 && cacTin.length > 0) {
			khongThay.classList.remove("an");
			khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
		} else {
			khongThay.classList.add("an");
		}

		// Cập nhật lại bộ đếm sau khi lọc
		capNhatBoDem();
	}

	oTimKiem.addEventListener("keyup", locTin);

	// F4: Mở rộng / thu gọn - Sử dụng 1 trình lắng nghe duy nhất trên #list
	dsTin.addEventListener("click", (e) => {
		// Chỉ xử lý khi bấm đúng vào nút button.more
		if (e.target.matches("button.more")) {
			const nut = e.target;
			const li = nut.closest("li");
			const doanVan = li.querySelector("p");

			if (doanVan.classList.contains("day-du")) {
				doanVan.classList.remove("day-du");
				nut.textContent = "Read more >>";
			} else {
				doanVan.classList.add("day-du");
				nut.textContent = "Thu gọn <<";
			}
		}
	});

	// F5: Đăng tin nhanh
	nutDang.addEventListener("click", () => {
		const tieuDeVal = tinTieuDe.value.trim();
		const noiDungVal = tinNoiDung.value.trim();

		// Kiểm tra chuỗi rỗng
		if (tieuDeVal === "" || noiDungVal === "") {
			baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
			return;
		}

		// Tạo li mới và các thẻ con (dùng textContent để an toàn HTML/XSS)
		const liMoi = document.createElement("li");

		const spanTime = document.createElement("span");
		spanTime.className = "time";
		spanTime.textContent = typeof homNay === "function" ? homNay() : new Date().toLocaleDateString("vi-VN");

		const h3 = document.createElement("h3");
		h3.textContent = tinTieuDe.value;

		const p = document.createElement("p");
		p.textContent = tinNoiDung.value;

		const btnMore = document.createElement("button");
		btnMore.type = "button";
		btnMore.className = "more";
		btnMore.textContent = "Read more >>";

		liMoi.append(spanTime, h3, p, btnMore);

		// Chèn vào đầu danh sách
		dsTin.prepend(liMoi);

		// Xóa trắng form và thông báo lỗi
		tinTieuDe.value = "";
		tinNoiDung.value = "";
		baoLoi.textContent = "";

		// Áp dụng ngay bộ lọc hiện tại và cập nhật lại bộ đếm
		locTin();
	});

	// Cập nhật bộ đếm ngay khi trang vừa tải xong
	capNhatBoDem();
});