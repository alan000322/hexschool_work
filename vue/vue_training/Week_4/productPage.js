import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'chiatzu-vue-hexschool';
let productModal = '';
let delProductModal = '';
const app = createApp({
    components: {
        pagination,
    },
    data() {
        return {
            // Product Management
            tempProduct: {
                imageUrl: [],
            },
            isNew: false,
            Products: [],
            data_success_show: true,
            data_fail_show: true,
            data_success_remove_show: true,
            num: '',
            pagination: {},
        }
    }, // data
    methods: {
        // Login, Logout
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)chiaToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //console.log(token);
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${apiUrl}/api/user/check`)
                .then(res => {
                    //console.log(res)
                    this.getProducts();
                })
                .catch(err => {
                    //console.dir(err);
                    alert('登入錯誤')
                })
        },
        logOut() {
            axios.post(`${apiUrl}/logout`)
                .then(res => {
                    window.location = './index.html'
                })
                .catch(err => {
                    console.dir(err);

                })
        },
        

        //Product Management
        getProducts(page=1) {
            // #5 取得後台產品列表
            axios.get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
                .then(res => {
                    this.Products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err => {
                    //console.dir(err);
                    alert('取得資料有問題');
                })
        },
        // addNewProducts() {
        //     //console.log(this.tempProduct.title)
        //     let url = `${apiUrl}/api/${apiPath}/admin/product`;
        //     axios.post(url, { data: this.Temp })
        //     .then((res) => {
        //         //console.log(res);
        //         this.getProducts(); 
        //         new_modal.hide();
        //         this.successAlert();
        //     })
        //     .catch((err) => {
        //         this.failAlert(err.data.message)
                

        //     })
        // },
        // editProducts() {
        //     let url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        //     axios.put(url, { data: this.Temp })
        //     .then((res) => {
        //         //console.log(res);
        //         this.getProducts(); 
        //         this.successAlert();
        //         edit_modal.hide();
                
                
        //     })
        //     .catch((err) => {
        //         //console.log(err.data.message);
        //         this.failAlert(err.data.message)

        //     })
        // },


        //助教 week3 寫法 將編輯產品跟新增產品寫在同一個function，以isNew作判斷
        
//Alert
        successAlert() {
            this.data_success_show = false;
            //console.log(this.data_success_show);
            setTimeout(() => {
                //console.log('start', this.data_show);
                this.data_success_show = true;
                //console.log('end', this.data_show);
            }, 2000);
        },
        successremoveAlert() {
            this.data_success_remove_show = false;
            //console.log(this.data_success_remove_show);
            setTimeout(() => {
                //console.log('start', this.data_success_remove_show);
                this.data_success_remove_show = true;
                //console.log('end', this.data_success_remove_show);
            }, 2000);
        },

        

        //Modal
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
            this.isNew = true;
            productModal.show();
            }  // 如果是建立新產品   //使用week3助教範例寫法
            else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            }   // 如果是編輯產品   //使用week3助教範例寫法
            else if (isNew === 'del') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }    // 如果是刪除產品   //使用week3助教範例寫法
        },

        // Week3 助教寫法
        

    }, // methods
    mounted() {
        this.checkLogin();
        //Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
    },

});

app.component('productModal', {
    props: ['tempProduct', 'isNew'],
    template: `#templateForProductModel`,
    methods: {
        updateProduct() {
            //預設：新增產品
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let http = 'post';
            
            //編輯產品 -> 如果不是新產品
            if (!this.isNew) {
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }
            
            axios[http](url, { data: this.tempProduct }).then((response) => {
                // alert(response.data.message);
                //this.successAlert(); //外層方法
                this.$emit('success-alert')
                productModal.hide();
                //this.getProducts(); //外層方法
                this.$emit('get-products')
            }).catch((err) => {
                console.log(err)
                alert(err.data.message);
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        ``},
        
    }

});
app.component('delProductModal', {
    props: ['tempProduct'],
    template: `#templateFordelProductModel`,
    methods: {
        removeProducts() {
            let url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url, { data: this.Temp })
            .then((res) => {
                //console.log(res);
                //this.getProducts(); //外層
                this.$emit('get-products')
                delProductModal.hide();
                //this.successremoveAlert(); //外層
                this.$emit('successremove-alert')

            })
            .catch((err) => {
                console.log(err.data.message);
                alert(err.data.message)

            })
        },
    }
})

app.mount('#app');