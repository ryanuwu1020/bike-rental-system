/**
 * CustomerModel — 客戶資料模型
 * 負責客戶的 CRUD 操作與 localStorage 資料持久化
 */
class CustomerModel {
  constructor() {
    this.storageKey = 'customers';
  }

  /** 取得所有客戶 */
  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /** 依 ID 取得客戶 */
  getById(id) {
    return this.getAll().find(c => c.客戶_ID === id) || null;
  }

  /** 自動產生流水號 ID (C001, C002, ...) */
  generateId() {
    const all = this.getAll();
    if (all.length === 0) return 'C001';
    const maxNum = Math.max(...all.map(c => parseInt(c.客戶_ID.replace('C', '')) || 0));
    return 'C' + String(maxNum + 1).padStart(3, '0');
  }

  /** 新增客戶 */
  add(customer) {
    const all = this.getAll();
    customer.客戶_ID = this.generateId();
    all.push(customer);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return customer;
  }

  /** 更新客戶 */
  update(id, data) {
    const all = this.getAll();
    const index = all.findIndex(c => c.客戶_ID === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data, 客戶_ID: id };
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return all[index];
  }

  /** 刪除客戶 */
  delete(id) {
    const all = this.getAll().filter(c => c.客戶_ID !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** 關鍵字搜尋 */
  search(keyword) {
    const kw = keyword.toLowerCase();
    return this.getAll().filter(c =>
      Object.values(c).some(v => String(v).toLowerCase().includes(kw))
    );
  }

  /** 統計資料 */
  getStats() {
    const all = this.getAll();
    return {
      total: all.length,
      vip: all.filter(c => c.會員狀態 === 'VIP').length,
      active: all.filter(c => c.會員狀態 !== '停用').length,
      inactive: all.filter(c => c.會員狀態 === '停用').length,
    };
  }
}
