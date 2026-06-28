/**
 * OrderDetailView — 訂單明細視圖
 * 負責明細頁面的 HTML 渲染與 DOM 操作
 * 需要訂單和設備資料來顯示關聯下拉選單
 */
class OrderDetailView {

  /** 渲染頁面主結構 */
  renderPage(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">
        
            <span class="title-text">明細管理</span>
          </h1>
          <p class="page-subtitle">管理訂單明細、設備租賃與歸還資訊</p>
        </div>
        <div class="toolbar">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" id="search-input" placeholder="搜尋訂單編號、設備...">
          </div>
          <button class="btn btn-primary" id="btn-add">
            <span>＋</span>
            <span>新增明細</span>
          </button>
        </div>
      </div>
      <div class="stats-bar" id="stats-bar"></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>明細編號</th>
              <th>設備</th>
              <th>預計歸還</th>
              <th>實際歸還</th>
              <th>單車金額</th>
              <th>逾期費用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="data-table-body"></tbody>
        </table>
      </div>
    `;
  }

  /** 渲染資料表格（附帶設備名稱對照） */
  renderTable(data, equipmentMap) {
    const tbody = document.getElementById('data-table-body');
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
           
              <div class="empty-text">尚無明細資料</div>
              <div class="empty-sub">點擊「新增明細」開始建立</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map(d => {
      const equipName = equipmentMap[d.設備編號] || d.設備編號;
      const hasReturned = d.實際歸還時間 && d.實際歸還時間.trim() !== '';
      const returnDisplay = hasReturned
        ? d.實際歸還時間
        : '<span class="badge badge-rented">未歸還</span>';
      const lateFee = Number(d.單台逾期費用) || 0;
      const lateFeeClass = lateFee > 0 ? 'style="color:var(--danger);font-weight:600;"' : '';

      return `
        <tr>
          <td class="cell-id">${d.訂單編號}</td>
          <td class="cell-id">${d.明細編號}</td>
          <td>${equipName} <span style="color:var(--text-muted);font-size:11px;">(${d.設備編號})</span></td>
          <td>${d.預計歸還時間}</td>
          <td>${returnDisplay}</td>
          <td class="cell-amount">${Number(d.單車金額).toLocaleString()}</td>
          <td ${lateFeeClass}>${lateFee > 0 ? 'NT$ ' + lateFee.toLocaleString() : '-'}</td>
          <td class="actions">
            <button class="btn btn-edit" data-order-id="${d.訂單編號}" data-detail-id="${d.明細編號}">編輯</button>
            <button class="btn btn-delete" data-order-id="${d.訂單編號}" data-detail-id="${d.明細編號}">刪除</button>
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
        <div class="stat-label">明細總數</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已歸還</div>
        <div class="stat-value">${stats.returned}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">未歸還</div>
        <div class="stat-value">${stats.notReturned}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">逾期費用總計</div>
        <div class="stat-value">$${stats.totalLateFee.toLocaleString()}</div>
      </div>
    `;
  }

  /** 產生表單 HTML（需要訂單和設備列表作為下拉選單） */
  getFormHTML(data, orders, equipments, isEdit) {
    const d = data || {};
    const orderOptions = (orders || []).map(o =>
      `<option value="${o.訂單編號}" ${d.訂單編號 === o.訂單編號 ? 'selected' : ''}>${o.訂單編號} — ${o.訂單建立時間}</option>`
    ).join('');

    const equipOptions = (equipments || []).map(e =>
      `<option value="${e.設備編號}" ${d.設備編號 === e.設備編號 ? 'selected' : ''}>${e.自行車型號} (${e.設備編號})</option>`
    ).join('');

    return `
      <div class="form-row">
        <div class="form-group">
          <label>訂單編號 <span class="required">*</span></label>
          <select id="form-order-id" ${isEdit ? 'disabled' : ''}>
            <option value="">— 請選擇訂單 —</option>
            ${orderOptions}
          </select>
        </div>
        <div class="form-group">
          <label>設備 <span class="required">*</span></label>
          <select id="form-equipment-id">
            <option value="">— 請選擇設備 —</option>
            ${equipOptions}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>預計歸還時間 <span class="required">*</span></label>
          <input type="datetime-local" id="form-expected-return" value="${d.預計歸還時間 ? d.預計歸還時間.replace(' ', 'T') : ''}">
        </div>
        <div class="form-group">
          <label>實際歸還時間</label>
          <input type="datetime-local" id="form-actual-return" value="${d.實際歸還時間 ? d.實際歸還時間.replace(' ', 'T') : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>單車金額 <span class="required">*</span></label>
          <input type="number" id="form-bike-amount" value="${d.單車金額 || ''}" min="0" placeholder="例：400">
        </div>
        <div class="form-group">
          <label>單台逾期費用</label>
          <input type="number" id="form-late-fee" value="${d.單台逾期費用 || 0}" min="0" placeholder="0">
        </div>
      </div>
    `;
  }

  /** 從表單收集資料 */
  getFormData() {
    const expectedReturn = document.getElementById('form-expected-return').value;
    const actualReturn = document.getElementById('form-actual-return').value;
    return {
      訂單編號: document.getElementById('form-order-id').value,
      設備編號: document.getElementById('form-equipment-id').value,
      預計歸還時間: expectedReturn ? expectedReturn.replace('T', ' ') : '',
      實際歸還時間: actualReturn ? actualReturn.replace('T', ' ') : '',
      單車金額: document.getElementById('form-bike-amount').value,
      單台逾期費用: document.getElementById('form-late-fee').value,
    };
  }

  /** 驗證表單 */
  validateForm(data) {
    if (!data.訂單編號) return '請選擇訂單';
    if (!data.設備編號) return '請選擇設備';
    if (!data.預計歸還時間) return '請選擇預計歸還時間';
    if (!data.單車金額 || Number(data.單車金額) < 0) return '請輸入有效的單車金額';
    return null;
  }
}
