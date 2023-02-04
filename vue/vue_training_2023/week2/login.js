import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

console.log("HI")

const app = createApp({
    data() {
        return {
            user_info: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        login() {
            const api_url =  'https://vue3-course-api.hexschool.io/v2';
            axios.post(`${api_url}/admin/signin`, this.user_info)
            .then(res => {
                const {
                    token,
                    expired
                } = res.data;
                document.cookie = `chiaToken=${ token }; expires=${ new Date(expired) }`
                    // #3 取得 Token（Token 僅需要設定一次）< - 保持登入狀態
                    axios.defaults.headers.common['Authorization'] = token;
                    window.location = './product.html'
                console.log(res)
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
    mounted() {
        
    },
})


app.mount('#app');