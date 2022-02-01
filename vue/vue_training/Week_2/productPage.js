import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
const apiUrl  = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'chiatzu-vue-hexschool';
createApp({
    data() {
        return {
            Temp: {},
            Products: [],
        }
    }, // data
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)chiaToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            console.log(token);
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${apiUrl}/api/user/check`)
                .then(res => {
                    console.log(res)
                    this.getProducts();
                })
                .catch(err => {
                    console.dir(err);
                    window.location = './index.html'
                })
        },
        getProducts() {
            // #5 取得後台產品列表
            axios.get(`${apiUrl}/api/${apiPath}/admin/products`)
                .then(res => {
                    console.log(res.data.products);
                    this.Products = res.data.products;
                    console.log(this.Products)
                    Object.values(this.Products).forEach((item) => {
                        console.log(item);
                        })
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        logOut() {
            axios.post(`${apiUrl}/logout`)
                .then(res => {
                    console.log(res)
                    console.log('已登出')
                    setTimeout(() => {
                        
                    }, 5000);
                    window.location = './index.html'
                })
                .catch(err => {
                    console.dir(err);
                    
                })
        }


    }, // methods
    mounted() {
        this.checkLogin();
    },

}).mount('#app');