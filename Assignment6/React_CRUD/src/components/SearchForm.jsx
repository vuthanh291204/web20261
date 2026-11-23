/**
 * SearchForm Component
 * - Nhận props: onChangeValue (hàm callback = setKeyword từ App)
 * - Khi người dùng nhập, gọi onChangeValue để cập nhật kw ở App
 * - App sau đó truyền kw cho ResultTable để lọc danh sách
 *
 * Luồng: SearchForm → App (kw) → ResultTable
 */
function SearchForm({ onChangeValue }) {
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="Tìm theo name, username"
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}

export default SearchForm;
