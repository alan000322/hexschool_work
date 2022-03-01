import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'chiatzu-vue-hexschool';
let edit_modal = '';
let delete_modal = '';
let new_modal = '';
const app = createApp({
    components: {
        pagination
    },
    data() {
        return {
            // Product Management
            Temp: {
                imageUrl: [],
            },
            Products: [],
            data_success_show: true,
            data_fail_show: true,
            data_success_remove_show: true,
            error_message: '',
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
                    window.location = './index.html'
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
        failAlert(error) {
            this.data_fail_show = false;
            this.error_message = error
            console.log(this.data_fail_show);
            setTimeout(() => {
                //console.log('start', this.data_fail_show);
                this.data_fail_show = true;
                //console.log('end', this.data_fail_show);
            }, 5000);
        },

        //Product Management
        getProducts(page=1) {
            // #5 取得後台產品列表
            // query 的用法
            axios.get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
                .then(res => {
                    this.Products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err => {
                    //console.dir(err);
                })
        },
        addNewProducts() {
            //console.log(this.Temp.title)
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            axios.post(url, { data: this.Temp })
            .then((res) => {
                //console.log(res);
                this.getProducts(); 
                new_modal.hide();
                this.successAlert();
            })
            .catch((err) => {
                this.failAlert(err.data.message)
                

            })
        },
        editProducts() {
            let url = `${apiUrl}/api/${apiPath}/admin/product/${this.Temp.id}`;
            axios.put(url, { data: this.Temp })
            .then((res) => {
                //console.log(res);
                this.getProducts(); 
                this.successAlert();
                edit_modal.hide();
                
                
            })
            .catch((err) => {
                //console.log(err.data.message);
                this.failAlert(err.data.message)

            })
        },
        removeProducts() {
            let url = `${apiUrl}/api/${apiPath}/admin/product/${this.Temp.id}`;
            axios.delete(url, { data: this.Temp })
            .then((res) => {
                //console.log(res);
                this.getProducts(); 
                delete_modal.hide();
                this.successremoveAlert();
            })
            .catch((err) => {
                //console.log(err.data.message);
                this.failAlert(err.data.message)

            })
        },

        //Modal
        openeditModal(item) {
            this.Temp = {...item};
            edit_modal.show();
        },
        closeeditModal(item) {
            this.Temp = {...item};
            edit_modal.hide();
        },
        deleteModal(item) {
            this.Temp = {...item};
            delete_modal.show();
        },
        openNewModal(item) {
            this.Temp = {};
            new_modal.show();
        }



    }, // methods
    mounted() {
        this.checkLogin();
        edit_modal = new bootstrap.Modal(document.querySelector('#editModal')); //# 原本在上方抓取dom元素，等待畫面完整以後才進行觸發
        delete_modal = new bootstrap.Modal(document.querySelector('#deleteModal')); //# 原本在上方抓取dom元素，等待畫面完整以後才進行觸發
        new_modal = new bootstrap.Modal(document.querySelector('#newModal')); //# 原本在上方抓取dom元素，等待畫面完整以後才進行觸發
    },

});

app.component('productModal', {
    props: ['tempProduct'],
    template: '#template4newModal'
});


app.mount('#app');