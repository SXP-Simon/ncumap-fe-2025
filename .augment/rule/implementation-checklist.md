# NCU Map Frontend 迁移实施检查清单

## 项目初始化检查

### 包管理器迁移 (pnpm)
- [ ] 删除 `package-lock.json` 和 `node_modules`
- [ ] 安装 pnpm: `npm install -g pnpm`
- [ ] 创建 `.npmrc` 配置文件
- [ ] 执行 `pnpm install` 安装依赖
- [ ] 验证所有依赖正确安装

### 项目结构重构
- [ ] 创建新的目录结构
  - [ ] `src/components/map/` - 地图相关组件
  - [ ] `src/components/ui/` - UI组件封装
  - [ ] `src/components/layout/` - 布局组件
  - [ ] `src/hooks/` - 自定义Hooks
  - [ ] `src/services/` - API服务
  - [ ] `src/utils/coordinate/` - 坐标转换工具
  - [ ] `src/utils/map/` - 地图工具
  - [ ] `src/utils/common/` - 通用工具
  - [ ] `src/types/` - TypeScript类型定义
  - [ ] `src/constants/` - 常量定义
  - [ ] `src/styles/` - 样式文件

## 文件重命名检查

### 工具文件重命名
- [ ] `gcj02towgs84.ts` → `coordinateConverter.ts`
- [ ] 移动到 `src/utils/coordinate/` 目录
- [ ] 更新所有引用路径

### 组件文件重命名
- [ ] `OpenMap.tsx` → `MapContainer.tsx`
- [ ] `MapMark.tsx` → `MapMarker.tsx`
- [ ] 移动到对应的组件目录

### 函数和变量重命名
- [ ] `gcj02towgs84` → `convertGcj02ToWgs84`
- [ ] `transformlat` → `transformLatitude`
- [ ] `transformlng` → `transformLongitude`
- [ ] `geoSuccess` → `handleGeolocationSuccess`
- [ ] `bottomSheetSelect` → `handleBottomSheetSelection`
- [ ] `manualSelect` → `handleManualSelection`
- [ ] `toChatAI` → `navigateToChatAI`

## 功能迁移完整性检查

### 核心地图功能
- [ ] 地图容器组件 (`MapContainer.tsx`)
  - [ ] 地图初始化和渲染
  - [ ] 瓦片图层加载
  - [ ] 坐标转换系统
  - [ ] 地图交互事件处理
- [ ] 地图标记组件 (`MapMarker.tsx`)
  - [ ] 标记显示和样式
  - [ ] 标记点击事件
  - [ ] 基于缩放级别的显示/隐藏
- [ ] 地图工具函数
  - [ ] 坐标转换 (`coordinateConverter.ts`)
  - [ ] 地图边界检查
  - [ ] 距离计算

### 页面组件
- [ ] 主页组件 (`pages/Index.tsx`)
  - [ ] 选项卡切换功能
  - [ ] 底部抽屉菜单
  - [ ] 右侧功能按钮
  - [ ] 响应式布局
- [ ] 详情页组件 (`pages/Detail.tsx`)
  - [ ] 位置详情显示
  - [ ] 返回导航
  - [ ] 数据获取和展示
- [ ] 活动页面组件 (`pages/Activities.tsx`)
  - [ ] 活动列表显示
  - [ ] 活动详情页面
  - [ ] 活动筛选功能

### 用户界面组件
- [ ] 底部抽屉组件
  - [ ] 建筑选择菜单
  - [ ] 新生手册菜单
  - [ ] 活动列表菜单
- [ ] 弹窗组件
  - [ ] 校车信息弹窗
  - [ ] 确认对话框
  - [ ] 错误提示弹窗
- [ ] 功能按钮组件
  - [ ] 手册按钮
  - [ ] 校车按钮
  - [ ] 定位按钮
  - [ ] 问答按钮

### 数据管理
- [ ] API服务层 (`services/`)
  - [ ] 地图数据API (`mapService.ts`)
  - [ ] 新生手册API (`manualService.ts`)
  - [ ] 活动数据API (`activityService.ts`)
  - [ ] 统一请求拦截器
- [ ] 数据类型定义 (`types/`)
  - [ ] 地图相关类型 (`map.types.ts`)
  - [ ] API响应类型 (`api.types.ts`)
  - [ ] 组件属性类型 (`component.types.ts`)
- [ ] 常量定义 (`constants/`)
  - [ ] 地图常量 (`mapConstants.ts`)
  - [ ] API端点 (`apiEndpoints.ts`)
  - [ ] UI常量 (`uiConstants.ts`)

### 自定义Hooks
- [ ] 地图相关Hooks (`hooks/`)
  - [ ] `useMapContainer` - 地图容器逻辑
  - [ ] `useMapMarkers` - 标记管理
  - [ ] `useGeolocation` - 定位功能
- [ ] 数据获取Hooks
  - [ ] `useMapData` - 地图数据获取
  - [ ] `useManualData` - 手册数据获取
  - [ ] `useActivityData` - 活动数据获取
- [ ] UI交互Hooks
  - [ ] `useBottomSheet` - 底部抽屉状态
  - [ ] `useTabNavigation` - 选项卡导航
  - [ ] `useModal` - 弹窗状态管理

## 代码质量检查

### 中文注释完整性
- [ ] 所有组件都有详细的中文注释
- [ ] 所有公共函数都有中文注释
- [ ] 复杂逻辑都有行内注释
- [ ] 接口和类型都有中文说明

### TypeScript类型定义
- [ ] 所有组件属性都有类型定义
- [ ] 所有API响应都有类型定义
- [ ] 所有状态变量都有类型定义
- [ ] 消除所有 `any` 类型使用

### 代码规范
- [ ] 使用ESLint检查代码规范
- [ ] 使用Prettier格式化代码
- [ ] 组件命名符合PascalCase
- [ ] 函数命名符合camelCase
- [ ] 常量命名符合SCREAMING_SNAKE_CASE

### 错误处理
- [ ] 所有API调用都有错误处理
- [ ] 地图操作都有错误边界
- [ ] 用户友好的错误提示
- [ ] 错误日志记录

## 功能测试检查

### 地图功能测试
- [ ] 地图正常加载和显示
- [ ] 地图缩放和平移正常
- [ ] 标记正确显示
- [ ] 标记点击跳转正常
- [ ] 定位功能正常

### 用户界面测试
- [ ] 选项卡切换正常
- [ ] 底部抽屉打开/关闭正常
- [ ] 弹窗显示和关闭正常
- [ ] 按钮点击响应正常
- [ ] 响应式布局正常

### 数据流测试
- [ ] API数据获取正常
- [ ] 数据显示正确
- [ ] 状态更新正常
- [ ] 缓存机制正常

### 路由测试
- [ ] 主页路由正常
- [ ] 详情页路由正常
- [ ] 活动页路由正常
- [ ] 路由参数传递正常
- [ ] 浏览器前进/后退正常

## 性能优化检查

### 代码分割
- [ ] 路由级别的代码分割
- [ ] 组件级别的懒加载
- [ ] 第三方库的按需加载

### 资源优化
- [ ] 图片资源压缩
- [ ] 地图瓦片优化
- [ ] 静态资源缓存

### 运行时优化
- [ ] 组件渲染优化
- [ ] 事件处理优化
- [ ] 内存泄漏检查

## 部署准备检查

### 构建配置
- [ ] Vite配置优化
- [ ] 环境变量配置
- [ ] 构建产物检查

### 兼容性测试
- [ ] 现代浏览器兼容性
- [ ] 移动端兼容性
- [ ] 不同屏幕尺寸适配

### 文档完善
- [ ] README.md更新
- [ ] API文档完善
- [ ] 部署文档编写

## 最终验收标准

- [ ] 所有原有功能完整迁移
- [ ] 代码质量达到标准
- [ ] 性能表现良好
- [ ] 用户体验优秀
- [ ] 文档完整清晰
- [ ] 测试覆盖充分

完成以上所有检查项后，迁移工作即可视为完成。
