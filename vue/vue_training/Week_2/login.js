// 示範串接免驗證 API
// https://hexschool.github.io/vue3-courses-swaggerDoc/
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
        return {
            user: {
                username: "",
                password: "",
            }
            
        }
    },
    methods: {
        Login() {
            console.log(this.user)
            const apiUrl =  'https://vue3-course-api.hexschool.io/v2';
            // const apiPath =  'chiatzu-vue-hexschool';
            axios.post(`${apiUrl}/admin/signin`, this.user)
                .then(res => {
                    console.log(res)
                        // 解構
                    const {
                        token,
                        expired
                    } = res.data;
                    //console.log(token, expired);
                    document.cookie = `chiaToken=${ token }; expires=${ new Date(expired) }`
                    // #3 取得 Token（Token 僅需要設定一次）< - 保持登入狀態
                    axios.defaults.headers.common['Authorization'] = token;
                    window.location = './productPage.html'
                })
                .catch(err => {
                    console.dir(err);
                })
        }
    },
    mounted() {
        
    }
}).mount('#app');