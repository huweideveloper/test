<!-- 产品免责声明 -->
<template>
  <div class="product-disclaimer-container" :class="{ hide: !visible }">
    <div class="product-disclaimer-mask"></div>
    <div class="product-disclaimer-content">
      <div class="product-disclaimer-content-info">
        <p class="head-title">知识产权及隐私声明</p>
        <p class="title">知识产权声明：</p>
        <p class="line-info">
          1.
          本声明是上海杏脉信息科技有限公司（“本公司”）关于【鉴影标注平台】软件产品的全部版本（包括已有版本及未来更新版本）及与该软件作品全部版本有关的源代码、目标代码、文档资料以及任何由本公司基于软件技术维护或支持服务所提供的数据库及查询方式、数据、资料等（“本软件作品”）做出的法律声明。
        </p>
        <p class="line-info">
          2.
          本软件作品的版权、商标权等知识产权属于本公司所有，受《中华人民共和国专利法》、《中华人民共和国著作权法》、《计算机软件保护条例》、《知识产权保护条例》和相关条约、法律法规的保护。
        </p>
        <p class="line-info">
          3.
          任何单位和个人未经本公司书面授权，不得以任何目的（包括但不限于学习、研究等非商业用途）修改、使用、复制、截取、编纂、编译、上传、下载等或以任何方式和媒介复制、转载和传播本软件作品的任何部分，否则将视为侵权，本公司保留依法追究其法律责任的权利。
        </p>
        <p class="title">隐私声明：</p>
        <p class="line-info mr-b20">
          欢迎使用本软件作品，本《隐私声明》（也称"本声明"）为本软件作品有关收集、储存、使用和披露使用者（也称"您"）提供的信息的原则和规定的声明。在使用者接受《隐私声明》时，使用者即已经表示同意受本《隐私声明》的约束。
        </p>
        <p class="line-info">一、信息采集自愿</p>
        <p class="line-info mr-b20">
          本软件作品可能需要使用者提供姓名、名称、电话、传真、电子邮箱、等个人化信息资料及其上传的其他数据信息，使用者有权拒绝提供相关信息而停止使用本软件产品。本软件产品也可能自动收集使用者传送的包括但不限于IP地址、浏览器性质、操作系统种类或习惯甚至信息记录等非个人化的信息，使用者有权拒绝提供相关信息而停止使用本软件产品。使用者在接受本声明时即已经明确表示自愿本软件产品按本声明的规定采集、储存、使用、披露其相关个人信息及其上传的其他数据信息。
        </p>
        <p class="line-info">二、合理使用所采集的使用者提供的信息</p>
        <p class="line-info">
          使用者在提供或允许被采集信息时即表示愿意本软件产品在以下必要范围内合理使用所采集的使用者提供的信息：
        </p>
        <p class="line-info">
          1、使用采集使用者提供的信息来获得使用者的统计资料，并根据统计对使用者进行分类、联系等，以有针对性为使用者提供新的服务机会；
        </p>
        <p class="line-info">
          2、使用采集的使用者提供的信息为使用者提供相关的服务，分析、确认相关交易的过程和结果，查核相应身份、资格及信用情况，处理可能的相关法律争议；
        </p>
        <p class="line-info">
          3、使用采集的使用者提供的信息来对个人身份数据进行综合统计；
        </p>
        <p class="line-info">
          4、使用采集的使用者提供的信息进行存储和交换存储在放置于中国境内的服务器上（脱敏存储）；
        </p>
        <p class="line-info">
          5、使用采集的使用者提供的信息来跟踪使用者的IP地址，跟踪的目的仅仅是为了安全的必要。如果未发现安全问题，本软件产品会及时删除收集到得IP地址。
        </p>
        <p class="line-info">
          6、使用采集的使用者提供的信息来统计本软件产品的访问数据，以更好地预测本软件产品未来流量及制定相应的发展计划(如是否增加服务器等)；
        </p>
        <p class="line-info">
          7、使用采集的使用者提供的信息来根据使用者的倾向与偏好针对性地优化产品性能与效果，以更好地为使用者提供服务；
        </p>
        <p class="line-info">
          8、允许为本软件产品提供技术、服务、维修或其它合作项目的任何第三方为提供相应服务或履行相应义务而合理地使用被采集的使用者提供的信息，但服务结束后第三方即应被禁止访问或使用相关资料和信息；
        </p>
        <p class="line-info">
          9、本软件产品为履行其义务或改进服务所必须的使用；
        </p>
        <p class="line-info mr-b20">
          10、其它相关法律规定许可、需要使用的情况下的使用。
        </p>
        <p class="line-info">三、限制使用所采集信息</p>
        <p class="line-info mr-b20">
          除本声明第二条规定的必要范围内的合理使用外，本软件产品不会以其他形式使用所采集使用者提供的信息，也不会出租、出售、或泄漏所采集的使用者提供的信息。但在已取得使用者的书面同意、为免除使用者的生命或身体或财产方面的急迫危险、为防止第三方利益的重大危险或为增进公共利益且无害于使用者的重大利益、以及在法律法规许可或强制要求等情况下，本软件产品可对所采集的使用者提供的信息进行上述必要范围以外的使用。
        </p>
        <p class="line-info">四、相对安全</p>
        <p class="line-info mr-b20">
          本软件产品对使用者提供的信息进行严格的管理和保护，本软件产品使用相应及合适的技术以防止使用者提供的资料和信息丢失，被盗用或被篡改，包括向其它服务器备份数据或对使用者密码加密等。尽管本软件产品有这些安全措施，但鉴于技术限制及因特网本身的性质，我们只能说所采集信息会相对安全，请注意因特网上不存在"完善的安全措施"。
        </p>
        <p class="line-info">五、关于Cookie</p>
        <p class="line-info mr-b20">
          本软件产品设有Cookie，目的是为了对使用者更友好、使使用者的操作更方便以及为使用者提供更加个人化的服务。Cookie
          是一种技术，当使用者访问设有Cookie
          的本软件产品时，本软件产品会自动将Cookie发送到使用者的浏览器并储存到使用者的电脑硬盘，该
          Cookie便负责记录使用者其后访问和使用本软件产品的种种活动、个人资料等。接受Cookie后使用者不必每次重复输入密码和个人信息等，而本软件产品也可以跟踪和统计使用者的总体访问流量，以制定本软件产品的未来发展计划，如是否增加服务器等，以提高本软件产品的总体服务质量。使用者在接受本协议时，已经留意并接受了本软件产品设有
          Cookie的事实及Cookie的使用性质和状态。
        </p>
        <p class="line-info">六、本软件产品免责</p>
        <p class="line-info mr-b20">
          因使用者本人的过失或过错（如泄漏或与第三方分享密码等）、计算机病毒影响、黑客侵入、政府法律法规允许或强制要求网站披露使用者信息的情形、或由于与本软件产品链接的其它网站的原因或其它不可抗力等原因和因素而引起的所采集使用者提供的信息的泄露、丢失、盗用、篡改等以及相关法律争议和后果等，本软件产品不承担任何责任。使用者在接受本协议时，已经同意本软件产品免责的规定。
        </p>
        <p class="title">生效、解释和修改：</p>
        <p class="line-info mr-b20">
          本知识产权及隐私声明（“本声明”）是使用者使用本软件产品的前提，使用者在使用本软件产品时，已经同意并接受本声明。本声明于使用者而言于其接受时生效，本声明可能会定期更新，使用者有责任查阅本声明，了解其中的变化。因此每次使用本软件产品的时候，请查阅本声明，确保您清楚了解任何转变。若您继续使用本软件产品，即表示您接受本声明的任何转变。本声明解释和修改权归本公司所有。
        </p>
        <p class="line-info text-right">更新日期：{{date}}</p>
      </div>
      <div class="option-btns">
        <div class="check-item">
          <el-checkbox v-model="hasRead">已阅读并知晓以上声明</el-checkbox>
        </div>
        <div>
          <el-button @click="handleHide">不同意</el-button>
          <el-button type="primary" @click="handleAgree" :disabled="!hasRead"
            >同意后续使用均默认遵循本协议</el-button
          >
          <!-- <el-button type="primary" @click="handleAgree" :disabled="!hasRead">{{hasRead ? '同意后续使用均默认遵循本协议' : '请滚动至底部完成阅读后同意'}}</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hasRead: false
    }
  },
  mounted() {
    // let [nScrollHeight, nScrollTop, nDivHeight] = [0, 0, 0] // 滚动距离总长，滚动到的当前距离, div高度
    // const self = this
    // // 监听是否滚动到了底部
    // $('.product-disclaimer-content-info').scroll(function() {
    //   if(self.hasRead) return
    //   nDivHeight = $(this).outerHeight()
    //   nScrollHeight = $(this)[0].scrollHeight
    //   nScrollTop = $(this)[0].scrollTop
    //   if (nDivHeight + nScrollTop >= nScrollHeight) {
    //     self.hasRead = true // 滚动到了底部
    //   }
    // })
  },
  methods: {
    handleHide() {
      this.$emit('update:visible', false)
    },
    // 同意
    handleAgree() {
      this.handleHide()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less">
  .product-disclaimer-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    &.hide {
      display: none;
    }
    .product-disclaimer-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }
    .product-disclaimer-content {
      position: relative;
      width: 1000px;
      height: 587px;
      background: #fff;
      z-index: 10;
    }
    .product-disclaimer-content-info {
      width: 100%;
      height: 505px;
      padding: 20px 50px;
      overflow-y: auto;
    }
    .head-title {
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      padding: 20px 0;
    }
    .line-info {
      font-size: 14px;
      line-height: 30px;
    }
    .mr-b20 {
      margin-bottom: 20px;
    }
    .text-right {
      text-align: right;
      color: #999;
    }
    .option-btns {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 102px;
      border-top: 1px solid #eee;
      background: #fff;
      .check-item {
        margin-bottom: 10px;
      }
    }
  }
</style>
