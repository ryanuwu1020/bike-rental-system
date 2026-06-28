/**
 * OrderView — 租賃訂單視圖
 * 負責訂單頁面的 HTML 渲染與 DOM 操作
 * 需要客戶資料來顯示客戶姓名下拉選單
 */
class OrderView {

  /** 渲染頁面主結構 */
  renderPage(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">
  
            <span class="title-text">訂單管理</span>
          </h1>
          <p class="page-subtitle">管理租賃訂單、金額與客戶關聯</p>
        </div>
        <div class="toolbar">
          <div class="search-wrapper">

            <input type="text" class="search-input" id="search-input" placeholder="搜尋訂單編號、客戶...">
          </div>
          <button class="btn btn-primary" id="btn-add">
            <span>＋</span>
            <span>新增訂單</span>
          </button>
        </div>
      </div>
      <div class="stats-bar" id="stats-bar"></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>建立時間</th>
              <th>客戶</th>
              <th>客人人數</th>
              <th>總金額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="data-table-body"></tbody>
        </table>
      </div>
    `;
  }

  /** 渲染資料表格（附帶客戶名稱對照） */
  renderTable(data, customerMap) {
    const tbody = document.getElementById('data-table-body');
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">

              <div class="empty-text">尚無訂單資料</div>
              <div class="empty-sub">點擊「新增訂單」開始建立</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map(o => {
      const customerName = customerMap[o.客戶_ID] || o.客戶_ID;
      return `
        <tr>
          <td class="cell-id">${o.訂單編號}</td>
          <td>${o.訂單建立時間}</td>
          <td>${customerName} <span style="color:var(--text-muted);font-size:11px;">(${o.客戶_ID})</span></td>
          <td>${o.客人人數} 人</td>
          <td class="cell-amount">${Number(o.總金額).toLocaleString()}</td>
          <td class="actions">
            <button class="btn btn-edit" data-id="${o.訂單編號}">編輯</button>
            <button class="btn btn-delete" data-id="${o.訂單編號}">刪除</button>
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
        <div class="stat-label">訂單總數</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">營收總額</div>
        <div class="stat-value">$${stats.totalAmount.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均訂單金額</div>
        <div class="stat-value">$${stats.avgAmount.toLocaleString()}</div>
      </div>
    `;
  }

  /** 產生表單 HTML（需要客戶列表作為下拉選單） */
  getFormHTML(data, customers) {
    const d = data || {};
    const customerOptions = (customers || []).map(c =>
      `<option value="${c.客戶_ID}" ${d.客戶_ID === c.客戶_ID ? 'selected' : ''}>${c.姓名} (${c.客戶_ID})</option>`
    ).join('');

    return `
      <div class="form-group">
        <label>客戶 <span class="required">*</span></label>
        <select id="form-customer-id">
          <option value="">— 請選擇客戶 —</option>
          ${customerOptions}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>客人人數 <span class="required">*</span></label>
          <input type="number" id="form-guest-count" value="${d.客人人數 || 1}" min="1" placeholder="1">
        </div>
        <div class="form-group">
          <label>總金額 <span class="required">*</span></label>
          <input type="number" id="form-total-amount" value="${d.總金額 || ''}" min="0" placeholder="例：800">
        </div>
      </div>
    `;
  }

  /** 從表單收集資料 */
  getFormData() {
    return {
      客戶_ID: document.getElementById('form-customer-id').value,
      客人人數: document.getElementById('form-guest-count').value,
      總金額: document.getElementById('form-total-amount').value,
    };
  }

  /** 驗證表單 */
  validateForm(data) {
    if (!data.客戶_ID) return '請選擇客戶';
    if (!data.客人人數 || Number(data.客人人數) < 1) return '客人人數至少為 1';
    if (!data.總金額 || Number(data.總金額) < 0) return '請輸入有效金額';
    return null;
  }
}
