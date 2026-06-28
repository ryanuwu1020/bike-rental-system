/**
 * OrderDetailController — 訂單明細控制器
 * 連接 OrderDetailModel 與 OrderDetailView，處理使用者事件
 * 需要 OrderModel 和 EquipmentModel 來查詢關聯資料
 */
class OrderDetailController {
  constructor(model, view, orderModel, equipmentModel) {
    this.model = model;
    this.view = view;
    this.orderModel = orderModel;
    this.equipmentModel = equipmentModel;
  }

  getEquipmentMap() {
    const map = {};
    this.equipmentModel.getAll().forEach(e => { map[e.設備編號] = e.自行車型號; });
    return map;
  }

  init(container) {
    this.view.renderPage(container);
    this.refreshData();
    this.bindEvents();
  }

  refreshData() {
    const data = this.model.getAll();
    const equipMap = this.getEquipmentMap();
    this.view.renderTable(data, equipMap);
    this.view.renderStats(this.model.getStats());
  }

  bindEvents() {
    document.getElementById('btn-add').addEventListener('click', () => {
      const orders = this.orderModel.getAll();
      const equipments = this.equipmentModel.getAll();
      App.showModal('新增明細', this.view.getFormHTML(null, orders, equipments, false), () => {
        const data = this.view.getFormData();
        const error = this.view.validateForm(data);
        if (error) { App.showToast(error, 'error'); return false; }
        this.model.add(data);
        this.refreshData();
        App.showToast('明細新增成功！', 'success');
        return true;
      });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      const keyword = e.target.value.trim();
      if (!keyword) { this.refreshData(); return; }
      const kw = keyword.toLowerCase();
      const equipMap = this.getEquipmentMap();
      const data = this.model.getAll().filter(d => {
        const equipName = equipMap[d.設備編號] || '';
        return Object.values(d).some(v => String(v).toLowerCase().includes(kw)) ||
               equipName.toLowerCase().includes(kw);
      });
      this.view.renderTable(data, equipMap);
    });

    document.getElementById('data-table-body').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const orderId = btn.dataset.orderId;
      const detailId = btn.dataset.detailId;

      if (btn.classList.contains('btn-edit')) {
        const item = this.model.getByKey(orderId, detailId);
        if (!item) return;
        const orders = this.orderModel.getAll();
        const equipments = this.equipmentModel.getAll();
        App.showModal('編輯明細', this.view.getFormHTML(item, orders, equipments, true), () => {
          const data = this.view.getFormData();
          data.訂單編號 = orderId;
          const error = this.view.validateForm(data);
          if (error) { App.showToast(error, 'error'); return false; }
          this.model.update(orderId, detailId, data);
          this.refreshData();
          App.showToast('明細資料已更新！', 'success');
          return true;
        });
      }

      if (btn.classList.contains('btn-delete')) {
        App.showConfirm('確定要刪除此明細嗎？此操作無法復原。', () => {
          this.model.delete(orderId, detailId);
          this.refreshData();
          App.showToast('明細已刪除', 'success');
        });
      }
    });
  }
}
