/**
 * OrderDetailModel — 訂單明細資料模型
 * 使用複合主鍵 (訂單編號 + 明細編號)
 * 負責明細的 CRUD 操作與 localStorage 資料持久化
 */
class OrderDetailModel {
  constructor() {
    this.storageKey = 'orderDetails';
  }

  /** 取得所有明細 */
  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /** 依複合主鍵取得明細 */
  getByKey(orderId, detailId) {
    return this.getAll().find(
      d => d.訂單編號 === orderId && d.明細編號 === detailId
    ) || null;
  }

  /** 依訂單編號取得所有明細 */
  getByOrderId(orderId) {
    return this.getAll().filter(d => d.訂單編號 === orderId);
  }

  /** 依設備編號取得所有明細 */
  getByEquipmentId(equipmentId) {
    return this.getAll().filter(d => d.設備編號 === equipmentId);
  }

  /** 自動產生明細編號 (D001, D002, ...) — 依訂單內流水號 */
  generateDetailId(orderId) {
    const details = this.getByOrderId(orderId);
    if (details.length === 0) return 'D001';
    const maxNum = Math.max(...details.map(d => parseInt(d.明細編號.replace('D', '')) || 0));
    return 'D' + String(maxNum + 1).padStart(3, '0');
  }

  /** 新增明細 */
  add(detail) {
    const all = this.getAll();
    detail.明細編號 = this.generateDetailId(detail.訂單編號);
    detail.單車金額 = Number(detail.單車金額) || 0;
    detail.單台逾期費用 = Number(detail.單台逾期費用) || 0;
    all.push(detail);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return detail;
  }

  /** 更新明細 */
  update(orderId, detailId, data) {
    const all = this.getAll();
    const index = all.findIndex(
      d => d.訂單編號 === orderId && d.明細編號 === detailId
    );
    if (index === -1) return null;
    data.單車金額 = Number(data.單車金額) || 0;
    data.單台逾期費用 = Number(data.單台逾期費用) || 0;
    all[index] = { ...all[index], ...data, 訂單編號: orderId, 明細編號: detailId };
    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return all[index];
  }

  /** 刪除明細 */
  delete(orderId, detailId) {
    const all = this.getAll().filter(
      d => !(d.訂單編號 === orderId && d.明細編號 === detailId)
    );
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** 依訂單編號刪除所有明細 */
  deleteByOrderId(orderId) {
    const all = this.getAll().filter(d => d.訂單編號 !== orderId);
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** 關鍵字搜尋 */
  search(keyword) {
    const kw = keyword.toLowerCase();
    return this.getAll().filter(d =>
      Object.values(d).some(v => String(v).toLowerCase().includes(kw))
    );
  }

  /** 統計資料 */
  getStats() {
    const all = this.getAll();
    const totalAmount = all.reduce((sum, d) => sum + (Number(d.單車金額) || 0), 0);
    const totalLateFee = all.reduce((sum, d) => sum + (Number(d.單台逾期費用) || 0), 0);
    const returned = all.filter(d => d.實際歸還時間 && d.實際歸還時間.trim() !== '').length;
    return {
      total: all.length,
      totalAmount,
      totalLateFee,
      returned,
      notReturned: all.length - returned,
    };
  }
}
