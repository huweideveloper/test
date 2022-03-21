<template>
  <div class="bread-crumb">
    <div class="bread-crumb-container">
      <span><</span>
      <div class="bread-crumb-content">
        <div 
          v-for="(item, index) in data"
          :key="index"
          :class="'bread-crumb-item' + (index === data.length -1 ? ' active' : '')"
          @click="handleClick(item)"
        >
          <span class="bread-crumb-title">{{ isObject(item) ? item.title : item  }}</span>
          <span v-if="index < data.length - 1">/</span>
        </div>
      </div>
    </div>
    <h2 class="page-title">{{ pageTitle }}</h2>
  </div>
</template>

<script>
import { open } from '../../utils/window';
export default {
  name: "bread-crumb",
  props: {
    data: {
      type: Array,
      default: function(){
        return [];
      }
    }
  },
  data() {
    return {
      
    };
  },
  computed:{
    pageTitle(){
      if( !this.data.length ) return '';
      const lastItem = this.data[this.data.length -1];
      return this.isObject(lastItem) ? lastItem.title : lastItem;
    }
  },
  mounted() {
   
  },
  methods: {
    handleClick({ path }){
      if( path ){
        open(path);
      }
    },
    isObject(item){
      return Object.prototype.toString.call(item) === '[object Object]';
    }
  },
};
</script>

<style lang="less">
  .bread-crumb{
    .bread-crumb-container{
      display: flex;
    }
    .bread-crumb-content{
      display: flex;
      margin-left: 5px;
      .bread-crumb-item{
        margin-left: 5px;
        cursor: pointer;
        .bread-crumb-title{
          color:#999;
        }
        &.active{
          .bread-crumb-title{
            color:#333;
          }
        }
        &.pointer{
          cursor: pointer;
        }
      }
    }
    .page-title{
      padding: 15px 0;
      color: #000;
    }
  }
</style>
