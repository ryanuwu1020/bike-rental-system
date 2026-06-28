/**
 * CustomerView — 客戶管理視圖
 * 負責客戶頁面的 HTML 渲染與 DOM 操作
 */
class CustomerView {

  /** 渲染頁面主結構 */
  renderPage(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">

            <span class="title-text">客戶管理</span>
          </h1>
          <p class="page-subtitle">管理所有客戶資料、會員狀態與聯絡資訊</p>
        </div>
        <div class="toolbar">
          <div class="search-wrapper">
 
            <input type="text" class="search-input" id="search-input" placeholder="搜尋客戶姓名、ID...">
          </div>
          <button class="btn btn-primary" id="btn-add">
            <span>＋</span>
            <span>新增客戶</span>
          </button>
        </div>
      </div>
      <div class="stats-bar" id="stats-bar"></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>客戶 ID</th>
              <th>姓名</th>
              <th>聯絡方式</th>
              <th>會員狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="data-table-body"></tbody>
        </table>
      </div>
    `;
  }

  /** 渲染資料表格 */
  renderTable(data) {
    const tbody = document.getElementById('data-table-body');
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <div class="empty-text">尚無客戶資料</div>
              <div class="empty-sub">點擊「新增客戶」開始建立</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map(c => {
      const badgeClass = c.會員狀態 === 'VIP' ? 'badge-vip' :
                         c.會員狀態 === '停用' ? 'badge-inactive' : 'badge-active';
      return `
        <tr>
          <td class="cell-id">${c.客戶_ID}</td>
          <td>${c.姓名}</td>
          <td>${c.聯絡方式}</td>
          <td><span class="badge ${badgeClass}">${c.會員狀態}</span></td>
          <td class="actions">
            <button class="btn btn-edit" data-id="${c.客戶_ID}">編輯</button>
            <button class="btn btn-delete" data-id="${c.客戶_ID}">刪除</button>
          </td>
        </tr>`;
    }).join('');
  }

  /** 渲染統計卡片 */
  renderStats(stats) {
    const bar = document.getElementById('stats-bar');
    if (!bar) return;
    bar.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">總客戶數</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">VIP 會員</div>
        <div class="stat-value">${stats.vip}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">活躍客戶</div>
        <div class="stat-value">${stats.active}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">停用客戶</div>
        <div class="stat-value">${stats.inactive}</div>
      </div>
    `;
  }

  /** 產生表單 HTML（新增或編輯用） */
  getFormHTML(data) {
    const d = data || {};
    return `
      <div class="form-group">
        <label>姓名 <span class="required">*</span></label>
        <input type="text" id="form-name" value="${d.姓名 || ''}" placeholder="請輸入客戶姓名">
      </div>
      <div class="form-group">
        <label>聯絡方式 <span class="required">*</span></label>
        <input type="text" id="form-contact" value="${d.聯絡方式 || ''}" placeholder="請輸入電話或 Email">
      </div>
      <div class="form-group">
        <label>會員狀態</label>
        <select id="form-status">
          <option value="一般" ${d.會員狀態 === '一般' ? 'selected' : ''}>一般</option>
          <option value="VIP" ${d.會員狀態 === 'VIP' ? 'selected' : ''}>VIP</option>
          <option value="停用" ${d.會員狀態 === '停用' ? 'selected' : ''}>停用</option>
        </select>
      </div>
    `;
  }

  /** 從表單收集資料 */
  getFormData() {
    return {
      姓名: document.getElementById('form-name').value.trim(),
      聯絡方式: document.getElementById('form-contact').value.trim(),
      會員狀態: document.getElementById('form-status').value,
    };
  }

  /** 驗證表單 */
  validateForm(data) {
    if (!data.姓名) return '請輸入客戶姓名';
    if (!data.聯絡方式) return '請輸入聯絡方式';
    return null;
  }
}
