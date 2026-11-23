import { useState } from "react";
import SearchForm from "./components/SearchForm";
import AddUser from "./components/AddUser";
import ResultTable from "./components/ResultTable";
import "./App.css";

/**
 * Component App - Component gốc
 * Quản lý toàn bộ state và truyền props xuống con
 *
 * State Lifting:
 * - kw (từ khóa tìm kiếm): đặt ở App vì cần chia sẻ giữa SearchForm → App → ResultTable
 * - newUser (người dùng mới): đặt ở App vì cần truyền từ AddUser → App → ResultTable
 */
function App() {
  // State "kw" - từ khóa tìm kiếm, được chia sẻ giữa SearchForm và ResultTable
  const [kw, setKeyword] = useState("");

  // State "newUser" - người dùng mới cần thêm, được chia sẻ giữa AddUser và ResultTable
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="app-container">
      <h1>Quản lý người dùng</h1>

      {/* SearchForm gọi onChangeValue (tức setKeyword) để cập nhật kw ở App */}
      <SearchForm onChangeValue={setKeyword} />

      {/* AddUser gọi onAdd (tức setNewUser) để cập nhật newUser ở App */}
      <AddUser onAdd={setNewUser} />

      {/* ResultTable nhận keyword và user từ App để lọc và thêm user */}
      <ResultTable
        keyword={kw}
        user={newUser}
        onAdded={() => setNewUser(null)}
      />
    </div>
  );
}

export default App;
