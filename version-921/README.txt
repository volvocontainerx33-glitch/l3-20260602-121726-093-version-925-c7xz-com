静态电影网站说明

- 影片数据来源：data_2000.txt，实际解析影片数已按生成报告写入。
- 页面结构：首页 index.html、分类总览 categories.html、10 个独立分类页、ranking.html、sitemap.html、每部影片独立详情页。
- 封面规则：页面已按要求引用顶级目录 1.jpg 到 150.jpg；请把真实图片放在网站根目录，文件名保持 1.jpg、2.jpg……150.jpg。
- 播放器：详情页已绑定本地 HLS 地址 assets/hls/stream.m3u8，并保留 MP4 fallback。替换真实源时，可修改详情页 data-hls-src 或批量替换 assets/hls/stream.m3u8。
- 百度统计代码：已写入每个 HTML 页面源码中，不作为页面文字展示。
