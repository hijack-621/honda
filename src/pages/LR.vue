<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="login-register bg-slate-300 w-full h-full justify-center items-center">
          <section class="logo w-[40%] h-[33%] mt-32  ">
            <img class=" w-full h-auto" src="../assets/images/honda.png" alt="logo">
          </section>
          <div class="contain -mt-32 flex-1">
            <div class="big-contain" key="bigContainLogin">
              <div class="btitle">用户登录</div>
              <div class="bform">
                <input placeholder="用户名" autocomplete="off"  v-model="form.username" @keyup.enter="login" />
                <input type="password"     autocomplete="off" placeholder="密码" v-model="form.userpwd" @keyup.enter="login" />
              </div>
              <button class="bbutton" @click="login">
                登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useDraw from "~/assets/utils/useDraw";
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useMainStore } from '~/store/index'
const { proxy } = getCurrentInstance();
const { appRef, calcRate, windowDraw } = useDraw();
let router = useRouter();
let form = ref({ username: '', userpwd: '', })
let loading = ref(true);

function login() {
  if (form.value.username != '' && form.value.userpwd != '') {
    proxy
      .$http({
        method: 'post',
        url: '/api/auth/login',
        data: {
          username: form.value.username,
          password: form.value.userpwd,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem('token', res.data.data.token);
          ElMessage({
            message: '登录成功！',
            type: 'success',
          });
          localStorage.setItem('user', form.value.username);
          router.push('/index');
        } else if (res.data.status === 401) {
          ElMessage({
            message: '用户名或密码错误，请检查！',
            type: 'error',
          });
        } else {
          ElMessage({
            message: res.data.msg,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        ElMessage({
          message: err.message,
          type: 'error',
        });
      });
  } else {
    ElMessage({
      message: '填写不能为空！',
      type: 'warning',
    });
  }
}
function cancelLoading() {
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
onMounted(() => {
  cancelLoading()
  calcRate()
  windowDraw()
})

</script>

<style lang="scss" scoped="scoped">
.login-register {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: linear-gradient(#001637, #034072);

  .logo {
   
  }
}

.contain {
  width: 40%;
  flex: 1;
}

.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btitle {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Microsoft YaHei, Microsoft YaHei-Bold';
  color: #ffffff;
}

.bform {
  width: 100%;
  height: 40%;
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.bform .errTips {
  display: block;
  width: 50%;
  text-align: left;
  color: red;
  font-size: 0.7em;
  margin-left: 1em;
}

.bform input {
  width: 100%;
  height: 70px;
  border: none;
  outline: none;
  background: #182745 !important;
  border: 1px solid #1c3058;
  border-radius: 3px;
  transition: all 0.3s;
  text-align: center;
  font-size: 21px;
  &::placeholder {
    text-align: center;
  }

  &:focus {
    background: #182745 !important;
    box-shadow: 0 0 3px #0287f3, 0 0 6px #0287f3;
  }
}

.bbutton {
  width: 100%;
  height: 70px;
  outline: none;
  background: linear-gradient(90deg, #2158a9, #266cd4 51%, #2158a9);
  border: 1px solid #1c3058;
  border-radius: 3px;
  color: #fff;
  font-size: 21px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(#2158a9, rgb(26, 148, 247));
  }

  &:active {
    background: linear-gradient(#305a97, #1476c7);
  }
}
</style>
