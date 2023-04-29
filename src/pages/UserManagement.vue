<script setup lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElForm,
  ElButton,
  ElCol,
  ElMessage,
  ElMessageBox,
  ElDialog,
  type Action,
} from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ref, getCurrentInstance } from 'vue';

// 表格数据格式
interface Tdata {
  id?: number;
  username: string;
  isAdmin: string;
}

const { proxy } = getCurrentInstance() as any;
const router = useRouter();
// 表格数据
const tableData = ref<Array<Tdata> | undefined>(undefined);
// 控制dialog显隐
const dialogVisible = ref(false);

// 表格最大高度
const tableMaxHeight = ref<number>();
// 用户表单
const userForm = ref({
  username: '',
  password: '',
  rePassword: '',
});

// 打开删除提示框
const open = (row: Tdata) => {
  let msg = '';
  msg = row.username;
  ElMessageBox.confirm(`确认删除用户${msg}？`, '提示', {
    type: 'error',
    icon: markRaw(Delete),
    customClass: 'user-management-message-box',
    callback: (action: Action) => {
      if (action === 'confirm') {
        proxy.$http
          .request({
            method: 'post',
            url: '/api/auth/deleteUser',
            data: row.id,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              token: localStorage.getItem('token'),
            },
          })
          .then((res: any) => {
            if (res.data.status === 200) {
              ElMessage({
                type: 'success',
                message: '删除成功！',
              });
              getUserList();
            } else {
              ElMessage({
                type: 'error',
                message: '删除失败！',
              });
            }
          })
          .catch((error: any) => {
            ElMessage({
              type: 'error',
              message: '删除失败！',
            });
          });
      }
    },
  });
};

// 计算表格最大高度
const doAdjust = () => {
  // 窗口高度减去表格顶部与窗口顶部的距离
  tableMaxHeight.value =
    window.innerHeight -
    document.getElementsByClassName('fix-header-table')[0].getBoundingClientRect().y;
  // 表格底部留距离放页码等
  tableMaxHeight.value -= 70;
  // 避免表格太小
  if (tableMaxHeight.value < 150) {
    tableMaxHeight.value = 150;
  }
};

// 获取用户列表
const getUserList = () => {
  proxy.$http
    .post(
      '/api/auth/getUserList',
      {},
      {
        headers: {
          token: localStorage.getItem('token'),
        },
      }
    )
    .then((res: any) => {
      tableData.value = res.data.data;
    })
    .catch(() => {
      ElMessage('请登录后再操作！');
      router.push('/login');
      return;
    });
};
getUserList();

// 设置dialog打开
const openDialog = () => {
  userForm.value = {
    username: '',
    password: '',
    rePassword: '',
  };
  dialogVisible.value = true;
};

// 提交用户表单
const submitForm = () => {
  if (
    userForm.value.username === '' ||
    userForm.value.password === '' ||
    userForm.value.rePassword === ''
  ) {
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
    url: '/api/auth/createUser',
    data: {
      username: userForm.value.username,
      password: userForm.value.password,
    },
    word: '新增',
  };
  proxy.$http
    .request({
      method: 'post',
      url: info.url,
      data: info.data,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        token: localStorage.getItem('token'),
      },
    })
    .then((res: any) => {
      if (res.data.status === 200) {
        ElMessage({
          type: 'success',
          message: `${info.word}成功！`,
        });
        getUserList();
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
    });
};

// 添加节流
const adjustTableMaxHeight = useThrottleFn(doAdjust, 600);
onMounted(() => {
  // 待dom加载完毕，执行一次表格高度调整
  nextTick(() => {
    adjustTableMaxHeight();
  });
  // 监听窗口大小对表格高度进行调整
  window.addEventListener('resize', adjustTableMaxHeight);
});
onActivated(() => {
  adjustTableMaxHeight();
});
onDeactivated(() => {
  window.removeEventListener('resize', adjustTableMaxHeight);
});
onUnmounted(() => {
  window.removeEventListener('resize', adjustTableMaxHeight);
});
</script>

<template>
  <div class="container-box user-management">
    <Header
      title="用户管理"
      :show="{ logoShow: false, searchShow: false }"
    ></Header>
    <div class="container-inner">
      <ElRow
        :gutter="10"
        :style="{ marginBottom: '10px' }"
      >
        <ElCol :span="1.5">
          <ElButton
            type="primary"
            :icon="Plus"
            @click="openDialog()"
          >
            新增
          </ElButton>
        </ElCol>
      </ElRow>

      <ElTable
        class="fix-header-table"
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
      >
        <ElTableColumn
          prop="username"
          label="用户名"
          width="220"
        />
        <ElTableColumn
          prop="isAdmin"
          label="是否是admin用户"
          width="220"
          align="center"
        >
          <template #default="scope">
            <span :style="{ color: scope.row.isAdmin == 1 ? '#46bc0f' : '#ffffff' }">
              {{ scope.row.isAdmin == 1 ? '是' : '否' }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作">
          <template #default="scope">
            <ElButton
              plain
              size="small"
              type="danger"
              :icon="Delete"
              @click="open(scope.row)"
            >
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <ElDialog
      class="user-management-dialog"
      v-model="dialogVisible"
      title="新增用户"
      width="25%"
    >
      <ElForm
        :model="userForm"
        :style="{ textAlign: 'left' }"
        label-width="80px"
      >
        <ElFormItem
          label="用户名"
          prop="username"
        >
          <ElInput
            v-model="userForm.username"
            :style="{ width: '100%' }"
            placeholder="请输入用户名"
          />
        </ElFormItem>
        <ElFormItem
          label="密码"
          prop="password"
        >
          <ElInput
            v-model="userForm.password"
            :style="{ width: '100%' }"
            type="password"
            show-password
            placeholder="请输入密码"
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

<style lang="scss" scoped>
.container-box {
  width: 100%;
  height: 100%;
  background: linear-gradient(#001637, #064981);

  .container-inner {
    padding: 20px;
  }
}
</style>

<style lang="scss">
.user-management,
.user-management-dialog,
.user-management-message-box {
  --el-text-color-regular: #fff;
  --el-bg-color-overlay: #011a2c;
  --el-fill-color-blank: var(--el-bg-color-overlay);
  --el-border-color: #04408a;
  --el-text-color-primary: #fff;
  --el-color-primary: #2561d1;

  .el-input {
    --el-input-bg-color: #000b13;
    --el-input-text-color: #d8d8d8;
    --el-input-hover-border-color: #2b539e;

    ::placeholder {
      color: #727272;
    }
  }

  .el-table {
    --el-bg-color: #02385f;
    --el-table-row-hover-bg-color: #00233b;
    --el-border-color-lighter: var(--el-border-color);
    --el-table-header-text-color: var(--el-text-color-regular);
  }

  .el-table .cell {
    padding: 0 12px;
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

  .el-button--danger {
    background-color: var(--el-button-bg-color);
    --el-button-bg-color: #9e3636;
    --el-button-bg-color: #9e3636;
    --el-button-active-bg-color: #a02e2e;
    --el-button-hover-bg-color: #a54e4e;

    &.is-plain {
      --el-button-bg-color: #00000000;
      --el-button-active-bg-color: #a02e2e;
      --el-button-hover-bg-color: #a54e4e;
      --el-button-text-color: #cc4343;
      --el-button-border-color: var(--el-button-text-color);
    }
  }
}

.user-management-dialog {
  --el-dialog-bg-color: #0b304e;
}

.user-management-message-box {
  background-color: #0b304e;
  border: none;

  .el-message-box__btns .el-button span {
    color: var(--el-text-color-regular) !important;
  }
}
</style>
