/**
 * EquipmentView — 設備管理視圖
 * 負責設備庫存頁面的 HTML 渲染與 DOM 操作
 */
class EquipmentView {

  /** 渲染頁面主結構 */
  renderPage(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">
            <span class="title-icon">🚲</span>
            <span class="title-text">設備管理</span>
          </h1>
          <p class="page-subtitle">管理自行車庫存、型號與狀態資訊</p>
        </div>
        <div class="toolbar">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" id="search-input" placeholder="搜尋設備型號、編號...">
          </div>
          <button class="btn btn-primary" id="btn-add">
            <span>＋</span>
            <span>新增設備</span>
          </button>
        </div>
      </div>
      <div class="stats-bar" id="stats-bar"></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>設備編號</th>
              <th>自行車型號</th>
              <th>購入日期</th>
              <th>當前狀態</th>
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
              <div class="empty-icon">🚲</div>
              <div class="empty-text">尚無設備資料</div>
              <div class="empty-sub">點擊「新增設備」開始建立</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map(e => {
      let badgeClass = 'badge-active';
      if (e.當前狀態 === '租用中') badgeClass = 'badge-rented';
      else if (e.當前狀態 === '維修中') badgeClass = 'badge-repair';

      return `
        <tr>
          <td class="cell-id">${e.設備編號}</td>
          <td>${e.自行車型號}</td>
          <td>${e.購入日期}</td>
          <td><span class="badge ${badgeClass}">${e.當前狀態}</span></td>
          <td class="actions">
            <button class="btn btn-edit" data-id="${e.設備編號}">✏️ 編輯</button>
            <button class="btn btn-delete" data-id="${e.設備編號}">🗑️ 刪除</button>
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
        <div class="stat-label">設備總數</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">可用</div>
        <div class="stat-value">${stats.available}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">租用中</div>
        <div class="stat-value">${stats.rented}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">維修中</div>
        <div class="stat-value">${stats.maintenance}</div>
      </div>
    `;
  }

  /** 產生表單 HTML */
  getFormHTML(data) {
    const d = data || {};
    return `
      <div class="form-group">
        <label>自行車型號 <span class="required">*</span></label>
        <input type="text" id="form-model" value="${d.自行車型號 || ''}" placeholder="例：捷安特 ATX 660">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>購入日期 <span class="required">*</span></label>
          <input type="date" id="form-purchase-date" value="${d.購入日期 || ''}">
        </div>
        <div class="form-group">
          <label>當前狀態</label>
          <select id="form-equip-status">
            <option value="可用" ${d.當前狀態 === '可用' ? 'selected' : ''}>可用</option>
            <option value="租用中" ${d.當前狀態 === '租用中' ? 'selected' : ''}>租用中</option>
            <option value="維修中" ${d.當前狀態 === '維修中' ? 'selected' : ''}>維修中</option>
          </select>
        </div>
      </div>
    `;
  }

  /** 從表單收集資料 */
  getFormData() {
    return {
      自行車型號: document.getElementById('form-model').value.trim(),
      購入日期: document.getElementById('form-purchase-date').value,
      當前狀態: document.getElementById('form-equip-status').value,
    };
  }

  /** 驗證表單 */
  validateForm(data) {
    if (!data.自行車型號) return '請輸入自行車型號';
    if (!data.購入日期) return '請選擇購入日期';
    return null;
  }
}
