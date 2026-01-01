export default {
  props: {
    level: { type: Object, required: true }
  },

  template: `
    <div class="level-wrapper">
      <!-- keep your existing level card markup here -->
      <!-- ...existing code... -->

      <!-- video input area placed below the level card -->
      <div class="level-video-input" style="margin-top:12px; display:flex; align-items:center; gap:8px; width:100%;">
        <input
          type="url"
          v-model.trim="videoUrl"
          :placeholder="'Paste completion video URL (YouTube) for ' + (level && level.name ? level.name : '')"
          style="flex:1; padding:6px 8px; font-size:13px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); color:inherit; word-break:break-all;"
          @keyup.enter="saveVideo"
        />
        <button @click="saveVideo" style="padding:6px 10px;border-radius:6px;background:#2e8b57;color:white;border:none;cursor:pointer;font-size:13px;">
          Save
        </button>

        <a v-if="thumbId" :href="videoUrl" target="_blank" rel="noreferrer" style="display:inline-block;width:120px;height:68px;overflow:hidden;border-radius:6px;">
          <img :src="'https://img.youtube.com/vi/' + thumbId + '/mqdefault.jpg'" alt="thumb" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </a>
      </div>
    </div>
  `,

  data() {
    return {
      videoUrl: '',
      thumbId: null
    };
  },

  created() {
    const key = this._videoStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      this.videoUrl = stored;
      this.thumbId = this.getYouTubeId(this.videoUrl);
      if (this.level) this.level.video = this.videoUrl;
    } else if (this.level && this.level.video) {
      this.videoUrl = this.level.video;
      this.thumbId = this.getYouTubeId(this.videoUrl);
    }
  },

  methods: {
    _videoStorageKey() {
      return 'video:' + (this.level && (this.level.id || this.level.name) ? (this.level.id || this.level.name) : 'unknown');
    },

    getYouTubeId(url) {
      if (!url) return null;
      const patterns = [
        /(?:v=|v\/|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
        /youtube\.com.*[?&]v=([^&]+)/,
      ];
      for (const p of patterns) {
        const m = url.match(p);
        if (m && m[1]) return m[1];
      }
      return null;
    },

    saveVideo() {
      const trimmed = this.videoUrl ? this.videoUrl.trim() : '';
      const key = this._videoStorageKey();
      if (!trimmed) {
        localStorage.removeItem(key);
        if (this.level) { delete this.level.video; }
        this.thumbId = null;
        return;
      }
      try {
        localStorage.setItem(key, trimmed);
        if (this.level) this.level.video = trimmed;
        this.thumbId = this.getYouTubeId(trimmed);
      } catch (e) {
        console.warn('Failed to save video URL', e);
      }
    }
  }
};