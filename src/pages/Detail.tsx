import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Card, CardBody } from '@heroui/react';
import { 
  ChevronLeftIcon, 
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useBuildingDetail } from '../hooks';
import { toChatAI } from '../utils/navigation';

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { building, loading, error } = useBuildingDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center align-items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <Button 
          variant="light"
          color="primary"
          startContent={<ChevronLeftIcon className="h-5 w-5 rounded-2xl" />}
          onPress={() => navigate(-1)}
          className="mb-5"
        >
          返回
        </Button>
        <Card className="border-danger-200 bg-danger-50">
          <CardBody>
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-danger-500 mr-2" />
              <h3 className="text-sm font-medium text-danger-800">加载失败</h3>
            </div>
            <p className="mt-2 text-sm text-danger-700">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="p-5">
        <Button 
          variant="light"
          color="primary"
          startContent={<ChevronLeftIcon className="h-5 w-5 rounded-2xl" />}
          onPress={() => navigate(-1)}
          className="mb-5"
        >
          返回
        </Button>
        <Card className="border-warning-200 bg-warning-50">
          <CardBody>
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 mr-2" />
              <h3 className="text-sm font-medium text-warning-800">未找到相关信息</h3>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center align-items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 h-screen">
      <div className="absolute top-6 left-6 z-50 rounded-2xl">
        <Button 
          isIconOnly
          variant="light"
          className="bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30  transition-all duration-300 rounded-xl"
          onPress={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-700 rounded-2xl" />
        </Button>
      </div>

      {/* 头部封面区域 - 渐变玻璃遮罩 */}
      <div className="relative h-80 overflow-hidden">
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${building.cover || '/map-cut.png'})`
          }}
        >
          {/* 渐变遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* 标题区域 - 玻璃质感容器 */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h1 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">
                {building.name}
              </h1>
              <p className="text-white/90 text-base leading-relaxed drop-shadow">
                {building.info}
              </p>
            </div>
          </div>
        </div>
      </div>

  {/* 内容区域 - 卡片布局 (响应式：窄屏垂直居中，宽屏横向多列) */}
  <div className="px-6 py-8 flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:items-start md:justify-center">
        
        {/* 信息提示卡片 */}
        {building.tips.info?.map((tip, index) => (
          <Card key={index} className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 ">
            <CardBody className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100/80 rounded-xl">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{tip.title}</h3>
                  <div className="space-y-2">
                    {tip.content.map((content, idx) => (
                      <div key={idx} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {/* 基本职能卡片 */}
  <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50">
          <CardBody className="p-6 h">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-emerald-100/80 rounded-xl">
                <BuildingOfficeIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">基本职能</h2>
            </div>
            
            <div className="space-y-3">
              {building.functions && building.functions.length > 0 ? (
                building.functions.map((func, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{func}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">暂无职能信息</p>
                </div>
              )}
            </div>

            {/* 职能提示卡片 */}
            {building.tips.functions?.map((tip, index) => (
              <div key={index} className="mt-6 p-4 bg-emerald-50/80 rounded-xl border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div key={idx} className="text-emerald-700 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* 学院办公点卡片 */}
  <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 ">
          <CardBody className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-purple-100/80 rounded-xl">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">学院办公点</h2>
            </div>
            
            <div className="space-y-3">
              {building.offices && building.offices.length > 0 ? (
                building.offices.map((office, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{office}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">暂无办公点信息</p>
                </div>
              )}
            </div>

            {/* 办公点提示卡片 */}
            {building.tips.offices?.map((tip, index) => (
              <div key={index} className="mt-6 p-4 bg-purple-50/80 rounded-xl border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div key={idx} className="text-purple-700 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* 其他活动卡片 */}
  <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 ">
          <CardBody className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-orange-100/80 rounded-xl">
                <InformationCircleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">其他信息</h2>
            </div>
            
            <div className="space-y-3">
              {building.activities && building.activities.length > 0 ? (
                building.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{activity}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <InformationCircleIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">暂无其他信息</p>
                </div>
              )}
            </div>

            {/* 活动提示卡片 */}
            {building.tips.activities?.map((tip, index) => (
              <div key={index} className="mt-6 p-4 bg-orange-50/80 rounded-xl border border-orange-100">
                <h4 className="font-semibold text-orange-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div key={idx} className="text-orange-700 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* 图片展示卡片 */}
        {building.imgs && building.imgs.length > 0 && (
          <Card className="w-full max-w-3xl mx-auto md:w-[98%] lg:w-[64%] bg-white/60 backdrop-blur-xl border border-white/50 ">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-pink-100/80 rounded-xl">
                  <PhotoIcon className="h-6 w-6 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">实景图片</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {building.imgs.map((img, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={img}
                      alt={`${building.name} 图片 ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => window.open(img, '_blank')}
                      onError={(e) => {
                        console.error('Image failed to load:', img);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', img);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <PhotoIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 底部链接卡片 */}
  <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-gradient-to-r from-[#39C5BB]/10 to-[#39C5BB]/20 backdrop-blur-xl border border-white/50 ">
          <CardBody className="p-6 text-center">
            <p className="text-gray-700 mb-4">想了解更多校园信息？</p>
            <Button
              onPress={toChatAI}
              variant="shadow"
              className="bg-[#39C5BB] hover:bg-[#2fb3a8] text-white font-semibold transition-colors duration-300 rounded-2xl"
            >
              进入漫游指北
            </Button>
          </CardBody>
        </Card>

        {/* 底部安全间距 */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Detail;
