<template>
  <div class="min-h-screen bg-gray-100 p-3">
    <div class="pt-4">
      <div
        class="bg-white p-3 rounded-md shadow-sm max-w-5xl mx-auto"
        v-loading="loading"
      >
        <div class="text-base">选择图片：</div>
        <div class="pt-2 pb-4">
          <a-upload-dragger
            :multiple="false"
            accept="image/*"
            :showUploadList="false"
            :beforeUpload="handleBeforeUpload"

          >
            <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
              <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
              <div class="pt-4 text-slate-950 text-lg font-bold">
                将图片拖到此处，或<span class="text-indigo-500">点击导入</span>
              </div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="text-base">预览：</div>
        <div>
          <div class="pt-2 pb-6">
            <el-image
              v-if="curImgSrc"
              class="w-full h-auto"
              :src="curImgSrc"
              :preview-src-list="[
              ]"
            />
            <div v-else class="text-slate-500 flex items-center justify-center bg-gray-200 rounded-md py-6">
              未选择图片
            </div>
          </div>
        </div>
        <div class="text-base border-t border-solid border-gray-300 pt-4 pb-2">处理结果：</div>
        <div class="flex flex-col gap-y-2 text-base pb-2" >
          <el-card :body-style="{ padding: '0px' }">
            <div class="flex flex-row text-blue-400 pl-2 py-2">
              <div class="w-36 text-right pr-2">像素点总个数：</div>
              <div class="">{{ rgbRes.total || '-' }}</div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '0px' }">
            <div class="flex flex-row text-blue-400 pl-2 py-2">
              <div class="w-36 text-right pr-2">像素点处理个数：</div>
              <div class="">{{ rgbRes.rest || '-' }}</div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '0px' }">
            <div class="flex flex-row text-blue-400 pl-2 py-2">
              <div class="w-36 text-right pr-2">x 值：</div>
              <div class="">{{ rgbRes.x || '-' }}</div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '0px' }">
            <div class="flex flex-row text-blue-400 pl-2 py-2">
              <div class="w-36 text-right pr-2">y 值：</div>
              <div class="">{{ rgbRes.y || '-' }}</div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <canvas id="canvas" style="display:none;"></canvas>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
      loading: false,
      curImgSrc: null,
      rgbRes: {
        total: 0,
        rest: 0,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
  },
  created() {
  },
  async mounted() {
  },
  methods: {
    handleBeforeUpload(file) {
      this.loading = true
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = () => {
          try {
            const rgbRes = {
              total: 0,
              rest: 0,
              x: 0,
              y: 0
            }
            let rTotal = 0
            const canvas = document.getElementById('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            const pixels = imageData.data
            for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i]
              // const g = pixels[i + 1]
              // const b = pixels[i + 2]
              rgbRes.total++
              if (r < 218 && r > 74) {
                rgbRes.rest++
                rTotal += r
              }
            }
            rgbRes.x = rTotal / rgbRes.rest
            if (rgbRes.x >= 170 && rgbRes.x <= 217) {
              rgbRes.y = (242 - rgbRes.x) / 80.3
            } else if (rgbRes.x >= 152 && rgbRes.x <= 170) {
              rgbRes.y = (225.2 - rgbRes.x) / 61.7
            } else if (rgbRes.x >= 140 && rgbRes.x <= 152) {
              rgbRes.y = (197.2 - rgbRes.x) / 38.3
            } else if (rgbRes.x >= 123 && rgbRes.x <= 140) {
              rgbRes.y = (181.5 - rgbRes.x) / 27.8
            } else if (rgbRes.x >= 101 && rgbRes.x <= 123) {
              rgbRes.y = (175 - rgbRes.x) / 24.8
            } else if (rgbRes.x >= 75 && rgbRes.x <= 101) {
              rgbRes.y = (186.4 - rgbRes.x) / 28.6
            }
            this.rgbRes = rgbRes
            this.curImgSrc = reader.result
            this.loading = false
          } catch (error) {
            console.log(error)
          }
        }
      }
      reader.readAsDataURL(file)
      return false
    }
  }
}
</script>

<style lang="less">
.ant-upload.ant-upload-drag .ant-upload {
  padding: 0;
}
</style>
