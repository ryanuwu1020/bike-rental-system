/**
 * EquipmentModel — 設備庫存資料模型
 * 負責設備的 CRUD 操作與 localStorage 資料持久化
 */
class EquipmentModel {
  constructor() {
    this.storageKey = 'equipment';
  }

  /** 取得所有設備 */
  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /** 依設備編號取得設備 */
  getById(id) {
    return this.getAll().find(e => e.設備編號 === id) || null;
  }

  /** 取得可用的設備 */
  getAvailable() {
    return this.getAll().filter(e => e.當前狀態 === '可用');
  }

  /** 自動產生流水號 ID (E001, E002, ...) */
  generateId() {
    const all = this.getAll();
    if (all.length === 0) return 'E001';
    const maxNum = Math.max(...all.map(e => parseInt(e.設備編號.replace('E', '')) || 0));
    return 'E' + String(maxNum + 1).padStart(3, '0');
  }

  /** 新增設備 */
  add(equipment) {
    const all = this.getAll();
    equipment.設備編號 = this.generateId();
    all.push(equipment);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return equipment;
  }

  /** 更新設備 */
  update(id, data) {
    const all = this.getAll();
    const index = all.findIndex(e => e.設備編號 === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data, 設備編號: id };
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return all[index];
  }

  /** 刪除設備 */
  delete(id) {
    const all = this.getAll().filter(e => e.設備編號 !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** 關鍵字搜尋 */
  search(keyword) {
    const kw = keyword.toLowerCase();
    return this.getAll().filter(e =>
      Object.values(e).some(v => String(v).toLowerCase().includes(kw))
    );
  }

  /** 統計資料 */
  getStats() {
    const all = this.getAll();
    return {
      total: all.length,
      available: all.filter(e => e.當前狀態 === '可用').length,
      rented: all.filter(e => e.當前狀態 === '租用中').length,
      maintenance: all.filter(e => e.當前狀態 === '維修中').length,
    };
  }
}
