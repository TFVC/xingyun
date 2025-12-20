import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const generateScript = async (contextText, styleGuide, expectedSceneCount, onlyGeneratePrompts, pptPromptMode) => {
    const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            context_text: contextText, 
            style_guide: styleGuide,
            expected_scene_count: expectedSceneCount ? parseInt(expectedSceneCount) : null,
            only_generate_prompts: onlyGeneratePrompts,
            ppt_prompt_mode: !!pptPromptMode
        }),
    });
    if (!response.ok) {
        throw new Error('Script generation failed');
    }
  return response.json();
};

export const generatePPT = async (scenes) => {
  const response = await fetch(`${API_BASE_URL}/generate-ppt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scenes }),
  });
  if (!response.ok) {
    let msg = 'PPT 生成失败';
    try {
      const err = await response.json();
      if (err && err.detail) msg = err.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return response.json();
};

export const downloadImagesZip = async (scenes) => {
  const response = await fetch(`${API_BASE_URL}/download-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scenes }),
  });
  if (!response.ok) {
    let msg = '图片打包下载失败';
    try {
      const err = await response.json();
      if (err && err.detail) msg = err.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return response.json();
};

export const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload-audio`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Audio upload failed');
    }
    return response.json();
};

export const generateMedia = async (scenes, onProgress, aspectRatio = "4:3", voice = null, forceImage = false, imagesOnly = false) => {
    try {
        const body = { scenes, aspect_ratio: aspectRatio };
        if (voice) {
            body.voice = voice;
        }
        if (forceImage) {
            body.force_image = true;
        }
        if (imagesOnly) {
            body.images_only = true;
        }

        const response = await fetch(`${API_BASE_URL}/generate-media`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Keep the last part if it's incomplete
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'log' || data.type === 'error' || data.type === 'preview') {
                        if (onProgress) onProgress(data);
                    } else if (data.type === 'result') {
                        return data; // Final result
                    }
                } catch (e) {
                    console.error("Error parsing JSON stream:", e);
                }
            }
        }
    } catch (error) {
        console.error("Stream error:", error);
        throw error;
    }
};

export const generateImageForScene = async (scene, aspectRatio = "16:9") => {
  const response = await fetch(`${API_BASE_URL}/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scene, aspect_ratio: aspectRatio }),
  });
  if (!response.ok) {
    let msg = '单张图片生成失败';
    try {
      const err = await response.json();
      if (err && err.detail) msg = err.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return response.json();
};

export const optimizeImagePrompt = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/optimize-image-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let msg = '提示词优化失败';
    try {
      const err = await response.json();
      if (err && err.detail) msg = err.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return response.json();
};

export const generatePromptFromScript = async (script) => {
  const response = await fetch(`${API_BASE_URL}/generate-image-prompt-from-script`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ script }),
  });
  if (!response.ok) {
    let msg = '根据讲稿生成提示词失败';
    try {
      const err = await response.json();
      if (err && err.detail) msg = err.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return response.json();
};

export const createVideo = async (scenes, aspectRatio, onProgress) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenes, aspect_ratio: aspectRatio }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'progress' || data.type === 'log') {
                        if (onProgress) onProgress(data);
                    } else if (data.type === 'error') {
                         if (onProgress) onProgress(data);
                         throw new Error(data.message);
                    } else if (data.type === 'result') {
                        return data;
                    }
                } catch (e) {
                    console.error("Error parsing JSON stream:", e);
                }
            }
        }
    } catch (error) {
        console.error("Video creation error:", error);
        throw error;
    }
};

export const getStaticUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8001${path}`;
};

export const fetchDoubaoVoices = async () => {
    const response = await api.get('/voices/tts1');
    return response.data;
};
