<template>
  <div class="announcement">
    <div class="announcement-menu">
      <div>
        <img src="@/assets/images/gj-logo.png" class="gj-logo"/>
      </div>
      <div class="title">{{title}}</div>
      <div class="time">{{time}}</div>
      <div class="menu-list">
        <div v-for="item in announcementList" :key="item.id" class="group-item">
          <div class="group-name">{{item.groupName}}</div>
          <div @click="changeCurrent(child)" :class="currentId === child.id ? 'child-title-select' : '' " class="child-title" v-for="child in item.items" :key="child.id">
            <span :class="currentId === child.id ? 'dot-select' : 'dot'"></span>
            <gj-tooltip :content="child.itemTitle" v-if="child.itemTitle.length>12">
              <span class="span-text">{{child.itemTitle}}</span>
            </gj-tooltip>                   
            <span v-else>{{child.itemTitle}}</span>
          </div>
        </div>
      </div>       
      <div class="look-more" @click="goMore">查看更多</div>
    </div>
    <div class="announcement-content">
      <div class="content-title"><span class="line"></span>{{currentObj.itemTitle}}</div>
      <div class="content-main" v-html="currentObj.content"></div>    
      <div class="content-title" v-if="images && images.length > 0"><span class="line"></span>展示图例</div>     
      <div class="content-multimedia">
        <video controls v-if="images && images.length > 0 && images[0].includes('.mp4')" height="400" width="700">
          <source :src="currentObj.url1" type="video/mp4">
        </video>       
        <gj-carousel     
          arrow-class="arrow"
          indicator-type="dot"
          show-arrow="hover"
          :auto-play="isAutoPlay"
          :style="{
            width: '650px',
            height: '400px',
            background: '#fff'
          }"        
          v-if="images && images.length > 0 && !images[0].includes('.mp4')"
        >
          <gj-carousel-item v-for="image in images" :key="image">
            <img             
              :src="image"
              :style="{
                maxWidth: '100%',
                maxHeight: '100%',
                width:'auto',
                height: 'auto',               
              }"
            />
          </gj-carousel-item>
        </gj-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    announcementDetail:{
      type: Object
    }    
  },
  emits: ['handleCancel'],
  setup(props, { emit }) {
    const $router = useRouter()
    const announcementList = ref([])
    const title = ref('')
    const time = ref('')
    const currentId = ref('')
    const currentObj = ref({})
    const images = ref([])
    const isAutoPlay = ref(true)

    // 获取公告
    const getAnnouncement = async () => {
        // const res = await getVersionAnnouncement()       // 传版本号就查对应版本号的 不传后端自己取版本号 
        const data = props.announcementDetail       
        // debugger        
        console.log(data)
        title.value = data.title || ''
        time.value = data.releaseTime || '' 
        let groups = data.groups || []
        announcementList.value = groups.map((item, groupIndex) => {
          item.items = item.items.map((element,index)=>{
            element.id = groupIndex + '-' + index
            return element
          })
          return item
        })   
        currentId.value = announcementList.value[0]?.items[0]?.id
        currentObj.value = announcementList.value[0]?.items[0] || {}
        // debugger
        let arr = []        
        arr.push(announcementList.value[0]?.items[0]?.url1)
        arr.push(announcementList.value[0]?.items[0]?.url2)
        arr.push(announcementList.value[0]?.items[0]?.url3)
        arr.push(announcementList.value[0]?.items[0]?.url4)
        arr.push(announcementList.value[0]?.items[0]?.url5)
        arr=arr.filter(i=>i)
        images.value = arr
        if(arr.findIndex(i=>i.includes('.gif')) > -1){
          isAutoPlay.value = false
        }else {
          isAutoPlay.value = true
        }
    }

    onMounted(()=>{
      // debugger
      // 获取公告
      getAnnouncement()
    })

    const changeCurrent = (child =>{
      currentId.value = child.id
      currentObj.value = child
       let arr = []
       images.value = arr
       setTimeout(()=>{
        arr.push(child.url1)
        arr.push(child.url2)
        arr.push(child.url3)
        arr.push(child.url4)
        arr.push(child.url5)
        arr=arr.filter(i=>i)
        images.value = arr        
        if(arr.findIndex(i=>i.includes('.gif')) > -1){          
          isAutoPlay.value = false
        }else{
          isAutoPlay.value = true
        }
        },10)      

      
      // console.log(child)
    })

    // 查看更新
    const goMore = () => {
      // debugger
      emit('handleCancel')
      $router.push('/amz-web/messageCenter/messageHome?activeTab=3' )
    }

    return {
      announcementList,
      currentId,
      images,
      changeCurrent,
      title,
      time,
      currentObj,
      goMore,
      isAutoPlay
    }
  }  
})
</script>

<style scoped lang="scss">
.announcement{
  margin-top: -62px;
  margin-bottom:  -12px;
  margin-left: -15px;
  margin-right: -15px;
  background-color: #fff;
  display: flex;
  overflow-x: auto;  
  position: relative;
  .announcement-menu{
    width: 260px;
    min-height: 200px;
    height: calc(100vh - 250px);
    background: #F7F8FA;
    padding: 40px 4px 20px 4px;   
    box-sizing: border-box;    
    .gj-logo{ 
      width: 108px;
      height: 12px;
      margin-left: 20px;
    } 
    .title{
      font-weight: 500;
      font-size: 24px;
      color: #1D2129;
      padding-right: 20px;      
      padding-left: 20px;
      margin-top: 20px;
    }
    .time{
      margin-top: 4px;
      color: #86909C;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      padding-left: 20px;
    }
    .menu-list{
      margin-top: 27px;
      width: 100%;     
      height: calc(100% - 220px); 
      overflow: auto;
    }
    .group-item{
      margin-bottom: 30px;
    }
    .group-name{
      padding-right: 20px;     
      padding-left: 20px;
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
      color: #1D2129;
      margin-bottom: 7px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;    
      cursor: default;
    }
    .child-title{
      .span-text{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;  
        width: 200px;
      }
      border-radius: 4px;
      padding-right: 20px;
      padding-left: 20px;          
      height: 32px;
      line-height: 32px;           
      margin-bottom: 1px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover{
        // color: #1F6EEF;
        background-color: rgba(14, 66, 210, 0.1);
        .dot{
          display: inline-block;
          width: 6px;
          height: 6px;        
          border-radius: 100%;
          margin-right: 5px;
        }
      }
    }
    .child-title-select{
      background: rgba(14, 66, 210, 0.1);     
      color: #1D2129;
      font-weight: 500;
      font-size: 12px;
      &:hover{
        color: #1D2129;
      }
    }
    .dot-select{
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #1F6EEF;
      border-radius: 100%;
      margin-right: 5px;
    }
    .dot{
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #C9CDD4;
      border-radius: 100%;
      margin-right: 5px;
    }
  }
  .announcement-content{
    width: 680px;   
    height: calc(100vh - 300px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    .content-title{
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 16px;
      margin-top: 20px;
      .line{
        display: inline-block;
        width: 4px;
        height: 14px;
        background: #1F6EEF;
        border-radius: 1px;
        margin-right: 8px;
      }
    }
  }
  .content-multimedia{
    width: 700px;
    // height: 400px;
  }
  .look-more{
    padding-left: 20px;
    color: #0045F0;
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    bottom: 10px;
  }
  .content-main{
   word-break: break-word;
  }
  :deep(.arco-carousel-arrow>div){
    width: 30px;
    height: 30px;
    background-color: #ccc;
  }
  :deep(.arco-carousel-indicator-dot .arco-carousel-indicator-item){
    background-color: #ccc;
  }
  :deep(.arco-carousel-indicator-item-active, .arco-carousel-indicator-item:hover){
    background-color: #999!important;
  }
}
</style>
<style>
.arco-modal-close-btn{
  z-index: 2;
}
</style>
