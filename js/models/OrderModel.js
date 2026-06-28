/**
 * OrderModel — 租賃訂單資料模型
 * 負責訂單的 CRUD 操作與 localStorage 資料持久化
 */
class OrderModel {
  constructor() {
    this.storageKey = 'orders';
  }

  /** 取得所有訂單 */
  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /** 依訂單編號取得訂單 */
  getById(id) {
    return this.getAll().find(o => o.訂單編號 === id) || null;
  }

  /** 依客戶 ID 取得訂單 */
  getByCustomerId(customerId) {
    return this.getAll().filter(o => o.客戶_ID === customerId);
  }

  /** 自動產生流水號 ID (O001, O002, ...) */
  generateId() {
    const all = this.getAll();
    if (all.length === 0) return 'O001';
    const maxNum = Math.max(...all.map(o => parseInt(o.訂單編號.replace('O', '')) || 0));
    return 'O' + String(maxNum + 1).padStart(3, '0');
  }

  /** 新增訂單 */
  add(order) {
    const all = this.getAll();
    order.訂單編號 = this.generateId();
    // 自動記錄建立時間
    if (!order.訂單建立時間) {
      const now = new Date();
      order.訂單建立時間 = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');
    }
    order.總金額 = Number(order.總金額) || 0;
    order.客人人數 = Number(order.客人人數) || 1;
    all.push(order);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return order;
  }

  /** 更新訂單 */
  update(id, data) {
    const all = this.getAll();
    const index = all.findIndex(o => o.訂單編號 === id);
    if (index === -1) return null;
    data.總金額 = Number(data.總金額) || 0;
    data.客人人數 = Number(data.客人人數) || 1;
    all[index] = { ...all[index], ...data, 訂單編號: id };
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return all[index];
  }

  /** 刪除訂單 */
  delete(id) {
    const all = this.getAll().filter(o => o.訂單編號 !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** 關鍵字搜尋 */
  search(keyword) {
    const kw = keyword.toLowerCase();
    return this.getAll().filter(o =>
      Object.values(o).some(v => String(v).toLowerCase().includes(kw))
    );
  }

  /** 統計資料 */
  getStats() {
    const all = this.getAll();
    const totalAmount = all.reduce((sum, o) => sum + (Number(o.總金額) || 0), 0);
    return {
      total: all.length,
      totalAmount,
      avgAmount: all.length > 0 ? Math.round(totalAmount / all.length) : 0,
    };
  }
}
