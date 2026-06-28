/**
 * OrderController — 租賃訂單控制器
 * 連接 OrderModel 與 OrderView，處理使用者事件
 * 需要 CustomerModel 來查詢客戶名稱
 */
class OrderController {
  constructor(model, view, customerModel) {
    this.model = model;
    this.view = view;
    this.customerModel = customerModel;
  }

  getCustomerMap() {
    const map = {};
    this.customerModel.getAll().forEach(c => { map[c.客戶_ID] = c.姓名; });
    return map;
  }

  init(container) {
    this.view.renderPage(container);
    this.refreshData();
    this.bindEvents();
  }

  refreshData() {
    const data = this.model.getAll();
    const customerMap = this.getCustomerMap();
    this.view.renderTable(data, customerMap);
    this.view.renderStats(this.model.getStats());
  }

  bindEvents() {
    document.getElementById('btn-add').addEventListener('click', () => {
      const customers = this.customerModel.getAll().filter(c => c.會員狀態 !== '停用');
      App.showModal('新增訂單', this.view.getFormHTML(null, customers), () => {
        const data = this.view.getFormData();
        const error = this.view.validateForm(data);
        if (error) { App.showToast(error, 'error'); return false; }
        this.model.add(data);
        this.refreshData();
        App.showToast('訂單新增成功！', 'success');
        return true;
      });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      const keyword = e.target.value.trim();
      if (!keyword) { this.refreshData(); return; }
      const kw = keyword.toLowerCase();
      const customerMap = this.getCustomerMap();
      const data = this.model.getAll().filter(o => {
        const customerName = customerMap[o.客戶_ID] || '';
        return Object.values(o).some(v => String(v).toLowerCase().includes(kw)) ||
               customerName.toLowerCase().includes(kw);
      });
      this.view.renderTable(data, customerMap);
    });

    document.getElementById('data-table-body').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.classList.contains('btn-edit')) {
        const item = this.model.getById(id);
        if (!item) return;
        const customers = this.customerModel.getAll().filter(c => c.會員狀態 !== '停用');
        App.showModal('編輯訂單', this.view.getFormHTML(item, customers), () => {
          const data = this.view.getFormData();
          const error = this.view.validateForm(data);
          if (error) { App.showToast(error, 'error'); return false; }
          this.model.update(id, data);
          this.refreshData();
          App.showToast('訂單資料已更新！', 'success');
          return true;
        });
      }

      if (btn.classList.contains('btn-delete')) {
        App.showConfirm('確定要刪除此訂單嗎？相關明細也會一併刪除，此操作無法復原。', () => {
          if (App.models && App.models.orderDetail) {
            App.models.orderDetail.deleteByOrderId(id);
          }
          this.model.delete(id);
          this.refreshData();
          App.showToast('訂單及其明細已刪除', 'success');
        });
      }
    });
  }
}
