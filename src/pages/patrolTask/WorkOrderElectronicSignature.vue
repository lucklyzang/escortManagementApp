<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
        <NavBar path="/workOrderDetails" title="工单完成签名" />
    </div>
    <div class="content">
        <ElectronicSignature ref="mychild"></ElectronicSignature>
    </div>
    <div class="btn-area">
        <div class="cancel-btn" @click="cancel">取消</div>
        <div class="overwrite-btn" @click="rewrite">重写</div>
        <div class="sure-btn" @click="sure">确认</div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import ElectronicSignature from '@/components/ElectronicSignature'
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
export default {
  name: "WorkOrderElectronicSignature",
  components: {
    NavBar,
    ElectronicSignature
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
    
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/workOrderDetails")
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","currentElectronicSignature"])
  },

  methods: {
    ...mapMutations([]),

    // 签名重写
    rewrite () {
      this.$refs.mychild.overwrite()
    },

    // 签名确认
    sure () {
        this.$refs.mychild.commitSure();
        console.log(this.currentElectronicSignature)
    },

    // 签名取消
    cancel () {
        this.$refs.mychild.overwrite();
        this.$router.push({
          path: "/workOrderDetails"
        })
    },
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  height: 0;
  .nav {
    width: 100%;
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: #101010 !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
            color: #101010 !important;
            font-size: 22px !important;
        }
        .van-nav-bar__title {
            color: #101010 !important;
            font-size: 16px !important;
        }
    }
  };
  .content {
    width: 96%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0;
    .signature {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        /deep/ .signatureBox {
            width: 100% !important;
            flex: 1
        }
    }
  };
  .btn-area {
    width: 96%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    >div {
        font-size: 14px;
        border-radius: 4px;
        margin-right: 20px;
        flex: 1;
        height: 35px;
        text-align: center;
        line-height: 35px;
    }
    .cancel-btn {
        background: #1684FC;
        color: #fff

    };
    .overwrite-btn {
        border: 1px solid #1684FC;
        color: #1684FC
    };
    .sure-btn {
        background: #E86F50;
        color: #fff;
        margin-right: 0
    }
  }
}
</style>