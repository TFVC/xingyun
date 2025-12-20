<template>
  <div class="app-container">
    <div class="content">
      <a-steps :current="currentStep" class="steps-bar">
        <a-step title="上传资料" description="导入文档与设定风格">
          <template #icon><inbox-outlined /></template>
        </a-step>
        <a-step title="脚本编辑" description="AI 生成分镜脚本">
          <template #icon><file-text-outlined /></template>
        </a-step>
        <a-step title="素材生成" description="AI 绘图与语音合成">
          <template #icon><picture-outlined /></template>
        </a-step>
        <a-step title="视频导出" description="自动剪辑合成">
          <template #icon><play-circle-outlined /></template>
        </a-step>
      </a-steps>

      <!-- Global Loading (Only for generation steps) -->
      <div v-if="loading && currentStep === 0" class="loading-container" style="text-align: center; padding: 20px 0;">
        <a-spin size="large" tip="AI 正在阅读资料并拆解分镜，请稍候..." />
        <div class="loading-tips" style="margin-top: 15px; color: rgba(255,255,255,0.6);">
             <p>✨ 正在调用大模型进行深度理解...</p>
             <p>📝 正在规划视频结构与旁白...</p>
             <p>🎨 正在构思每一帧的画面提示词...</p>
        </div>
        
        <!-- Script Generation Logs -->
        <div v-if="progressLogs.length > 0" class="log-window" style="max-width: 600px; margin: 15px auto;">
          <div v-for="(log, index) in progressLogs" :key="index" :class="['log-item', log.type === 'error' ? 'log-error' : '']">
            {{ log.message }}
          </div>
        </div>
      </div>

      <div v-if="loading && currentStep === 2" class="loading-container" style="text-align: center; padding: 20px 0;">
        <!-- Compact Green Status Hint -->
        <div class="status-hint-container" style="margin-bottom: 20px; color: #52c41a; font-size: 16px; font-weight: 500;">
          <span v-if="latestPreview">
            正在生成第 {{ (latestPreview.index || 0) + 1 }} / {{ scenes.length }} 个分镜：
            {{ latestPreview.media_type === 'image' ? '🖼️ 图片生成中...' : '🗣️ 语音合成中...' }}
          </span>
          <span v-else>
            🚀 正在初始化素材生成任务...
          </span>
        </div>
        
        <!-- Live Preview Monitor (Simplified/Kept as visual feedback but secondary) -->
        <div v-if="latestPreview" class="preview-monitor" style="margin-top: 10px;">
            <div class="monitor-content">
                <transition name="fade" mode="out-in">
                    <div :key="latestPreview.url" class="preview-item">
                        <div v-if="latestPreview.media_type === 'image'" class="preview-image-box">
                            <img :src="getStaticUrl(latestPreview.url)" alt="Live Preview" />
                        </div>
                         <div v-if="latestPreview.media_type === 'audio'" class="preview-audio-box">
                            <div class="audio-icon-large">
                                <sound-outlined spin />
                            </div>
                            <audio controls autoplay :src="getStaticUrl(latestPreview.url)"></audio>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <div v-if="progressLogs.length > 0" class="log-window" style="max-width: 600px; margin: 15px auto;">
          <div v-for="(log, index) in progressLogs" :key="index" :class="['log-item', log.type === 'error' ? 'log-error' : '']">
            {{ log.message }}
          </div>
        </div>
      </div>

      <div v-if="loading && currentStep === 3" class="loading-container" style="text-align: center; padding: 20px 0;">
        <!-- Compact Green Status Hint -->
        <div class="status-hint-container" style="margin-bottom: 20px; color: #52c41a; font-size: 16px; font-weight: 500;">
            <span>
              {{ videoStatusText }}
            </span>
          </div>
        
        <!-- Video Synthesis Logs (Simulated) -->
        <div v-if="progressLogs.length > 0" class="log-window" style="max-width: 600px; margin: 15px auto;">
          <div v-for="(log, index) in progressLogs" :key="index" :class="['log-item', log.type === 'error' ? 'log-error' : '']">
            {{ log.message }}
          </div>
        </div>
      </div>

      <div v-show="!loading">
        <!-- Step 0: Upload -->
        <div v-if="currentStep === 0" class="step-content">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-card title="1. 上传参考资料" :bordered="false" class="full-height-card">
                <a-spin :spinning="uploading" tip="正在解析文档内容...">
                  <a-upload-dragger
                    :customRequest="handleUpload"
                    :showUploadList="false"
                    height="200"
                    :disabled="uploading"
                  >
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined style="color: #1890ff" />
                    </p>
                    <p class="ant-upload-text">点击或拖拽文件到此处上传</p>
                    <p class="ant-upload-hint">支持 PDF, Word 文档，AI 将自动读取内容</p>
                  </a-upload-dragger>
                  
                  <div v-if="filename" class="uploaded-info">
                    <a-typography-text type="success"><file-text-outlined /> 已就绪: {{ filename }}</a-typography-text>
                    <a-textarea
                      v-model:value="uploadedText"
                      :rows="4"
                      placeholder="提取的文本内容将显示在这里..."
                      class="text-preview"
                    />
                  </div>
                </a-spin>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="2. 设定视频风格" :bordered="false" class="full-height-card">
                <div class="style-section">
                  <a-typography-text strong>选择预设风格：</a-typography-text>
                  <div class="radio-group-wrapper">
                    <a-radio-group v-model:value="stylePreset">
                      <a-space direction="vertical">
                        <a-radio value="professional">👔 商务专业 (适合正式培训)</a-radio>
                        <a-radio value="cartoon">🎨 卡通插画 (适合轻松科普)</a-radio>
                        <a-radio value="tech">🤖 未来科技 (适合技术讲解)</a-radio>
                        <a-radio value="minimalist">✨ 极简主义 (适合概念介绍)</a-radio>
                      </a-space>
                    </a-radio-group>
                  </div>
                </div>
                
                <div class="style-section">
                  <a-typography-text strong>选择画面比例：</a-typography-text>
                  <div class="radio-group-wrapper">
                    <a-radio-group v-model:value="aspectRatio" button-style="solid">
                      <a-radio-button value="16:9">🖥️ 横屏 16:9</a-radio-button>
                      <a-radio-button value="4:3">🖥️ 横屏 4:3</a-radio-button>
                      <a-radio-button value="9:16">📱 竖屏 9:16</a-radio-button>
                      <a-radio-button value="3:4">📱 竖屏 3:4</a-radio-button>
                      <a-radio-button value="1:1">⏹️ 方形 1:1</a-radio-button>
                    </a-radio-group>
                  </div>
                </div>

                <div class="style-section">
                  <a-typography-text strong>选择配音角色：</a-typography-text>
                  <div class="radio-group-wrapper">
                     <a-select v-model:value="selectedVoice" style="width: 100%" :disabled="onlyGeneratePrompts">
                        <a-select-option v-for="voice in voiceOptions" :key="voice.value" :value="voice.value" :disabled="voice.disabled">
                           {{ voice.label }}
                        </a-select-option>
                     </a-select>
                     <a-checkbox v-model:checked="onlyGeneratePrompts" style="margin-top: 8px">
                        仅生成画面提示词（不生成讲稿）
                     </a-checkbox>
                     <a-checkbox v-model:checked="pptPromptMode" style="margin-top: 8px">
                        以 PPT 模式生成画面提示词（结构化页面对象）
                     </a-checkbox>
                  </div>
                </div>

                <div class="style-section">
                  <a-typography-text strong>上传风格参考图 (可选)：</a-typography-text>
                  <div class="upload-btn-wrapper">
                    <a-upload>
                      <a-button><upload-outlined /> 上传参考图片</a-button>
                    </a-upload>
                  </div>
                </div>

                <div class="style-section">
                  <a-typography-text strong>期望分镜数量 (可选)：</a-typography-text>
                  <div class="radio-group-wrapper">
                    <a-input-number 
                      v-model:value="expectedSceneCount" 
                      :min="1" 
                      :max="50" 
                      placeholder="AI 自动建议" 
                      style="width: 100%"
                    />
                  </div>
                </div>

                <div>
                  <a-typography-text strong>其他特殊要求：</a-typography-text>
                  <a-button type="link" size="small" @click="showTemplateModal = true">
                    <template #icon><bulb-outlined /></template>
                    提示词模板库
                  </a-button>
                  <a-textarea
                    v-model:value="styleGuide"
                    :rows="2"
                    placeholder="例如：希望配色以蓝色为主，语速稍快..."
                    class="mt-8"
                  />
                </div>
              </a-card>
            </a-col>
          </a-row>
          
          <div class="action-footer">
            <a-button
              type="primary"
              size="large"
              @click="handleGenerateScript"
              :loading="loading"
              :disabled="!uploadedText && !styleGuide"
              class="main-action-btn"
            >
              <template #icon><file-text-outlined /></template>
              智能生成脚本与分镜
            </a-button>
          </div>
        </div>

        <!-- Step 1: Edit Script -->
        <div v-if="currentStep === 1" class="step-content">
          <div style="height: 20px;"></div> <!-- Spacer to prevent top cutoff -->
          <div class="step-header">
            <div>
              <a-typography-title :level="4" style="margin-bottom: 0">第二步：审核与编辑脚本</a-typography-title>
              <a-tag v-if="scriptProvider" color="blue" style="margin-top: 8px">
                <template #icon><check-circle-outlined /></template>
                AI 模型来源: {{ scriptProvider }}
              </a-tag>
            </div>
            <a-space>
               <!-- Export/Import Buttons -->
               <a-tooltip title="导出分镜稿为Excel">
                   <a-button @click="handleExportScript">
                       <template #icon><export-outlined /></template>
                       导出
                   </a-button>
               </a-tooltip>
               <a-upload
                   name="file"
                   accept=".xlsx, .xls"
                   :showUploadList="false"
                   :beforeUpload="handleImportScript"
               >
                   <a-tooltip title="从Excel导入分镜稿">
                       <a-button>
                           <template #icon><import-outlined /></template>
                           导入
                       </a-button>
                   </a-tooltip>
               </a-upload>

               <a-select v-model:value="aspectRatio" style="width: 130px">
                  <a-select-option value="16:9">横屏 16:9</a-select-option>
                  <a-select-option value="4:3">横屏 4:3</a-select-option>
                  <a-select-option value="9:16">竖屏 9:16</a-select-option>
                  <a-select-option value="3:4">竖屏 3:4</a-select-option>
                  <a-select-option value="1:1">方形 1:1</a-select-option>
               </a-select>
               
               <a-select v-model:value="selectedVoice" style="width: 180px">
                  <a-select-option v-for="voice in voiceOptions" :key="voice.value" :value="voice.value" :disabled="voice.disabled">
                     {{ voice.label }}
                  </a-select-option>
               </a-select>

               <a-checkbox v-model:checked="imagesOnly">
                 只生成图片（不合成语音）
               </a-checkbox>

               <a-button size="large" @click="currentStep = 0">
                 <template #icon><arrow-left-outlined /></template>
                 上一步
               </a-button>

               <a-button type="primary" size="large" @click="() => handleGenerateMedia(true)" :loading="loading">
                 <template #icon><picture-outlined /></template>
                 确认无误，生成配图与配音
               </a-button>
            </a-space>
          </div>
          
          <a-list :data-source="scenes">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-card :title="`分镜片段 ${index + 1}`" class="scene-card" :headStyle="{ background: '#fafafa' }">
                  <template #extra>
                       <a-space>
                           <a-button type="dashed" shape="circle" @click="addScene(index)" title="在此后插入新分镜">
                               <plus-outlined />
                           </a-button>
                           <a-button type="dashed" danger shape="circle" @click="deleteScene(index)" title="删除此分镜">
                               <delete-outlined />
                           </a-button>
                       </a-space>
                  </template>
                  <a-row :gutter="32">
                    <!-- Script Section -->
                    <a-col :span="12" class="editor-col">
                      <a-typography-text strong style="color: #1890ff; font-size: 16px; display: block; margin-bottom: 12px;">
                        🗣️ 讲解词 (旁白):
                      </a-typography-text>
                      <a-textarea
                        v-model:value="item.script"
                        :auto-size="{ minRows: 6, maxRows: 6 }"
                        class="large-textarea"
                        placeholder="在此输入讲解词..."
                      />
                    </a-col>
                    
                    <!-- Prompt Section -->
                    <a-col :span="12" class="editor-col">
                      <a-typography-text strong style="color: #52c41a; font-size: 16px; display: block; margin-bottom: 12px;">
                        🖼️ 画面提示词 (Prompt):
                      </a-typography-text>
                      <a-textarea
                        v-model:value="item.image_prompt"
                        :auto-size="{ minRows: 6, maxRows: 6 }"
                        class="large-textarea"
                        placeholder="在此输入画面提示词..."
                      />
                      <div style="margin-top: 8px; text-align: right;">
                        <a-space>
                          <a-button 
                            size="small" 
                            type="text" 
                            :loading="scriptPromptLoadingIndex === index"
                            @click="handleGeneratePromptFromScript(index)"
                          >
                            根据讲稿生成图片提示词
                          </a-button>
                          <a-button 
                            size="small" 
                            type="text" 
                            @click="copyToClipboard(item.image_prompt)"
                          >
                            <template #icon><copy-outlined /></template>
                            复制提示词
                          </a-button>
                        </a-space>
                      </div>
                    </a-col>
                  </a-row>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
          
          <div style="text-align: center; margin-top: 20px; margin-bottom: 40px;">
              <a-button type="dashed" size="large" @click="() => addScene()" style="width: 100%">
                  <plus-outlined /> 添加新分镜
              </a-button>
          </div>
        </div>

        <!-- Step 2: Preview Media -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <a-typography-title :level="4">第三步：多媒体素材预览</a-typography-title>
            <a-space>
              <div v-if="hasFailedMedia" style="display: flex; align-items: center; margin-right: 16px;">
                 <a-checkbox v-model:checked="autoRetryEnabled">自动补全</a-checkbox>
                 <a-select 
                   v-if="autoRetryEnabled"
                   v-model:value="autoRetryInterval" 
                   style="width: 100px; margin-left: 8px;" 
                   size="small"
                 >
                    <a-select-option :value="60000">1分钟</a-select-option>
                    <a-select-option :value="180000">3分钟</a-select-option>
                 </a-select>
              </div>

              <a-button v-if="hasFailedMedia" type="dashed" danger size="large" :loading="loading" @click="() => handleGenerateMedia(false)">
                <template #icon><reload-outlined /></template>
                补全失败素材
              </a-button>
              
              <a-button size="large" @click="currentStep = 1">
                <template #icon><arrow-left-outlined /></template>
                上一步
              </a-button>

              <a-space>
                <a-button size="large" @click="handleDownloadImages" :loading="zipLoading">
                  <template #icon><download-outlined /></template>
                  批量图片下载
                </a-button>
                <a-button size="large" @click="handleGeneratePPT" :loading="pptLoading">
                  <template #icon><file-text-outlined /></template>
                  生成 PPT
                </a-button>
                <a-button type="primary" size="large" @click="handleCreateVideo" :loading="loading">
                  <template #icon><video-camera-outlined /></template>
                  合成视频
                </a-button>
              </a-space>

              <a-button size="large" danger @click="resetGenerator">
                <template #icon><reload-outlined /></template>
                重置
              </a-button>
            </a-space>
          </div>
          
          <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }" :data-source="scenes">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-card :title="`分镜 ${index + 1}`" hoverable class="media-card">
                  <template #extra>
                       <a-space>
                         <a-button type="link" size="small" @click="copyToClipboard(item.image_prompt)" title="复制生图提示词">
                            <copy-outlined />
                          </a-button>
                          <a-button type="link" size="small" @click="openOptimizeModal(index)" title="优化生图">
                            优化生图
                          </a-button>
                          <a-upload 
                            name="file" 
                            accept="image/*, audio/*"
                            :showUploadList="false"
                            :customRequest="(options) => handleImageUpload(options, index)"
                          >
                            <a-button type="link" size="small"><upload-outlined /> 替换</a-button>
                          </a-upload>
                       </a-space>
                  </template>
                  <template #cover>
                    <div v-if="item.image_url" class="image-wrapper">
                       <a-image
                        :src="getStaticUrl(item.image_url)"
                        height="200px"
                        style="object-fit: cover; width: 100%"
                      />
                    </div>
                    <div v-else class="image-placeholder">
                      <a-empty description="图片生成失败" v-if="!loading" />
                      <a-spin tip="生成中..." v-else />
                    </div>
                  </template>
                  <a-card-meta>
                    <template #description>
                      <div class="media-desc">
                        <div v-if="item.audio_url">
                          <audio controls :src="getStaticUrl(item.audio_url)" style="width: 100%" />
                        </div>
                        <div v-else>
                          <a-tag color="error" v-if="!loading">音频生成失败</a-tag>
                          <a-spin size="small" v-else />
                        </div>
                        <a-typography-paragraph :ellipsis="{ rows: 2 }" class="mt-10">
                          {{ item.script }}
                        </a-typography-paragraph>
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <!-- Step 3: Final Video -->
        <div v-if="currentStep === 3" class="step-content final-step">
          <a-card :bordered="false" class="final-card">
            <a-typography-title :level="2" style="color: #52c41a">🎉 视频制作完成！</a-typography-title>
            <div class="video-container">
              <video v-if="videoUrl" controls width="100%" autoplay>
                <source :src="getStaticUrl(videoUrl)" type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
            </div>
            <a-space size="large">
              <a-button type="primary" size="large" :href="getStaticUrl(videoUrl)" target="_blank">
                <template #icon><download-outlined /></template>
                下载视频文件
              </a-button>
              <a-button size="large" @click="resetGenerator">
                制作下一个视频
              </a-button>
            </a-space>
            
          </a-card>
        </div>
      </div>
    </div>
    
    <!-- Template Modal -->
    <a-modal
      v-model:visible="showTemplateModal"
      title="💡 提示词模板库"
      :footer="null"
      width="600px"
    >
      <a-list :grid="{ gutter: 16, column: 2 }" :data-source="promptTemplates">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable size="small" @click="applyTemplate(item.content)">
              <a-card-meta :title="item.title">
                <template #description>
                  <a-typography-paragraph :ellipsis="{ rows: 2 }" style="margin-bottom: 0; font-size: 12px;">
                    {{ item.content }}
                  </a-typography-paragraph>
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>

    <a-modal
      v-model:visible="optimizeModalVisible"
      :title="optimizingSceneIndex !== null ? `优化分镜 ${optimizingSceneIndex + 1} 的生图` : '优化生图'"
      :confirmLoading="optimizeLoading"
      :footer="null"
      width="640px"
    >
      <a-steps :current="optimizeStep" size="small" style="margin-bottom: 24px;">
        <a-step title="核心传达信息" />
        <a-step title="辅助传达信息" />
        <a-step title="相关素材" />
        <a-step title="设计风格" />
        <a-step title="主题渲染" />
      </a-steps>

      <div v-if="optimizeStep === 0">
        <a-typography-text strong>第一步：核心传达信息</a-typography-text>
        <a-textarea
          v-model:value="optimizeForm.coreMessage"
          :rows="3"
          placeholder="这一页最重要想让观众记住的一句话是什么？"
          style="margin-top: 8px;"
        />
      </div>

      <div v-else-if="optimizeStep === 1">
        <a-typography-text strong>第二步：辅助传达信息</a-typography-text>
        <a-textarea
          v-model:value="optimizeForm.secondaryMessage"
          :rows="3"
          placeholder="可以补充一些需要体现的细节、场景或数据亮点（可选）"
          style="margin-top: 8px;"
        />
      </div>

      <div v-else-if="optimizeStep === 2">
        <a-typography-text strong>第三步：相关素材</a-typography-text>
        <a-radio-group v-model:value="optimizeForm.hasAssets" style="margin-top: 8px;">
          <a-radio value="no">没有特定素材</a-radio>
          <a-radio value="yes">有需要体现的素材</a-radio>
        </a-radio-group>
        <div v-if="optimizeForm.hasAssets === 'yes'" style="margin-top: 12px;">
          <a-input
            v-model:value="optimizeForm.assetsCount"
            placeholder="相关素材数量，例如：1个图表 + 1个二维码（可选）"
          />
        </div>
      </div>

      <div v-else-if="optimizeStep === 3">
        <a-typography-text strong>第四步：设计风格</a-typography-text>
        <a-radio-group v-model:value="optimizeForm.style" style="margin-top: 8px;">
          <a-radio value="realistic">写实摄影风</a-radio>
          <a-radio value="cartoon">卡通插画风</a-radio>
          <a-radio value="minimal">极简扁平风</a-radio>
        </a-radio-group>
      </div>

      <div v-else-if="optimizeStep === 4">
        <a-typography-text strong>第五步：主题渲染效果</a-typography-text>
        <a-input
          v-model:value="optimizeForm.themeEffect"
          style="margin-top: 8px;"
          placeholder="例如：安全感、科技感、信任感、轻松愉快等（可选）"
        />
      </div>

      <div style="margin-top: 24px;">
        <a-typography-text strong>生图提示词预览：</a-typography-text>
        <a-textarea
          :value="optimizedPromptPreview"
          :rows="4"
          style="margin-top: 8px;"
          readonly
          placeholder="根据上面的配置自动生成的生图提示词会显示在这里"
        />
      </div>

      <div style="margin-top: 24px; text-align: right;">
        <a-space>
          <a-button @click="() => { optimizeModalVisible = false; }">取消</a-button>
          <a-button v-if="optimizeStep > 0" @click="handleOptimizePrev">上一步</a-button>
          <a-button v-if="optimizeStep < 4" type="primary" @click="handleOptimizeNext">下一步</a-button>
          <a-button v-if="optimizeStep === 4" @click="handleOptimizePrompt" :loading="optimizePromptLoading">
            优化提示词
          </a-button>
          <a-button v-if="optimizeStep === 4" type="primary" :loading="optimizeLoading" @click="handleOptimizeGenerate">
            生图并替换
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, computed, watch, onUnmounted, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import * as XLSX from 'xlsx';
import { 
  UploadOutlined, InboxOutlined, PlayCircleOutlined, DownloadOutlined, 
  FileTextOutlined, PictureOutlined, VideoCameraOutlined, CheckCircleOutlined,
  ReloadOutlined, SaveOutlined, ArrowLeftOutlined, CopyOutlined, BulbOutlined,
  SoundOutlined, CameraOutlined, PlusOutlined, DeleteOutlined, ImportOutlined, ExportOutlined
} from '@ant-design/icons-vue';
import { uploadFile, generateScript, generateMedia, createVideo, getStaticUrl as getUrl, uploadImage, uploadAudio, generatePPT, downloadImagesZip, generateImageForScene, optimizeImagePrompt, generatePromptFromScript } from '../api';

const STORAGE_KEY = 'ppt_generator_state_v1';

const currentStep = ref(0);
const loading = ref(false);
const pptLoading = ref(false);
const zipLoading = ref(false);
const showTemplateModal = ref(false);

const promptTemplates = [
  { 
    title: "🎯 目标受众调整", 
    content: "目标受众是企业高管，请使用正式、简洁的商业用语，强调ROI和战略价值。" 
  },
  { 
    title: "👶 儿童/科普风格", 
    content: "目标受众是小学生，请使用简单生动的语言，多用比喻，语气亲切活泼。" 
  },
  { 
    title: "⏱️ 节奏控制 (快)", 
    content: "视频节奏要求紧凑，语速稍快，每段旁白控制在100字以内，适合短视频平台。" 
  },
  { 
    title: "🧘 节奏控制 (慢)", 
    content: "视频节奏舒缓，留有思考空间，适合冥想或深度教学，语气平和。" 
  },
  { 
    title: "🎨 画面风格 (赛博)", 
    content: "画面风格要求赛博朋克风，霓虹灯光，高科技感，深色调。" 
  },
  { 
    title: "🌿 画面风格 (自然)", 
    content: "画面风格要求清新自然，使用柔和的自然光，绿色植物元素，治愈系。" 
  },
  { 
    title: "📊 强调数据", 
    content: "请重点突出参考资料中的数据和图表，旁白中要详细解读关键数据指标。" 
  }
];

const applyTemplate = (templateContent) => {
  if (styleGuide.value) {
    styleGuide.value += "\n" + templateContent;
  } else {
    styleGuide.value = templateContent;
  }
  message.success("已添加提示词模板");
  showTemplateModal.value = false;
};

const scriptPromptLoadingIndex = ref(null);

const handleGeneratePromptFromScript = async (index) => {
  if (index < 0 || index >= scenes.value.length) return;
  const scene = scenes.value[index];
  const text = (scene.script || "").trim();
  if (!text) {
    message.warning("该分镜讲稿为空，无法生成图片提示词");
    return;
  }
  scriptPromptLoadingIndex.value = index;
  try {
    const result = await generatePromptFromScript(text);
    if (result && result.prompt) {
      scene.image_prompt = result.prompt;
      scenes.value.splice(index, 1, { ...scene });
      message.success(`分镜 ${index + 1} 的提示词已根据讲稿生成`);
    } else {
      throw new Error("无效的生成结果");
    }
  } catch (e) {
    message.error("根据讲稿生成提示词失败: " + e.message);
  } finally {
    scriptPromptLoadingIndex.value = null;
  }
};

// Utility: Copy to clipboard
const copyToClipboard = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    message.success('提示词已复制到剪贴板');
  }).catch(() => {
    message.error('复制失败');
  });
};

// Excel Export/Import Logic
const handleExportScript = () => {
  if (!scenes.value || scenes.value.length === 0) {
    message.warning('没有可导出的分镜数据');
    return;
  }
  
  try {
    // Format data for Excel
    const data = scenes.value.map((scene, index) => ({
      '分镜序号': index + 1,
      '讲解词 (Script)': scene.script,
      '画面提示词 (Image Prompt)': scene.image_prompt
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-width for columns
    const wscols = [
        { wch: 10 }, // Index
        { wch: 50 }, // Script
        { wch: 50 }  // Prompt
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "分镜稿");
    
    // Generate filename with timestamp
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `分镜稿_${dateStr}.xlsx`);
    
    message.success('分镜稿导出成功');
  } catch (e) {
    console.error(e);
    message.error('导出失败: ' + e.message);
  }
};

const handleImportScript = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Assume first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (!jsonData || jsonData.length === 0) {
        message.error('Excel文件内容为空或格式不正确');
        return;
      }

      // Parse data back to scenes format
      const newScenes = jsonData.map(row => {
        // Try to find columns flexibly
        const script = row['讲解词 (Script)'] || row['讲解词'] || row['Script'] || row['script'] || '';
        const prompt = row['画面提示词 (Image Prompt)'] || row['画面提示词'] || row['Image Prompt'] || row['Prompt'] || row['prompt'] || '';
        
        return {
          script: script,
          image_prompt: prompt,
          image_url: null, // Reset media on import
          audio_url: null
        };
      });

      if (newScenes.length > 0) {
        scenes.value = newScenes;
        message.success(`成功导入 ${newScenes.length} 个分镜`);
      } else {
        message.warning('未能识别有效的分镜数据，请检查表头');
      }
      
    } catch (err) {
      console.error(err);
      message.error('解析Excel文件失败');
    }
  };
  reader.readAsArrayBuffer(file);
  return false; // Prevent default upload behavior
};

// Auto-retry state
const autoRetryEnabled = ref(false);
const autoRetryInterval = ref(60000); // Default 1 minute
const autoRetryTimer = ref(null);

// Data States
const uploading = ref(false);
const uploadedText = ref("");
const filename = ref("");
const styleGuide = ref("");
const expectedSceneCount = ref(null);
const onlyGeneratePrompts = ref(false);
const pptPromptMode = ref(false);
const stylePreset = ref("professional");
const aspectRatio = ref("16:9");
const imagesOnly = ref(false);
const selectedVoice = ref("zh_male_beijingxiaoye_emo_v2_mars_bigtts");
const voiceOptions = ref([]);
const defaultDoubaoVoices = [
  { value: "zh_male_beijingxiaoye_emo_v2_mars_bigtts", label: "北京小爷（豆包1.0）", disabled: false }
];

const stylePresetGuides = {
  professional: "商务专业风格：参照国际顶级咨询公司（如麦肯锡、波士顿咨询）演示美学。线条精准利落，采用极细至中等线宽，通过精准间距创造呼吸感；色彩采用低饱和商务色系，以深蓝、石墨灰、高级灰为主色调，辅以少量金色或铜色作为强调色；阴影处理采用多层次灰度，通过精准的明度差建立立体感，高光处采用极浅灰或纯白提亮；画面兼具专业权威感与信息清晰度，图形元素经过精简化与几何化处理，数据可视化元素严谨精确；整体风格写实中带提炼，细节纹理克制而精准（如布料质感、金属光泽、玻璃反射）。数字渲染，高清分辨率（≥4K），画面干净纯粹，采用专业级平面设计中的精确渐变与透明叠加效果。",
  cartoon: "卡通插画风格：Gemini 手绘插画风格，参照 Google AI 生成艺术美学。线条流畅自然，采用手绘感数字笔触，粗细变化微妙富有韵律；色彩清新柔和，以低饱和的蓝绿、淡紫、暖灰为主色调，营造宁静科技感；阴影处理采用同色系加深手法，避免强烈对比，通过多层透明叠加创造深度；画面兼具概念抽象性与表达清晰度，元素经过几何简化与有机变形结合，数据可视化以隐喻性图示呈现；整体风格在抽象与具象间找到平衡，细节纹理保留手绘痕迹（如轻微线条抖动、自然渐变、柔和边缘）。数字手绘，高清分辨率（≥4K），画面干净通透，采用多层透明度叠加与柔和渐变效果。",
  tech: "未来科技风格：未来科技视觉语言，参照科幻界面与概念设计美学。线条精确锐利，采用发光线条与几何形状构建，粗细对比结合功能逻辑；色彩以冷色调为主，深空蓝、电子紫、量子青为主色调，辅以霓虹粉、激光绿作为强调色；阴影处理采用多层发光效果与透明叠加，创造深邃空间感；画面兼具未来感与信息清晰度，元素经过科技化处理，数据可视化以全息投影风格呈现；整体风格在现实与科幻间找到平衡，细节纹理清晰（如发光边缘、数据流动、网格背景）。数字渲染，高清分辨率（≥4K），画面干净锐利，采用发光渐变与透明叠加效果。",
  minimalist: "极简主义风格：参照包豪斯与瑞士平面设计美学的极简视觉语言。线条精确简练，采用单一或有限线宽，通过严格对齐与负空间创造呼吸感；色彩极度克制，以黑白灰为主，辅以单一强调色或无彩色系；阴影处理极其简略或无阴影，通过纯净色块对比建立空间关系；画面聚焦信息本质与视觉纯度，元素经过极简化与几何化处理，数据可视化以最基本图形呈现；整体风格高度提炼至本质，细节精确到每个像素，去除一切非必要元素。数字设计，高清分辨率（≥4K），画面纯净至极，采用严格网格系统与无衬线字体。"
};

const scenes = ref([]);
const scriptProvider = ref("");
const videoUrl = ref("");

const progressLogs = ref([]);
const latestPreview = ref(null);

const optimizeModalVisible = ref(false);
const optimizingSceneIndex = ref(null);
const optimizeStep = ref(0);
const optimizeLoading = ref(false);
const optimizePromptLoading = ref(false);
const optimizedPromptOverride = ref("");
const optimizeForm = reactive({
  coreMessage: "",
  secondaryMessage: "",
  hasAssets: "no",
  assetsCount: "",
  style: "realistic",
  themeEffect: ""
});

const getStaticUrl = (path) => getUrl(path);

const hasFailedMedia = computed(() => {
  return scenes.value.some(scene => !scene.image_url || (!imagesOnly.value && !scene.audio_url));
});

const optimizedPromptPreview = computed(() => {
  if (optimizedPromptOverride.value) {
    return optimizedPromptOverride.value;
  }
  if (optimizingSceneIndex.value === null || optimizingSceneIndex.value < 0 || optimizingSceneIndex.value >= scenes.value.length) {
    return "";
  }
  const core = optimizeForm.coreMessage.trim();
  const secondary = optimizeForm.secondaryMessage.trim();
  const theme = optimizeForm.themeEffect.trim();

  const cnParts = [];
  if (core) cnParts.push(`核心画面要传达：${core}`);
  if (secondary) cnParts.push(`辅助信息：${secondary}`);
  if (optimizeForm.hasAssets === "yes") {
    const countText = optimizeForm.assetsCount ? `${optimizeForm.assetsCount}个` : "若干个";
    cnParts.push(`画面中体现${countText}相关素材元素，如图表、图片、视频或二维码`);
  }
  if (optimizeForm.style === "realistic") {
    cnParts.push("整体风格偏写实摄影，光影自然，商务质感");
  } else if (optimizeForm.style === "cartoon") {
    cnParts.push("整体风格偏卡通插画，线条清晰，色彩明快");
  } else if (optimizeForm.style === "minimal") {
    cnParts.push("整体风格偏极简扁平设计，留白充足，信息清晰");
  }
  if (theme) {
    cnParts.push(`画面增加与「${theme}」主题相关的氛围和细节`);
  }

  const enParts = [];
  if (core) enParts.push(`focus on: ${core}`);
  if (secondary) enParts.push(`secondary info: ${secondary}`);
  if (optimizeForm.hasAssets === "yes") {
    enParts.push("include related assets like charts, images, videos or QR codes");
  }
  if (optimizeForm.style === "realistic") {
    enParts.push("realistic photography style, natural lighting, professional look");
  } else if (optimizeForm.style === "cartoon") {
    enParts.push("cartoon illustration style, clean lines, vivid colors");
  } else if (optimizeForm.style === "minimal") {
    enParts.push("minimal flat design, generous whitespace, clear information layout");
  }
  if (theme) {
    enParts.push(`enhance the theme of ${theme}, atmospheric lighting and details`);
  }

  const cn = cnParts.join("，");
  const en = enParts.join(", ");
  if (!cn && !en) {
    return "";
  }
  if (cn && en) {
    return `${cn}。 ${en}`;
  }
  if (cn) {
    return cn;
  }
  return en;
});

// Auto-retry logic
const stopAutoRetry = () => {
  if (autoRetryTimer.value) {
    clearInterval(autoRetryTimer.value);
    autoRetryTimer.value = null;
  }
};

const startAutoRetry = () => {
  stopAutoRetry(); // Clear existing
  if (autoRetryEnabled.value && hasFailedMedia.value) {
    // Execute immediately on start
    if (!loading.value) {
      console.log("Auto-retry started, executing immediately...");
      handleGenerateMedia();
    }
    
    autoRetryTimer.value = setInterval(() => {
      if (!loading.value && hasFailedMedia.value) {
        console.log("Auto-retrying media generation...");
        handleGenerateMedia();
      }
    }, autoRetryInterval.value);
  }
};

watch(autoRetryEnabled, (newValue) => {
  if (newValue) {
    startAutoRetry();
  } else {
    stopAutoRetry();
  }
});

watch(autoRetryInterval, () => {
  if (autoRetryEnabled.value) {
    startAutoRetry(); // Restart with new interval
  }
});

watch(hasFailedMedia, (newValue) => {
  if (!newValue) {
    // All success
    autoRetryEnabled.value = false;
    stopAutoRetry();
    message.success("所有素材补全完成！");
  }
});

onUnmounted(() => {
  stopAutoRetry();
});

// Step 1: Upload
const handleUpload = async ({ file, onSuccess, onError }) => {
  uploading.value = true;
  // progressLogs.value = []; // Don't reset logs for upload, only for generation
  try {
    const result = await uploadFile(file);
    uploadedText.value = result.extracted_text;
    filename.value = result.filename;
    message.success(`文件 ${file.name} 上传并解析成功！`);
    onSuccess("ok");
  } catch (error) {
    message.error('文件上传失败');
    onError(error);
  } finally {
    uploading.value = false;
  }
};

const handleGenerateScript = async () => {
  if (!uploadedText.value && !styleGuide.value) {
    message.warning("请先上传参考资料或填写其他特殊要求");
    return;
  }
  loading.value = true;
  progressLogs.value = []; // Reset logs
  
  // 组合预设风格和用户自定义风格
  let finalStyle = stylePresetGuides[stylePreset.value] || "商务专业风格：整体偏向专业商务演示，信息清晰，布局规范。";
  if (styleGuide.value) {
    finalStyle += `。额外要求：${styleGuide.value}`;
  }

  // Simulate progress logs while waiting for the non-streaming response
  let logTimer = null;
  let timeElapsed = 0;
  
  const simulateProgress = () => {
    timeElapsed += 1;
    if (timeElapsed === 2) progressLogs.value.push({ type: 'log', message: '📄 正在分析文档结构...' });
    if (timeElapsed === 5) progressLogs.value.push({ type: 'log', message: '🧠 正在提炼核心观点...' });
    if (timeElapsed === 8) progressLogs.value.push({ type: 'log', message: '🎬 正在构建分镜逻辑...' });
    if (timeElapsed === 12) progressLogs.value.push({ type: 'log', message: '✍️ 正在撰写分镜旁白...' });
    if (timeElapsed === 16) progressLogs.value.push({ type: 'log', message: '🎨 正在设计画面提示词...' });
    if (timeElapsed === 25) progressLogs.value.push({ type: 'log', message: '⏳ 内容较多，请耐心等待...' });
  };

  logTimer = setInterval(simulateProgress, 1000);

  try {
    const result = await generateScript(
      uploadedText.value, 
      finalStyle, 
      expectedSceneCount.value, 
      onlyGeneratePrompts.value,
      pptPromptMode.value
    );
    if (result.scenes) {
      scenes.value = result.scenes;
      scriptProvider.value = result.meta?.provider || "Local/Unknown";
      currentStep.value = 1;
      nextTick(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }, 100);
      });
    } else {
      message.error("解析脚本生成结果失败");
    }
  } catch (error) {
    message.error("生成脚本出错: " + error.message);
  } finally {
    if (logTimer) clearInterval(logTimer);
    loading.value = false;
  }
};

const handleImageUpload = async ({ file, onSuccess, onError }, index) => {
  try {
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');

    if (isImage) {
        const res = await uploadImage(file);
        if (res && res.url) {
            scenes.value[index].image_url = res.url;
            scenes.value[index].image_path = res.path;
            message.success(`分镜 ${index + 1} 图片上传成功`);
            onSuccess("ok");
        } else {
            throw new Error("Invalid response");
        }
    } else if (isAudio) {
        // Assume uploadAudio is imported from api.js (need to add it)
        // We added uploadAudio to api.js in previous step
        const res = await uploadAudio(file);
        if (res && res.url) {
            scenes.value[index].audio_url = res.url;
            scenes.value[index].audio_path = res.path;
            message.success(`分镜 ${index + 1} 音频上传成功`);
            onSuccess("ok");
        } else {
             throw new Error("Invalid response");
        }
    } else {
        throw new Error("不支持的文件类型");
    }
  } catch (e) {
    message.error("上传失败: " + e.message);
    onError(e);
  }
};

const addScene = (index) => {
  const newScene = {
    script: "请输入新的讲解词...",
    image_prompt: "请输入新的画面提示词...",
    image_url: null,
    audio_url: null
  };
  if (index !== undefined) {
    scenes.value.splice(index + 1, 0, newScene);
  } else {
    scenes.value.push(newScene);
  }
  message.success("已添加新分镜");
};

const deleteScene = (index) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个分镜吗？此操作无法撤销。',
    onOk() {
      scenes.value.splice(index, 1);
      message.success("已删除分镜");
    }
  });
};

const openOptimizeModal = (index) => {
  optimizingSceneIndex.value = index;
  optimizeStep.value = 0;
  optimizeForm.coreMessage = "";
  optimizeForm.secondaryMessage = "";
  optimizeForm.hasAssets = "no";
  optimizeForm.assetsCount = "";
  optimizeForm.style = "realistic";
  optimizeForm.themeEffect = "";
  optimizedPromptOverride.value = "";
  optimizeModalVisible.value = true;
};

const handleOptimizeNext = () => {
  if (optimizeStep.value === 0 && !optimizeForm.coreMessage.trim()) {
    message.warning("请先填写核心传达信息");
    return;
  }
  if (optimizeStep.value < 4) {
    optimizeStep.value += 1;
  }
};

const handleOptimizePrev = () => {
  if (optimizeStep.value > 0) {
    optimizeStep.value -= 1;
  }
};

const handleOptimizePrompt = async () => {
  if (optimizingSceneIndex.value === null || optimizingSceneIndex.value < 0 || optimizingSceneIndex.value >= scenes.value.length) {
    return;
  }
  const scene = scenes.value[optimizingSceneIndex.value];
  const basePrompt = scene.image_prompt || optimizedPromptPreview.value;
  if (!basePrompt) {
    message.warning("当前分镜暂无可用的提示词");
    return;
  }
  optimizePromptLoading.value = true;
  try {
    const payload = {
      original_prompt: basePrompt,
      core_message: optimizeForm.coreMessage || "",
      secondary_message: optimizeForm.secondaryMessage || "",
      has_assets: optimizeForm.hasAssets === "yes",
      assets_count: optimizeForm.assetsCount || "",
      style: optimizeForm.style || "",
      theme_effect: optimizeForm.themeEffect || ""
    };
    const result = await optimizeImagePrompt(payload);
    if (result && result.optimized_prompt) {
      scene.image_prompt = result.optimized_prompt;
      optimizedPromptOverride.value = result.optimized_prompt;
      message.success("提示词已通过大模型优化");
    } else {
      throw new Error("无效的优化结果");
    }
  } catch (e) {
    message.error("提示词优化失败: " + e.message);
  } finally {
    optimizePromptLoading.value = false;
  }
};

const handleOptimizeGenerate = async () => {
  if (optimizingSceneIndex.value === null || optimizingSceneIndex.value < 0 || optimizingSceneIndex.value >= scenes.value.length) {
    return;
  }
  const index = optimizingSceneIndex.value;
  const scene = scenes.value[index];
  const newPrompt = optimizedPromptPreview.value || scene.image_prompt;
  if (!newPrompt) {
    message.warning("提示词为空，无法生成图片");
    return;
  }
  optimizeLoading.value = true;
  try {
    const payloadScene = {
      ...scene,
      image_prompt: newPrompt
    };
    const result = await generateImageForScene(payloadScene, aspectRatio.value);
    if (result && result.image_url) {
      scene.image_prompt = newPrompt;
      scene.image_url = result.image_url;
      scene.image_path = result.image_path || scene.image_path;
      scenes.value.splice(index, 1, { ...scene });
      message.success("优化后的图片已生成并替换");
      optimizeModalVisible.value = false;
    } else {
      throw new Error("无效的图片生成结果");
    }
  } catch (e) {
    message.error("优化生图失败: " + e.message);
  } finally {
    optimizeLoading.value = false;
  }
};

const handleGenerateMedia = async (forceRegenerate = false) => {
  // If it's an event object (from direct click binding elsewhere), treat as false unless explicitly true
  if (typeof forceRegenerate === 'object') forceRegenerate = false;

  loading.value = true;
  progressLogs.value = []; // Reset logs
  latestPreview.value = null; // Reset preview
  currentStep.value = 2;
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  // Immediate user feedback before stream arrives
  progressLogs.value.push({ type: 'log', message: '开始生成素材，请稍候…' });

  // If forceRegenerate is true, clear existing media to force re-generation
  // 这对于用户在 Step 1 点击“生成”非常重要，确保应用最新的设置（如音色）并调用 API
  if (forceRegenerate) {
      scenes.value.forEach(scene => {
          scene.audio_url = null;
          scene.audio_path = null;
          // 同时清除图片，确保生图也重新走 API (特别是之前可能是本地生成的低质量图)
          scene.image_url = null;
          scene.image_path = null;
      });
      console.log("Media state cleared for regeneration");
  }

  try {
    const result = await generateMedia(scenes.value, (data) => {
      if (data.type === 'preview') {
        latestPreview.value = data;
        const idx = typeof data.index === 'number' ? data.index : -1;
        if (idx >= 0 && idx < scenes.value.length) {
          if (data.media_type === 'image') {
            scenes.value[idx].image_url = data.url;
          } else if (data.media_type === 'audio') {
            scenes.value[idx].audio_url = data.url;
          }
        }
      } else {
        const clean = { ...data, message: sanitizeLogMessage(data.message) };
        progressLogs.value.push(clean);
      }
      // Auto scroll to bottom (optional)
    }, aspectRatio.value, selectedVoice.value, forceRegenerate, imagesOnly.value);
    if (result && result.scenes) {
        scenes.value = result.scenes;
        nextTick(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
  } catch (error) {
    message.error("生成媒体资源出错: " + error.message);
  } finally {
    loading.value = false;
  }
};

const videoProgress = ref(0);
const videoStatusText = ref('准备中...');

const handleCreateVideo = async () => {
  // Check for missing audio
  for (let i = 0; i < scenes.value.length; i++) {
      const scene = scenes.value[i];
      // If there is image but no audio, and script is empty (meaning no TTS generated), warn user
      if (scene.image_url && !scene.audio_url) {
          message.warning(`分镜 ${i + 1} 缺少音频素材，请补充音频`);
          // Scroll to that scene?
          return; // Stop generation
      }
  }

  loading.value = true;
  currentStep.value = 3; // Switch to step 3 UI immediately
  progressLogs.value = []; // Reset logs
  videoProgress.value = 0;
  videoStatusText.value = '🎬 开始初始化视频合成引擎...';
  

  

    


  try {
    const result = await createVideo(scenes.value, aspectRatio.value, (data) => {
        if (data.type === 'progress') {
            videoProgress.value = data.percent;
            if (data.message) videoStatusText.value = data.message;
        } else if (data.type === 'log') {
             if (data.message) videoStatusText.value = data.message;
        }
    });
    
    if (result && result.video_url) {
        videoUrl.value = result.video_url;
        videoProgress.value = 100;
        videoStatusText.value = '✅ 视频合成完成！';
        
        // Delay slightly to show the completion state before switching UI
        setTimeout(() => {
            loading.value = false;
            // currentStep is already 3
            nextTick(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }, 1500);
    } else {
        loading.value = false;
    }
  } catch (error) {
    message.error("合成视频出错: " + error.message);
    currentStep.value = 2; // Revert to step 2 on error
    loading.value = false;
  }
  // Remove finally block to manually control loading state transition
};

const resetGenerator = () => {
  currentStep.value = 0;
  uploadedText.value = "";
  filename.value = "";
  scenes.value = [];
  videoUrl.value = "";
  progressLogs.value = [];
  scriptProvider.value = "";
  
  // Clear local storage
  localStorage.removeItem(STORAGE_KEY);
  message.success("已重置项目状态");
};

// Persistence Logic
const saveState = () => {
  const state = {
    currentStep: currentStep.value,
    uploadedText: uploadedText.value,
    filename: filename.value,
    stylePreset: stylePreset.value,
    aspectRatio: aspectRatio.value,
    selectedVoice: selectedVoice.value,
    scenes: scenes.value,
    scriptProvider: scriptProvider.value,
    videoUrl: videoUrl.value,
    imagesOnly: imagesOnly.value,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      // Restore if data exists (and expires after 24h maybe? nah, keep it simple)
      if (state.timestamp && Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
        // Expired (optional)
        return;
      }
      
      if (state.currentStep !== undefined) currentStep.value = state.currentStep;
      if (state.uploadedText) uploadedText.value = state.uploadedText;
      if (state.filename) filename.value = state.filename;
      if (state.stylePreset) stylePreset.value = state.stylePreset;
      if (state.aspectRatio) aspectRatio.value = state.aspectRatio;
      if (typeof state.imagesOnly === "boolean") imagesOnly.value = state.imagesOnly;
      
      // Validate voice
      if (state.selectedVoice && voiceOptions.value.some(v => v.value === state.selectedVoice)) {
          selectedVoice.value = state.selectedVoice;
      } else {
          // Default to first valid voice if stored one is missing
          if (voiceOptions.value.length > 0) {
            selectedVoice.value = voiceOptions.value[0].value;
          }
          console.log("Stored voice invalid, using default");
      }

      if (state.scenes) scenes.value = state.scenes;
      if (state.scriptProvider) scriptProvider.value = state.scriptProvider;
      if (state.videoUrl) videoUrl.value = state.videoUrl;
      
      console.log("State restored from local storage");
    }
  } catch (e) {
    console.error("Failed to load state", e);
  }
};

const handleGeneratePPT = async () => {
  if (aspectRatio.value !== "16:9" && aspectRatio.value !== "4:3") {
    message.warning("请使用16：9或4：3比例生成PPT");
    return;
  }

  if (!scenes.value || scenes.value.length === 0) {
    message.warning("暂无分镜图片可生成 PPT");
    return;
  }

  const hasImage = scenes.value.some(scene => !!scene.image_url || !!scene.image_path);
  if (!hasImage) {
    message.warning("暂无分镜图片可生成 PPT");
    return;
  }

  pptLoading.value = true;
  try {
    const result = await generatePPT(scenes.value);
    if (result && result.ppt_url) {
      const url = getStaticUrl(result.ppt_url);
      window.open(url, "_blank");
      message.success("PPT 生成成功");
      if (result.slide_ratio && result.slide_ratio === "other") {
        message.warning("当前图片比例不是16:9或4:3，幻灯片可能会变形，请选择正确的图片比例后重新生成。");
      }
    } else {
      throw new Error("无效的 PPT 生成结果");
    }
  } catch (e) {
    message.error("PPT 生成失败: " + e.message);
  } finally {
    pptLoading.value = false;
  }
};

const handleDownloadImages = async () => {
  if (!scenes.value || scenes.value.length === 0) {
    message.warning("暂无分镜图片可打包下载");
    return;
  }
  const hasImage = scenes.value.some(scene => !!scene.image_url || !!scene.image_path);
  if (!hasImage) {
    message.warning("暂无分镜图片可打包下载");
    return;
  }
  zipLoading.value = true;
  try {
    const result = await downloadImagesZip(scenes.value);
    if (result && result.zip_url) {
      const url = getStaticUrl(result.zip_url);
      window.open(url, "_blank");
      message.success("图片打包下载已生成");
    } else {
      throw new Error("无效的图片打包结果");
    }
  } catch (e) {
    message.error("图片打包下载失败: " + e.message);
  } finally {
    zipLoading.value = false;
  }
};

// Auto-save on changes
watch(
  [currentStep, uploadedText, filename, stylePreset, aspectRatio, selectedVoice, scenes, videoUrl, imagesOnly],
  () => {
    saveState();
  },
  { deep: true }
);

onMounted(async () => {
  voiceOptions.value = defaultDoubaoVoices;
  loadState();
  try {
    const res = await fetchDoubaoVoices();
    if (res && res.voices) {
      voiceOptions.value = res.voices.map(v => ({ value: v.value, label: v.label, disabled: v.available === false }));
      if (!voiceOptions.value.some(v => v.value === selectedVoice.value && !v.disabled)) {
        const firstAvailable = voiceOptions.value.find(v => !v.disabled);
        if (firstAvailable) selectedVoice.value = firstAvailable.value;
      }
    }
  } catch (e) {}
});
</script>

<style scoped>
.app-container {
  min-height: 100%;
  /* background: #f0f2f5; Removed for transparent integration */
  display: flex;
  flex-direction: column;
}

.header {
  /* background: #fff; Removed */
  padding: 0 40px;
  /* box-shadow: 0 4px 12px rgba(0,0,0,0.05); Removed */
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.1); Removed for cleaner look without header */
  display: flex;
  align-items: center;
  height: 0; /* Collapsed */
  overflow: hidden; /* Ensure hidden */
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}

.header-icon {
  display: none;
}

.header-title {
  display: none;
}

.content {
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: none;
  margin: 0 auto;
}

.steps-bar {
  max-width: 1200px;
  margin: 0 auto 25px auto;
}

.loading-container {
  text-align: center;
  margin: 100px 0;
}

.step-content {
  width: 100%;
}

.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent; /* Ensure card is transparent if needed, or let Antd handle it */
}

/* Make card body fill height */
:deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.uploaded-info {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.05); /* Dark mode compatible */
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-preview {
  margin-top: 12px;
  flex: 1;
  resize: none;
}

.style-section {
  margin-bottom: 32px;
}

.radio-group-wrapper {
  margin-top: 16px;
}

.upload-btn-wrapper {
  margin-top: 12px;
}

.mt-8 {
  margin-top: 12px;
}

.mt-24 {
  margin-top: 24px;
}

.editor-col {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.large-textarea {
  font-size: 15px;
  line-height: 1.6;
  padding: 12px;
}

.action-footer {
  text-align: center;
  margin-top: 60px;
}

.main-action-btn {
  padding: 0 60px;
  height: 56px;
  font-size: 20px;
  border-radius: 28px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.scene-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  width: 100%;
}

:deep(.ant-list-item) {
  width: 100%;
  display: block;
}

.media-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.image-wrapper {
  height: 240px; /* Taller images */
  overflow: hidden;
}

.image-placeholder {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  color: #999;
}

.media-desc {
  margin-top: 16px;
}

.mt-10 {
  margin-top: 12px;
}

.final-step {
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
}

.final-card {
  padding: 60px;
}

.video-container {
  margin: 40px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  background: #000;
}

.log-window {
  margin-top: 24px;
  text-align: left;
  max-width: 800px; /* Restore width */
  margin-left: auto;
  margin-right: auto;
  background: rgba(0,0,0,0.5); /* Darker background */
  padding: 20px;
  border-radius: 8px;
  height: auto; /* Auto height */
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  font-family: monospace;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.log-item {
  color: #88ff88;
  margin-bottom: 8px; /* More spacing */
  font-size: 14px; /* Larger font */
  line-height: 1.5;
}

.log-error {
  color: #ff4d4f;
}

/* Preview Monitor Styles */
.preview-monitor {
    max-width: 800px;
    margin: 0 auto 30px auto;
    background: #1f1f1f;
    border-radius: 12px;
    border: 1px solid #333;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: left;
}

.monitor-header {
    background: #2a2a2a;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
}

.monitor-title {
    color: #fff;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.blink-dot {
    width: 8px;
    height: 8px;
    background: #52c41a;
    border-radius: 50%;
    margin-right: 10px;
    animation: blink 1.5s infinite;
}

@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
}

.monitor-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 300px;
    justify-content: center;
}

.preview-item {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.preview-image-box img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.preview-audio-box {
    width: 100%;
    max-width: 500px;
    background: #2a2a2a;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.audio-icon-large {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 20px;
}

.monitor-info {
    width: 100%;
    border-top: 1px solid #333;
    padding-top: 20px;
    margin-top: auto;
}

.info-row {
    display: flex;
    margin-bottom: 8px;
    color: #aaa;
    font-size: 14px;
}

.info-row .label {
    width: 80px;
    flex-shrink: 0;
}

.info-row .value {
    color: #fff;
    flex: 1;
}

.source-badge {
    background: #177ddc;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.prompt-text {
    font-style: italic;
    color: #ddd;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
const sanitizeLogMessage = (msg) => {
  if (!msg) return '';
  return msg.replace(/\s*\(来源:[^)]+\)\s*/g, '');
};
