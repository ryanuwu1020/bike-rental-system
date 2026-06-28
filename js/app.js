/**
 * App — 應用程式進入點
 * 負責初始化所有 MVC 元件、導航路由、全域 UI 功能
 */
const App = {
  models: {},
  views: {},
  controllers: {},
  currentPage: 'customer',

  init() {
    this.models = {
      customer: new CustomerModel(),
      equipment: new EquipmentModel(),
      order: new OrderModel(),
      orderDetail: new OrderDetailModel(),
    };

    this.views = {
      customer: new CustomerView(),
      equipment: new EquipmentView(),
      order: new OrderView(),
      orderDetail: new OrderDetailView(),
    };

    this.controllers = {
      customer: new CustomerController(this.models.customer, this.views.customer),
      equipment: new EquipmentController(this.models.equipment, this.views.equipment),
      order: new OrderController(this.models.order, this.views.order, this.models.customer),
      detail: new OrderDetailController(this.models.orderDetail, this.views.orderDetail, this.models.order, this.models.equipment),
    };

    this.seedData();
    this.setupNavigation();
    this.setupModal();
    this.navigate('customer');
  },

  setupNavigation() {
    document.querySelectorAll('.sidebar nav a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(link.dataset.page);
      });
    });
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.sidebar nav a[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === page);
    });
    const container = document.getElementById('page-container');
    container.innerHTML = '';
    container.className = 'page-enter';
    if (this.controllers[page]) {
      this.controllers[page].init(container);
    }
  },

  // ── Modal ──
  _modalSubmitHandler: null,

  setupModal() {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
    document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) this.hideModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
        const c = document.querySelector('.confirm-overlay');
        if (c) c.remove();
      }
    });
    document.getElementById('modal-submit').addEventListener('click', () => {
      if (this._modalSubmitHandler) {
        const result = this._modalSubmitHandler();
        if (result !== false) this.hideModal();
      }
    });
  },

  showModal(title, formHTML, onSubmit) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
    this._modalSubmitHandler = onSubmit;
    requestAnimationFrame(() => {
      const el = document.querySelector('#modal-body input:not([type="hidden"]), #modal-body select');
      if (el) el.focus();
    });
  },

  hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    this._modalSubmitHandler = null;
  },

  // ── Toast ──
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3200);
  },

  // ── Confirm ──
  showConfirm(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-icon">⚠️</div>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn btn-cancel" id="confirm-cancel">取消</button>
          <button class="btn btn-delete" id="confirm-ok" style="padding:10px 24px;">確定刪除</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirm-ok').addEventListener('click', () => { onConfirm(); overlay.remove(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  },

  // ── 示範資料 ──
  seedData() {
    if (localStorage.getItem('_bike_rental_seeded')) return;

    localStorage.setItem('customers', JSON.stringify([
      { 客戶_ID: 'C001', 姓名: '王小明', 聯絡方式: '0912-345-678', 會員狀態: 'VIP' },
      { 客戶_ID: 'C002', 姓名: '李美華', 聯絡方式: '0923-456-789', 會員狀態: '一般' },
      { 客戶_ID: 'C003', 姓名: '張大偉', 聯絡方式: '0934-567-890', 會員狀態: '一般' },
      { 客戶_ID: 'C004', 姓名: '陳雅琳', 聯絡方式: '0945-678-901', 會員狀態: 'VIP' },
      { 客戶_ID: 'C005', 姓名: '林志偉', 聯絡方式: '0956-789-012', 會員狀態: '停用' },
    ]));

    localStorage.setItem('equipment', JSON.stringify([
      { 設備編號: 'E001', 自行車型號: '捷安特 ATX 660', 購入日期: '2024-03-15', 當前狀態: '可用' },
      { 設備編號: 'E002', 自行車型號: '美利達 探索者 100', 購入日期: '2024-05-20', 當前狀態: '租用中' },
      { 設備編號: 'E003', 自行車型號: '捷安特 Escape 3', 購入日期: '2024-01-10', 當前狀態: '可用' },
      { 設備編號: 'E004', 自行車型號: '美利達 斯特拉 300', 購入日期: '2024-07-01', 當前狀態: '維修中' },
      { 設備編號: 'E005', 自行車型號: '捷安特 TCR Advanced', 購入日期: '2024-02-28', 當前狀態: '可用' },
      { 設備編號: 'E006', 自行車型號: '美利達 銳克多 400', 購入日期: '2024-04-15', 當前狀態: '租用中' },
    ]));

    localStorage.setItem('orders', JSON.stringify([
      { 訂單編號: 'O001', 訂單建立時間: '2025-06-15 10:30', 總金額: 800, 客人人數: 2, 客戶_ID: 'C001' },
      { 訂單編號: 'O002', 訂單建立時間: '2025-06-18 14:00', 總金額: 500, 客人人數: 1, 客戶_ID: 'C002' },
      { 訂單編號: 'O003', 訂單建立時間: '2025-06-20 09:15', 總金額: 1200, 客人人數: 3, 客戶_ID: 'C004' },
    ]));

    localStorage.setItem('orderDetails', JSON.stringify([
      { 訂單編號: 'O001', 明細編號: 'D001', 設備編號: 'E001', 預計歸還時間: '2025-06-15 18:00', 實際歸還時間: '2025-06-15 17:30', 單車金額: 400, 單台逾期費用: 0 },
      { 訂單編號: 'O001', 明細編號: 'D002', 設備編號: 'E003', 預計歸還時間: '2025-06-15 18:00', 實際歸還時間: '2025-06-15 19:00', 單車金額: 400, 單台逾期費用: 100 },
      { 訂單編號: 'O002', 明細編號: 'D001', 設備編號: 'E002', 預計歸還時間: '2025-06-18 22:00', 實際歸還時間: '', 單車金額: 500, 單台逾期費用: 0 },
      { 訂單編號: 'O003', 明細編號: 'D001', 設備編號: 'E005', 預計歸還時間: '2025-06-20 17:00', 實際歸還時間: '2025-06-20 16:30', 單車金額: 400, 單台逾期費用: 0 },
      { 訂單編號: 'O003', 明細編號: 'D002', 設備編號: 'E006', 預計歸還時間: '2025-06-20 17:00', 實際歸還時間: '', 單車金額: 400, 單台逾期費用: 0 },
      { 訂單編號: 'O003', 明細編號: 'D003', 設備編號: 'E003', 預計歸還時間: '2025-06-20 17:00', 實際歸還時間: '2025-06-20 17:15', 單車金額: 400, 單台逾期費用: 0 },
    ]));

    localStorage.setItem('_bike_rental_seeded', 'true');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
