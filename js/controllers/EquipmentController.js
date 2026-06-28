/**
 * EquipmentController — 設備管理控制器
 * 連接 EquipmentModel 與 EquipmentView，處理使用者事件
 */
class EquipmentController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init(container) {
    this.view.renderPage(container);
    this.refreshData();
    this.bindEvents();
  }

  refreshData() {
    const data = this.model.getAll();
    this.view.renderTable(data);
    this.view.renderStats(this.model.getStats());
  }

  bindEvents() {
    document.getElementById('btn-add').addEventListener('click', () => {
      App.showModal('新增設備', this.view.getFormHTML(), () => {
        const data = this.view.getFormData();
        const error = this.view.validateForm(data);
        if (error) { App.showToast(error, 'error'); return false; }
        this.model.add(data);
        this.refreshData();
        App.showToast('設備新增成功！', 'success');
        return true;
      });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      const keyword = e.target.value.trim();
      const data = keyword ? this.model.search(keyword) : this.model.getAll();
      this.view.renderTable(data);
    });

    document.getElementById('data-table-body').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.classList.contains('btn-edit')) {
        const item = this.model.getById(id);
        if (!item) return;
        App.showModal('編輯設備', this.view.getFormHTML(item), () => {
          const data = this.view.getFormData();
          const error = this.view.validateForm(data);
          if (error) { App.showToast(error, 'error'); return false; }
          this.model.update(id, data);
          this.refreshData();
          App.showToast('設備資料已更新！', 'success');
          return true;
        });
      }

      if (btn.classList.contains('btn-delete')) {
        App.showConfirm('確定要刪除此設備嗎？此操作無法復原。', () => {
          this.model.delete(id);
          this.refreshData();
          App.showToast('設備已刪除', 'success');
        });
      }
    });
  }
}
