import { useState, useEffect, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Card, CardBody } from '@heroui/react';
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { getLocationById } from '@/services/campus';
import { toChatAI } from '@/utils/navigation';

interface BuildingDetail {
  id: string;
  name: string;
  info: string;
  cover?: string;
  functions?: string[];
  offices?: string[];
  activities?: string[];
  imgs?: string[];
  tips: {
    info?: Array<{
      title: string;
      content: string[];
    }>;
    functions?: Array<{
      title: string;
      content: string[];
    }>;
    offices?: Array<{
      title: string;
      content: string[];
    }>;
    activities?: Array<{
      title: string;
      content: string[];
    }>;
  };
}

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [building, setBuilding] = useState<BuildingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchBuildingDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getLocationById(id);

        if (mounted) {
          setBuilding(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '获取建筑详情失败');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBuildingDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-200/30 rounded-full blur-2xl animate-pulse" />
          <Spinner size="lg" color="primary" className="relative z-10" />
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">加载中...</p>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
        <Button
          variant="light"
          color="primary"
          startContent={<ChevronLeftIcon className="h-5 w-5" />}
          onPress={() => navigate(-1)}
          className="mb-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
        >
          返回
        </Button>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-warning-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-warning-100">
              <BuildingOfficeIcon className="h-20 w-20 text-warning-500" />
            </div>
          </div>
          <Card className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-warning-100 shadow-xl rounded-2xl">
            <CardBody className="p-8 text-center">
              <h3 className="text-2xl font-bold text-warning-800 mb-4">未找到建筑信息</h3>
              <p className="text-warning-700 leading-relaxed mb-6">
                抱歉，没有找到相关的建筑详情数据
              </p>
              <Button
                color="warning"
                variant="flat"
                onPress={() => navigate(-1)}
                className="w-full rounded-xl border-1 border-amber-200 text-warning-700"
              >
                返回上一页
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <Button
          variant="light"
          color="primary"
          startContent={<ChevronLeftIcon className="h-5 w-5" />}
          onPress={() => navigate(-1)}
          className="mb-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
        >
          返回
        </Button>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-danger-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-danger-100">
              <ExclamationTriangleIcon className="h-20 w-20 text-danger-500" />
            </div>
          </div>
          <Card className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-danger-100 shadow-xl rounded-2xl">
            <CardBody className="p-8 text-center">
              <h3 className="text-2xl font-bold text-danger-800 mb-4">加载失败</h3>
              <p className="text-danger-700 leading-relaxed mb-6">{error}</p>
              <Button
                color="danger"
                variant="flat"
                onPress={() => window.location.reload()}
                className="w-full rounded-xl border-1 border-danger-700 text-danger-700"
              >
                重新加载
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

      <div className="relative h-80 md:h-96 lg:h-[40vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${building.cover || '/map-cut.png'})`,
          }}
        />

        {/* 标题区域 - 玻璃质感容器，居中显示在底部 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6 px-4">
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h1 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">{building.name}</h1>
            <p className="text-white/90 text-base leading-relaxed drop-shadow">{building.info}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 flex align-items-center flex-col gap-6 md:flex-row">
        {building.tips.info?.map((tip, index) => (
          <Card
            key={index}
            className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl"
          >
            <CardBody className="p-6 h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100/80 rounded-xl">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{tip.title}</h3>
                  <div className="space-y-2">
                    {tip.content.map((content, idx) => (
                      <div
                        key={idx}
                        className="text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl">
          <CardBody className="p-6">
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

            {building.tips.functions?.map((tip, index) => (
              <div
                key={index}
                className="mt-6 p-4 bg-emerald-50/80 rounded-xl border border-emerald-100"
              >
                <h4 className="font-semibold text-emerald-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div
                      key={idx}
                      className="text-emerald-700 text-sm"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl">
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

            {building.tips.offices?.map((tip, index) => (
              <div
                key={index}
                className="mt-6 p-4 bg-purple-50/80 rounded-xl border border-purple-100"
              >
                <h4 className="font-semibold text-purple-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div
                      key={idx}
                      className="text-purple-700 text-sm"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl">
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

            {building.tips.activities?.map((tip, index) => (
              <div
                key={index}
                className="mt-6 p-4 bg-orange-50/80 rounded-xl border border-orange-100"
              >
                <h4 className="font-semibold text-orange-800 mb-2">{tip.title}</h4>
                <div className="space-y-2">
                  {tip.content.map((content, idx) => (
                    <div
                      key={idx}
                      className="text-orange-700 text-sm"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {building.imgs && building.imgs.length > 0 && (
          <Card className="w-full max-w-3xl mx-auto md:w-[98%] lg:w-[64%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-pink-100/80 rounded-xl">
                  <PhotoIcon className="h-6 w-6 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">实景图片</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {building.imgs.map((img, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-xl bg-gray-100"
                  >
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

        <Card className="w-full max-w-3xl mx-auto md:w-[48%] lg:w-[32%] bg-gradient-to-r from-[#39C5BB]/10 to-[#39C5BB]/20 backdrop-blur-xl border border-white/50 rounded-2xl">
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

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Detail;
