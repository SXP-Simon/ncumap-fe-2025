import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useBuildingDetail } from '../hooks';

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { building, loading, error } = useBuildingDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          返回
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">加载失败</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="p-5">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          返回
        </button>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">未找到相关信息</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* 顶部返回按钮 */}
      <div className="absolute top-5 left-5 z-50">
        <button 
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* 头部封面图片和标题 */}
      <div className="relative h-74 overflow-hidden">
        <div
          className="h-full bg-cover bg-center flex items-end p-5"
          style={{
            backgroundImage: `linear-gradient(to top, #F2F8FA 0%, transparent 50%, transparent 50%), url(${building.cover || '/map-cut.png'})`
          }}
        >
          <h1 className="text-blue-700 text-3xl font-bold m-0">
            {building.name}
          </h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        {/* 基本信息 */}
        <div className="mb-4 bg-blue-50 rounded-lg p-4 border-0">
          <p className="text-blue-800 text-base mb-4">
            {building.info}
          </p>
          
          {/* 信息提示卡片 */}
          {building.tips.info?.map((tip, index) => (
            <div key={index} className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <h5 className="text-lg font-semibold mb-2">{tip.title}</h5>
              {tip.content.map((content, idx) => (
                <div key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </div>
          ))}
        </div>

        {/* 基本职能 */}
        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <img src="/icons/基本职能.svg" alt="基本职能" className="w-6 h-6 mr-3" />
            <span className="text-blue-900 text-lg font-bold">基本职能</span>
          </div>
          <div>
            {building.functions && building.functions.length > 0 ? (
              building.functions.map((func, index) => (
                <p key={index} className="mb-2">{func}</p>
              ))
            ) : (
              <span className="text-gray-500">暂无</span>
            )}
          </div>
          
          {/* 职能提示卡片 */}
          {building.tips.functions?.map((tip, index) => (
            <div key={index} className="mt-4 bg-gray-50 rounded-lg p-4">
              <h5 className="text-lg font-semibold mb-2">{tip.title}</h5>
              {tip.content.map((content, idx) => (
                <div key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </div>
          ))}
        </div>

        {/* 学院办公点 */}
        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <img src="/icons/学院办公点.svg" alt="学院办公点" className="w-6 h-6 mr-3" />
            <span className="text-blue-900 text-lg font-bold">学院办公点</span>
          </div>
          <div>
            {building.offices && building.offices.length > 0 ? (
              building.offices.map((office, index) => (
                <p key={index} className="mb-2">{office}</p>
              ))
            ) : (
              <span className="text-gray-500">暂无</span>
            )}
          </div>
          
          {/* 办公点提示卡片 */}
          {building.tips.offices?.map((tip, index) => (
            <div key={index} className="mt-4 bg-gray-50 rounded-lg p-4">
              <h5 className="text-lg font-semibold mb-2">{tip.title}</h5>
              {tip.content.map((content, idx) => (
                <div key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </div>
          ))}
        </div>

        {/* 其他 */}
        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <img src="/icons/其他.svg" alt="其他" className="w-6 h-6 mr-3" />
            <span className="text-blue-900 text-lg font-bold">其他</span>
          </div>
          <div>
            {building.activities && building.activities.length > 0 ? (
              building.activities.map((activity, index) => (
                <p key={index} className="mb-2">{activity}</p>
              ))
            ) : (
              <span className="text-gray-500">暂无</span>
            )}
          </div>
          
          {/* 活动提示卡片 */}
          {building.tips.activities?.map((tip, index) => (
            <div key={index} className="mt-4 bg-gray-50 rounded-lg p-4">
              <h5 className="text-lg font-semibold mb-2">{tip.title}</h5>
              {tip.content.map((content, idx) => (
                <div key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </div>
          ))}
        </div>

        {/* 图片展示 */}
        {building.imgs && building.imgs.length > 0 && (
          <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {building.imgs.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${building.name} 图片 ${index + 1}`}
                  className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* 底部链接 */}
        <div className="text-center p-5 text-gray-600">
          进入
          <a 
            href="https://aiguide.ncuos.com/welcome" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mx-1 text-blue-600 hover:text-blue-800"
          >
            漫游指北
          </a>
          了解更多
        </div>
      </div>
    </div>
  );
};

export default Detail;
