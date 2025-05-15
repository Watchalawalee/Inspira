import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState([]);
  const [othersExhibitions, setOthersExhibitions] = useState([]);

  const [allCategories, setAllCategories] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination for Others
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExhibitions, setTotalExhibitions] = useState(0);
  const perPage = 10;

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      window.location.href = "/login.html";
      return;
    }
    setToken(t);

    axios.defaults.headers.common["Authorization"] = "Bearer " + t;

    // ตรวจสอบ role
axios
  .get("/auth/me")
  .then((res) => {
    if (res.data.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      router.push("/home");  // เปลี่ยนเส้นทางไปหน้า home/page.tsx
    } else {
      setRole(res.data.role);
    }
  })
  .catch(() => {
    alert("Session หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
    router.push("/login"); // เปลี่ยนเส้นทางไปหน้า login/page.tsx
  });

  async function loadCategories() {
    try {
      const res = await axios.get("/categories");
      setAllCategories(res.data);
    } catch (err) {
      console.error("โหลดหมวดหมู่ล้มเหลว", err);
    }
  }

  async function loadSuggestions() {
    setShowPending(true);
    setShowOthers(false);

    setLoading(true);
    try {
      const res = await axios.get("/admin/suggestions/pending");
      setPendingSuggestions(res.data);
    } catch (err) {
      alert("โหลดข้อมูลล้มเหลว");
      console.error(err);
    }
    setLoading(false);
  }

  async function loadOthersExhibitions(reset = true) {
    setShowOthers(true);
    setShowPending(false);

    if (reset) setCurrentPage(1);

    setLoading(true);

    try {
      const status = statusFilter;
      const res = await axios.get(
        `/admin/exhibitions/others?page=${reset ? 1 : currentPage}&limit=${perPage}&status=${status}`
      );

      setTotalExhibitions(res.data.total);
      if (reset) {
        setOthersExhibitions(res.data.exhibitions);
      } else {
        setOthersExhibitions((prev) => [...prev, ...res.data.exhibitions]);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }

    setLoading(false);
  }

  async function updateCategory(id, newCategory, isSuggestion = true) {
    try {
      if (isSuggestion) {
        await axios.put(`/admin/suggestions/${id}/category`, { category: newCategory });
        alert("อัปเดตหมวดหมู่เรียบร้อยแล้ว");
        loadSuggestions();
      } else {
        await axios.put(`/admin/exhibitions/${id}/category`, { category: newCategory });
        alert("บันทึกสำเร็จ");
        loadOthersExhibitions(true);
      }
    } catch (err) {
      console.error("อัปเดตหมวดหมู่ผิดพลาด", err);
      alert("ไม่สามารถอัปเดตหมวดหมู่ได้");
    }
  }

  async function approveSuggestion(id) {
    try {
      await axios.put(`/admin/suggestions/${id}/approve`);
      alert("อนุมัติแล้ว");
      loadSuggestions();
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถอนุมัติได้");
    }
  }

  async function deleteSuggestion(id) {
    if (!window.confirm("แน่ใจว่าต้องการลบ?")) return;
    try {
      await axios.delete(`/admin/suggestions/${id}`);
      alert("ลบเรียบร้อย");
      loadSuggestions();
    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ");
    }
  }

  async function confirmOthers(id) {
    try {
      await axios.put(`/admin/exhibitions/${id}/category`, { category: "Others" });
      alert("ยืนยันหมวด Others สำเร็จ");
      loadOthersExhibitions(true);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการยืนยัน");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    alert("คุณได้ออกจากระบบแล้ว");
    window.location.href = "index.html";
  }

  function handleLoadMore() {
    setCurrentPage((p) => p + 1);
  }

  // โหลด Others เพิ่มตอน currentPage เปลี่ยน (ถ้า showOthers กำลังแสดง)
  useEffect(() => {
    if (showOthers && currentPage > 1) {
      loadOthersExhibitions(false);
    }
  }, [currentPage]);

  return (
    <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
      <button
        onClick={logout}
        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mb-6"
      >
        ออกจากระบบ
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับ แอดมิน</h1>
        <button
          onClick={loadSuggestions}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          จัดการงานนิทรรศการที่ผู้ใช้เสนอมา
        </button>
        <button
          onClick={() => loadOthersExhibitions(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          จัดการหมวดหมู่งานที่เป็น Others
        </button>
      </div>

      {showOthers && (
        <div className="mb-4 text-right">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            กรองสถานะ:
          </label>
          <select
            id="statusFilter"
            className="border rounded p-1"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              loadOthersExhibitions(true);
            }}
          >
            <option value="all">ทั้งหมด</option>
            <option value="ongoing">ongoing</option>
            <option value="upcoming">upcoming</option>
            <option value="past">past</option>
          </select>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">🔄 กำลังโหลด...</p>}

      {/* Pending Suggestions List */}
      {showPending && !loading && (
        <div className="space-y-4">
          {pendingSuggestions.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีงานที่รออนุมัติ</p>
          ) : (
            pendingSuggestions.map((s) => {
              const isOthers = s.categories?.includes("Others");
              const filteredCategories = allCategories.filter((c) => c.name !== "Others");
              return (
                <div key={s._id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-bold mb-2">{s.title}</h2>
                  <p>
                    <strong>สถานที่:</strong> {s.location || "ไม่ระบุ"}
                  </p>
                  <p>
                    <strong>วันเริ่ม:</strong> {s.start_date || "-"} | <strong>วันสิ้นสุด:</strong>{" "}
                    {s.end_date || "-"}
                  </p>
                  <p>
                    <strong>เวลา:</strong> {s.event_slot_time || "-"}
                  </p>
                  <p>
                    <strong>หมวดหมู่:</strong> {s.categories?.join(", ") || "-"}
                  </p>

                  {isOthers && (
                    <>
                      <label className="block mt-2">แก้ไขหมวดหมู่:</label>
                      <select
                        defaultValue=""
                        id={`cat-select-${s._id}`}
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled>
                          เลือกหมวดหมู่
                        </option>
                        {filteredCategories.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const sel = document.getElementById(`cat-select-${s._id}`);
                          if (!sel.value) {
                            alert("กรุณาเลือกหมวดหมู่ก่อนบันทึก");
                            return;
                          }
                          updateCategory(s._id, sel.value);
                        }}
                        className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        💾 บันทึกหมวดหมู่
                      </button>
                    </>
                  )}

                  <p className="break-words w-full">
                    <strong>คำอธิบาย:</strong> {s.description || "ไม่มีคำอธิบาย"}
                  </p>
                  <p>
                    <strong>ค่าเข้าชม:</strong> {s.ticket || "ไม่ระบุ"}
                  </p>
                  <p>
                    <strong>ราคาบัตร:</strong>{" "}
                    {s.ticket_price?.length ? s.ticket_price.join(", ") + " บาท" : "-"}
                  </p>
                  <p>
                    <strong>ละติจูด:</strong> {s.latitude || "-"} | <strong>ลองจิจูด:</strong>{" "}
                    {s.longitude || "-"}
                  </p>
                  {s.image_url && (
                    <img
                      src={s.image_url}
                      alt={s.title}
                      className="mt-4 w-full max-h-60 object-contain rounded"
                    />
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => approveSuggestion(s._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      ✅ อนุมัติ
                    </button>
                    <button
                      onClick={() => deleteSuggestion(s._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      🗑 ลบ
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Others Exhibitions List */}
      {showOthers && !loading && (
        <div className="space-y-4">
          {othersExhibitions.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบนิทรรศการที่มีหมวดหมู่ Others</p>
          ) : (
            othersExhibitions.map((ex) => {
              const filteredCategories = allCategories.filter((c) => c.name !== "Others");
              return (
                <div key={ex._id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-bold mb-2">{ex.title}</h2>
                  <p>
                    <strong>สถานที่:</strong> {ex.location || "ไม่ระบุ"}
                  </p>
                  <p>
                    <strong>วันเริ่ม:</strong> {ex.start_date || "-"} | <strong>วันสิ้นสุด:</strong>{" "}
                    {ex.end_date || "-"}
                  </p>
                  <p>
                    <strong>เวลา:</strong> {ex.event_slot_time || "-"}
                  </p>
                  <p>
                    <strong>หมวดหมู่:</strong> {ex.categories?.join(", ") || "-"}
                  </p>

                  <label className="block mt-2">แก้ไขหมวดหมู่:</label>
                  <select
                    defaultValue=""
                    id={`others-cat-select-${ex._id}`}
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>
                      เลือกหมวดหมู่
                    </option>
                    {filteredCategories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const sel = document.getElementById(`others-cat-select-${ex._id}`);
                      if (!sel.value) {
                        alert("กรุณาเลือกหมวดหมู่ก่อนบันทึก");
                        return;
                      }
                      updateCategory(ex._id, sel.value, false);
                    }}
                    className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    💾 บันทึกหมวดหมู่
                  </button>

                  <button
                    onClick={() => confirmOthers(ex._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    ✔️ ยืนยันหมวด Others
                  </button>
                </div>
              );
            })
          )}

          {othersExhibitions.length < totalExhibitions && (
            <button
              onClick={handleLoadMore}
              className="block mx-auto mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              โหลดเพิ่ม
            </button>
          )}
        </div>
      )}
    </div>
  );
}
