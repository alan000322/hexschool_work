//api
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'chiatzu-vue-hexschool';
//Validate from 助教直播
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate; // 區域註冊：一一對應下面的components
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
//defineRule -> Veevalidate 提供的函式，用來定義規則
defineRule('required', required); //必填 //（自訂名稱, required -> 來自第6行的引入）
defineRule('email', email); //email格式
defineRule('min', min);//最小8馬
defineRule('max', max);//最大10馬

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale  設定語系
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const app = Vue.createApp({
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    data() {
        return {
            cartData: {
                carts: []
            },
            products: [],
            productId: '',
            isLoadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    // console.log(res)
                    this.products = res.data.products;
                })
                .catch(err => {
                    // console.dir(err);
                })
        },
        openProductModal(id) {
            this.$refs.productModal.openModal();
            this.productId = id;
        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    console.log(res)
                    this.cartData = res.data.data;
                })
                .catch(err => {
                    // console.dir(err);
                })
        },
        addToCart(id, qty=1) {
            const data = {
                product_id: id,
                qty,
            }
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then(res => {
                    console.log(res);
                    this.getCart();
                    this.$refs.productModal.closeModal();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    // console.dir(err);
                })
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
            .then(res => {
                console.log(res)
                this.getCart();
                this.isLoadingItem = ''
            })
            .catch(err => {
                // console.dir(err);
            })
        },
        updateCartItem(item) {
            const data = {
                product_id: item.id,
                qty: item.qty,
            }
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data})
                .then(res => {
                    console.log(res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    // console.dir(err);
                })
        },
        createOrder() {
            const order = this.form;
            // console.log(order, 'aaa')
            axios.post(`${apiUrl}/api/${apiPath}/order`, {data: order})
                .then(res => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch(err => {
                    // console.dir(err);
                })

        },
        deleteAllCarts() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    console.dir(err);
                })
          },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
});

app.component('product-modal', {
    props: ['id'],
    template: "#userProductModal",
    data() {
        return {
            modal: {},
            product: {},
            qty: 1,
        }
    },
    watch: {
        id() {
            this.getProduct();
        }

    },
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        },
        getProduct() {
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    // console.log(res)
                    this.product = res.data.product;
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        addToCart() {
            // console.log(this.qty);
            this.$emit('add-cart', this.product.id, this.qty)
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
        
    }
});

app.mount('#app');