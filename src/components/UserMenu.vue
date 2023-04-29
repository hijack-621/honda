<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDropdown,
  ElDropdownMenu,
} from 'element-plus';
import { ref, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
// 控制dialog显隐
const dialogVisible = ref(false);
// 用户表单
const userForm = ref({
  password: '',
  rePassword: '',
});
// 是否是admin
const isAdmin = ref(false);

// 跳转用户管理页面
const toUserManagement = () => {
  router.push('/user');
};
//跳转测点公差页面
const toMpSet = () =>  {
  router.push('/mpSet');
}

let user = ref(localStorage.getItem('user')) ?? '用户'

// 判断是否是admin
proxy.$http
  .post(
    '/api/auth/isAdmin',
    {},
    {
      headers: {
        token: localStorage.getItem('token'),
      },
    }
  )
  .then((res: any) => {
    if (res.data.data == true) {
      isAdmin.value = true;
    }
  });

// 提交用户表单
const submitForm = () => {
  if (userForm.value.password === '' || userForm.value.rePassword === '') {
    ElMessage({
      type: 'warning',
      message: '填写不能为空！',
    });
    return;
  } else if (userForm.value.password !== userForm.value.rePassword) {
    ElMessage({
      type: 'error',
      message: '两次密码填写不一致！',
    });
    return;
  }
  let info = {
    url: '/api/auth/changePassword',
    data: userForm.value.password,
    word: '修改',
  };
  proxy.$http
    .request({
      method: 'post',
      url: info.url,
      data: info.data,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        token: localStorage.getItem('token'),
      },
    })
    .then((res: any) => {
      if (res.data.status === 200) {
        ElMessage({
          type: 'success',
          message: `${info.word}成功！`,
        });
      } else {
        ElMessage({
          type: 'error',
          message: res.data.msg,
        });
      }
    })
    .catch((error: any) => {
      ElMessage({
        type: 'error',
        message: error.message,
      });
    })
    .finally(() => {
      dialogVisible.value = false;
      userForm.value = {
        password: '',
        rePassword: '',
      };
    });
};

// 退出登录
const logOut = () => {
  proxy.$http
    .post(
      '/api/auth/logout',
      {},
      {
        headers: {
          token: localStorage.getItem('token'),
        },
      }
    )
    .then((res: any) => {
      if (res.data.status == 200) {
        localStorage.removeItem('user')
        router.push('/login');
      }
    });
};
</script>

<template>
  <div :style="{ margin: '0 10px' }">
    <ElDropdown class=" w-21">
      <span
        class="el-dropdown-link"
        :style="{ color: '#fff' }"
      >
        <span>{{user}}</span>
        <ElIcon class="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </span>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem v-if="isAdmin" @click="router.push('/set')">测点设置</ElDropdownItem>
          <ElDropdownItem @click="dialogVisible = true">修改密码</ElDropdownItem>
          <ElDropdownItem
            v-if="isAdmin"
            @click="toUserManagement"
          >
            用户管理
          </ElDropdownItem>
          <ElDropdownItem
            v-if="isAdmin"
            @click="toMpSet"
          >
            测点管理
          </ElDropdownItem>
          <ElDropdownItem @click="logOut">退出登录</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <ElDialog
      class="user-management-dialog"
      v-model="dialogVisible"
      title="修改密码"
      width="25%"
    >
      <ElForm
        :model="userForm"
        :style="{ textAlign: 'left' }"
        label-width="80px"
      >
        <ElFormItem
          label="新密码"
          prop="password"
        >
          <ElInput
            v-model="userForm.password"
            :style="{ width: '100%' }"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </ElFormItem>
        <ElFormItem
          label="确认密码"
          prop="rePassword"
        >
          <ElInput
            v-model="userForm.rePassword"
            :style="{ width: '100%' }"
            type="password"
            show-password
            placeholder="请输入确认密码"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton
            type="primary"
            @click="submitForm"
          >
            确认
          </ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss">
.el-dialog.user-management-dialog {
  --el-text-color-regular: #fff;
  --el-bg-color-overlay: #011a2c;
  --el-fill-color-blank: var(--el-bg-color-overlay);
  --el-border-color: #04408a;
  --el-text-color-primary: #fff;
  --el-color-primary: #2561d1;
  --el-dialog-bg-color: #0b304e;

  .el-input {
    --el-input-bg-color: #000b13;
    --el-input-text-color: #d8d8d8;
    --el-input-hover-border-color: #2b539e;

    ::placeholder {
      color: #727272;
    }
  }

  .el-button {
    --el-button-active-bg-color: #85a8e9;
    --el-button-hover-bg-color: #92aee2;
    --el-button-disabled-text-color: #ffffff52;
    --el-button-disabled-bg-color: #626060;
    --el-button-disabled-border-color: #6e6161;
  }

  .el-button--primary {
    background-color: var(--el-color-primary);
    --el-button-active-bg-color: #2c59ac;
    --el-button-hover-bg-color: #4166ac;
  }
}
</style>
